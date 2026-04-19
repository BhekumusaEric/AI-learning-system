import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
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

  try {
    // 1. Get supervisor's cohort IDs
    let cohortIds: string[] = [];
    if (cohortId) {
      const cohort = await sql`
        SELECT id FROM cohorts WHERE id = ${cohortId} AND supervisor_id = ${supervisorId}
      `;
      cohortIds = cohort.map(c => c.id);
    } else {
      const cohorts = await sql`
        SELECT id FROM cohorts WHERE supervisor_id = ${supervisorId} AND platform = ${platform}
      `;
      cohortIds = cohorts.map(c => c.id);
    }

    if (cohortIds.length === 0) return NextResponse.json([]);

    // 2. Fetch students AND their progress in a single joined query
    const table = platform === 'wrp' ? 'wrp_students' : 'dip_students';
    const progressTable = platform === 'wrp' ? 'wrp_progress' : 'dip_progress';

    // Filter by cohort list
    const students = await sql`
      SELECT 
        s.id, s.login_id, s.full_name, s.email, s.created_at, s.cohort_id,
        p.completed_pages, p.last_active, p.exam_score, p.exam_passed
      FROM ${sql(table)} s
      LEFT JOIN ${sql(progressTable)} p ON s.login_id = p.login_id
      WHERE s.cohort_id IN ${sql(cohortIds)}
      ORDER BY s.created_at DESC
    `;

    const result = students.map((s: any) => {
      const completedCount = Object.keys(s.completed_pages || {}).filter((k: string) => (s.completed_pages as any)[k]).length;
      return {
        id: s.id,
        login_id: s.login_id,
        full_name: s.full_name,
        email: s.email,
        created_at: s.created_at,
        cohort_id: s.cohort_id,
        completedCount,
        lastActive: s.last_active,
        examScore: s.exam_score,
        examPassed: s.exam_passed
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[SUPERVISOR_GET_STUDENTS_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — reset a student's password (supervisor can only reset their own cohort's students)
export async function PATCH(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { login_id, platform } = await request.json();
  const table = platform === 'wrp' ? 'wrp_students' : 'dip_students';

  try {
    // Verify student exists and belongs to supervisor's cohort via JOIN
    const result = await sql`
      SELECT s.full_name, s.email, c.supervisor_id
      FROM ${sql(table)} s
      JOIN cohorts c ON s.cohort_id = c.id
      WHERE s.login_id = ${login_id}
    `;

    if (result.length === 0) return NextResponse.json({ error: 'Student not found or cohort missing' }, { status: 404 });
    if (result[0].supervisor_id !== supervisorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const plainPassword = generatePassword();
    await sql`
      UPDATE ${sql(table)} SET password_hash = ${hashPassword(plainPassword)} WHERE login_id = ${login_id}
    `;

    return NextResponse.json({ plainPassword, full_name: result[0].full_name });
  } catch (error: any) {
    console.error('[SUPERVISOR_PATCH_STUDENT_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
