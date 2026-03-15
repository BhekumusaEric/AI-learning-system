import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET: Fetch user progress
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'guest';

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) throw error;

    // Transform to mobile app format
    const progress = data ? Object.entries(data.completed_pages || {}).map(([contentId, progressData]: [string, any]) => ({
      contentId,
      status: progressData.status || 'completed',
      progressPercentage: progressData.progressPercentage || 100,
      timeSpent: progressData.timeSpent || 0,
      completedAt: progressData.completedAt,
      lastAccessedAt: progressData.lastAccessedAt,
    })) : [];

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Update user progress
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contentId, progressPercentage, timeSpent, status } = body;

    // For demo purposes, use a default username
    const username = 'mobile_user';

    if (!contentId) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }

    // Get existing progress
    const { data: existingData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    const completedPages = existingData?.completed_pages || {};

    // Update progress for this content
    completedPages[contentId] = {
      status: status || 'in_progress',
      progressPercentage: progressPercentage || 0,
      timeSpent: timeSpent || 0,
      completedAt: status === 'completed' ? new Date().toISOString() : null,
      lastAccessedAt: new Date().toISOString(),
    };

    // Upsert progress
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        username,
        completed_pages: completedPages,
        last_active: new Date().toISOString(),
      });

    if (error) throw error;

    return NextResponse.json({
      contentId,
      status: completedPages[contentId].status,
      progressPercentage: completedPages[contentId].progressPercentage,
      timeSpent: completedPages[contentId].timeSpent,
      completedAt: completedPages[contentId].completedAt,
      lastAccessedAt: completedPages[contentId].lastAccessedAt,
    });
  } catch (error) {
    console.error("Failed to update progress:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
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
