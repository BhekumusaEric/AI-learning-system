import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

function generateLoginId(platform: string, count: number) {
  const prefix = platform === 'saaio' ? 'SAAIO' : 'DIP';
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(count + 1).padStart(3, '0')}`;
}

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// GET: list all students for a platform
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') || 'saaio';
  const table = platform === 'dip' ? 'dip_students' : 'saaio_students';
  const progressTable = platform === 'dip' ? 'dip_progress' : 'user_progress';

  const { data: students, error } = await supabase
    .from(table)
    .select('id, login_id, full_name, email, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch progress for each student
  const { data: progress } = await supabase
    .from(progressTable)
    .select('*');

  const progressMap: Record<string, any> = {};
  (progress || []).forEach((p: any) => {
    const key = p.login_id || p.username;
    progressMap[key] = p;
  });

  const result = (students || []).map((s: any) => {
    const prog = progressMap[s.login_id];
    const completedCount = prog ? Object.keys(prog.completed_pages || {}).filter((k: string) => (prog.completed_pages as any)[k]).length : 0;
    return {
      ...s,
      completedCount,
      lastActive: prog?.last_active || null,
      examScore: prog?.exam_score ?? null,
      examPassed: prog?.exam_passed ?? null,
    };
  });

  return NextResponse.json(result);
}

// POST: register a new student
export async function POST(request: Request) {
  const { full_name, email, platform } = await request.json();
  if (!full_name || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'saaio_students';

  // Count existing students to generate sequential ID
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
  const login_id = generateLoginId(platform, count || 0);
  const plainPassword = generatePassword();
  const password_hash = hashPassword(plainPassword);

  const { data, error } = await supabase
    .from(table)
    .insert({ login_id, password_hash, full_name, email: email || null })
    .select('id, login_id, full_name, email, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return plain password ONCE — never stored in plain text
  return NextResponse.json({ ...data, plainPassword });
}

// DELETE: remove a student
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const login_id = searchParams.get('login_id');
  const platform = searchParams.get('platform') || 'saaio';
  if (!login_id) return NextResponse.json({ error: 'login_id required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'saaio_students';
  const { error } = await supabase.from(table).delete().eq('login_id', login_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
