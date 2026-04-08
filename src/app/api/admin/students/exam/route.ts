import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

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

  try {
    await sql`
      INSERT INTO dip_progress (login_id)
      VALUES (${login_id})
      ON CONFLICT (login_id) DO UPDATE SET ${sql(updates)}
    `;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
