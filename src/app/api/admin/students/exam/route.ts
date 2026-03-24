import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// PATCH /api/admin/students/exam  { login_id, exam_score, exam_passed }
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { login_id, exam_score, exam_passed } = await request.json();
  if (!login_id) return NextResponse.json({ error: 'login_id required' }, { status: 400 });

  const score = exam_score !== undefined ? Number(exam_score) : undefined;
  if (score !== undefined && (isNaN(score) || score < 0 || score > 100)) {
    return NextResponse.json({ error: 'exam_score must be 0–100' }, { status: 400 });
  }

  const updates: Record<string, any> = {};
  if (score !== undefined) updates.exam_score = score;
  if (exam_passed !== undefined) updates.exam_passed = exam_passed;

  // Upsert into dip_progress
  const { error } = await supabase
    .from('dip_progress')
    .upsert({ login_id, ...updates }, { onConflict: 'login_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
