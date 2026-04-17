import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createHash } from 'crypto';
import { nextUniqueLoginId, withUniqueLoginIdRetry } from '@/lib/loginId';
import { buildCredentialsEmail, adminForwardSubject } from '@/lib/emailTemplate';
import { sendEmail } from '@/lib/email';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function sendCredentialsEmail({
  to, full_name, login_id, password, platform, isReset = false,
}: {
  to: string; full_name: string; login_id: string; password: string; platform: string; isReset?: boolean;
}) {
  const { subject, html } = buildCredentialsEmail({ full_name, login_id, password, platform, isReset });
  const adminEmail = process.env.ADMIN_EMAIL;
  const recipient = adminEmail || to;
  const subjectLine = adminEmail && adminEmail !== to ? adminForwardSubject(subject, to) : subject;

  await sendEmail({
    to_email: recipient,
    subject: subjectLine,
    message_html: html,
  });
}

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// GET: list all students for a platform, optionally filtered by cohort
export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') || 'saaio';
  const cohortId = searchParams.get('cohort_id');
  
  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
  const progressTable = platform === 'dip' ? 'dip_progress' : platform === 'wrp' ? 'wrp_progress' : 'saaio_progress';

  try {
    const certFields = (platform === 'dip' || platform === 'wrp') 
      ? sql`, s.certificate_requested, s.certificate_unlocked` 
      : sql``;

    // We join the student table with its corresponding progress table
    const students = await sql`
      SELECT 
        s.id, s.login_id, s.full_name, s.email, s.created_at, s.cohort_id
        ${certFields},
        p.completed_pages, p.last_active, p.exam_score, p.exam_passed
      FROM ${sql(table)} s
      LEFT JOIN ${sql(progressTable)} p ON s.login_id = p.login_id
      ${cohortId === 'unassigned' ? sql`WHERE s.cohort_id IS NULL` : cohortId ? sql`WHERE s.cohort_id = ${cohortId}` : sql``}
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
        cohortId: s.cohort_id,
        completedCount,
        lastActive: s.last_active,
        examScore: s.exam_score,
        examPassed: s.exam_passed,
        certificate_requested: s.certificate_requested ?? false,
        certificate_unlocked: s.certificate_unlocked ?? false
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[ADMIN_GET_STUDENTS_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: register a new student
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { full_name, email, platform, cohort_id } = await request.json();
  if (!full_name || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
  const plainPassword = generatePassword();
  const password_hash = hashPassword(plainPassword);

  try {
    const { data: student, error, login_id } = await withUniqueLoginIdRetry(platform, async (generated_id) => {
      try {
        const [res] = await sql`
          INSERT INTO ${sql(table)} (login_id, password_hash, full_name, email, cohort_id)
          VALUES (${generated_id}, ${password_hash}, ${full_name.trim()}, ${email?.trim() || null}, ${cohort_id || null})
          RETURNING id, login_id, full_name, email, created_at
        `;
        return { error: null, data: res };
      } catch (e: any) {
        return { error: e };
      }
    });

    if (error) throw error;

    // Send email if address provided and API key is configured
    let emailSent = false;
    if (email && process.env.WTC_EMAIL_API_KEY) {
      try {
        await sendCredentialsEmail({ to: email, full_name, login_id, password: plainPassword, platform });
        emailSent = true;
      } catch (e) {
        console.error('Failed to send credentials email:', e);
      }
    }

    return NextResponse.json({ ...student, plainPassword, emailSent });
  } catch (error: any) {
    console.error('[ADMIN_POST_STUDENT_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: reset password OR assign cohort
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { login_id, platform } = body;
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  try {
    // Cohort assignment
    if ('cohort_id' in body) {
      await sql`
        UPDATE ${sql(table)} SET cohort_id = ${body.cohort_id} WHERE login_id = ${login_id}
      `;
      return NextResponse.json({ success: true });
    }

    const plainPassword = generatePassword();
    const password_hash = hashPassword(plainPassword);

    const [student] = await sql`
      UPDATE ${sql(table)} SET password_hash = ${password_hash} 
      WHERE login_id = ${login_id} 
      RETURNING full_name, email
    `;

    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    // Send reset email if address exists and API is configured
    let emailSent = false;
    if (student.email && process.env.WTC_EMAIL_API_KEY) {
      try {
        await sendCredentialsEmail({
          to: student.email, full_name: student.full_name, login_id, password: plainPassword, platform, isReset: true,
        });
        emailSent = true;
      } catch (e) {
        console.error('Failed to send reset email:', e);
      }
    }

    await logAudit({ request, action: 'password_reset', target_login_id: login_id, target_platform: platform, details: { emailSent } });
    return NextResponse.json({ plainPassword, emailSent });
  } catch (error: any) {
    console.error('[ADMIN_PATCH_STUDENT_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: remove a student
export async function DELETE(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const login_id = searchParams.get('login_id');
  const platform = searchParams.get('platform') || 'saaio';
  if (!login_id) return NextResponse.json({ error: 'login_id required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
  
  try {
    await sql`DELETE FROM ${sql(table)} WHERE login_id = ${login_id}`;
    await logAudit({ request, action: 'student_deleted', target_login_id: login_id, target_platform: platform });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[ADMIN_DELETE_STUDENT_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
