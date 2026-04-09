import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function getTable(loginId: string) {
  if (loginId.startsWith('DIP-')) return 'dip_progress';
  if (loginId.startsWith('WRP-')) return 'wrp_progress';
  return 'user_progress';
}

function getIdField(table: string) {
  return table === 'user_progress' ? 'username' : 'login_id';
}

// GET: Fetch user progress
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'guest';

  const table = getTable(username);
  const idField = getIdField(table);

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(idField, username)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ completedPages: data?.completed_pages || {}, examPassed: data?.exam_passed ?? null, examScore: data?.exam_score ?? null });
}

// POST: Update user progress
export async function POST(request: Request) {
  const body = await request.json();
  const { username, completedPages, examScore, examPassed } = body;

  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const table = getTable(username);
  const idField = getIdField(table);

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
  const idField = getIdField(table);

  const { error } = await supabase.from(table).delete().eq(idField, username);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
