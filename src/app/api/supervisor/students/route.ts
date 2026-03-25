import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function getSupervisorId(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/supervisor_id=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function hashPassword(p: string) { return createHash('sha256').update(p).digest('hex'); }

// GET — students in supervisor's cohorts, optionally filtered by cohort_id
export async function GET(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const cohortId = searchParams.get('cohort_id');
  const platform = searchParams.get('platform') || 'dip';

  // Get supervisor's cohort IDs
  const cohortQuery = supabase.from('cohorts').select('id').eq('supervisor_id', supervisorId).eq('platform', platform);
  const { data: cohorts } = cohortId
    ? await supabase.from('cohorts').select('id').eq('id', cohortId).eq('supervisor_id', supervisorId)
    : await cohortQuery;

  const cohortIds = (cohorts || []).map((c: any) => c.id);
  if (cohortIds.length === 0) return NextResponse.json([]);

  const table = platform === 'wrp' ? 'wrp_students' : 'dip_students';
  const progressTable = platform === 'wrp' ? 'wrp_progress' : 'dip_progress';

  const { data: students, error } = await supabase
    .from(table)
    .select('id, login_id, full_name, email, created_at, cohort_id')
    .in('cohort_id', cohortIds)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const loginIds = (students || []).map((s: any) => s.login_id);
  const { data: progress } = loginIds.length > 0
    ? await supabase.from(progressTable).select('*').in('login_id', loginIds)
    : { data: [] };

  const progressMap: Record<string, any> = {};
  (progress || []).forEach((p: any) => { progressMap[p.login_id] = p; });

  const result = (students || []).map((s: any) => {
    const prog = progressMap[s.login_id];
    const completedCount = prog ? Object.keys(prog.completed_pages || {}).filter((k: string) => prog.completed_pages[k]).length : 0;
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

// PATCH — reset a student's password (supervisor can only reset their own cohort's students)
export async function PATCH(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { login_id, platform } = await request.json();
  const table = platform === 'wrp' ? 'wrp_students' : 'dip_students';

  // Verify student belongs to supervisor's cohort
  const { data: student } = await supabase.from(table).select('full_name, email, cohort_id').eq('login_id', login_id).maybeSingle();
  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

  const { data: cohort } = await supabase.from('cohorts').select('supervisor_id').eq('id', student.cohort_id).maybeSingle();
  if (!cohort || cohort.supervisor_id !== supervisorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const plainPassword = generatePassword();
  await supabase.from(table).update({ password_hash: hashPassword(plainPassword) }).eq('login_id', login_id);

  return NextResponse.json({ plainPassword, full_name: student.full_name });
}
