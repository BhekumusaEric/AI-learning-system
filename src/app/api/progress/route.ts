import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET: Fetch user progress
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'guest';
  
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      return NextResponse.json({
        username: data.username,
        completedPages: data.completed_pages || {},
        createdAt: data.created_at,
        lastActive: data.last_active
      });
    } else {
        return NextResponse.json({
            completedPages: {},
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Update or Create user progress
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, completedPages } = body;
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const { data: existingUser } = await supabase
      .from('user_progress')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    let newCompletedPages = existingUser?.completed_pages || {};
    
    if (completedPages) {
        newCompletedPages = { ...newCompletedPages, ...completedPages };
    }

    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        username,
        completed_pages: newCompletedPages,
        last_active: new Date().toISOString()
      }, { onConflict: 'username' })
      .select()
      .maybeSingle();

    if (error) throw error;
    
    return NextResponse.json({ 
        success: true, 
        user: {
            username: data?.username || username,
            completedPages: data?.completed_pages || newCompletedPages
        } 
    });
  } catch (error) {
    console.error("Failed to update progress:", error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE: Remove user from DB
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username || username === 'guest') {
      return NextResponse.json({ error: 'Valid username is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('username', username);

    if (error) throw error;

    return NextResponse.json({ success: true, message: `User ${username} deleted.` });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
