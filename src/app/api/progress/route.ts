import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function getTable(loginId: string) {
  return loginId.startsWith('DIP-') ? 'dip_progress' : 'user_progress';
}

// GET: Fetch user progress
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'guest';

  const table = getTable(username);
  const idField = table === 'dip_progress' ? 'login_id' : 'username';

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(idField, username)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ completedPages: data?.completed_pages || {} });
}

// POST: Update user progress
export async function POST(request: Request) {
  const body = await request.json();
  const { username, completedPages, examScore, examPassed } = body;

  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const table = getTable(username);
  const idField = table === 'dip_progress' ? 'login_id' : 'username';

  // Merge with existing
  const { data: existing } = await supabase.from(table).select('completed_pages').eq(idField, username).maybeSingle();
  const merged = { ...(existing?.completed_pages || {}), ...(completedPages || {}) };

  const upsertPayload: Record<string, any> = {
    [idField]: username,
    completed_pages: merged,
    last_active: new Date().toISOString(),
  };
  if (examScore !== undefined) upsertPayload.exam_score = examScore;
  if (examPassed !== undefined) upsertPayload.exam_passed = examPassed;

  const { error } = await supabase.from(table).upsert(upsertPayload);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, completedPages: merged });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const table = getTable(username);
  const idField = table === 'dip_progress' ? 'login_id' : 'username';

  const { error } = await supabase.from(table).delete().eq(idField, username);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
