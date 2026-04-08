import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { nextUniqueLoginId } from '@/lib/loginId';
import { buildCredentialsEmail, adminForwardSubject } from '@/lib/emailTemplate';
import { sendEmail } from '@/lib/email';

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
  const progressTable = platform === 'dip' ? 'dip_progress' : platform === 'wrp' ? 'wrp_progress' : 'user_progress';

  let query = supabase
    .from(table)
    .select('id, login_id, full_name, email, created_at, cohort_id')
    .order('created_at', { ascending: false });

  if (cohortId === 'unassigned') query = query.is('cohort_id', null);
  else if (cohortId) query = query.eq('cohort_id', cohortId);

  const { data: students, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: progress } = await supabase.from(progressTable).select('*');

  const progressMap: Record<string, any> = {};
  (progress || []).forEach((p: any) => {
    const key = p.login_id || p.username;
    progressMap[key] = p;
  });

  const result = (students || []).map((s: any) => {
    const prog = progressMap[s.login_id];
    const completedCount = prog
      ? Object.keys(prog.completed_pages || {}).filter((k: string) => (prog.completed_pages as any)[k]).length
      : 0;
    return {
      ...s,
      completedCount,
      lastActive: prog?.last_active || null,
      examScore: prog?.exam_score ?? null,
      examPassed: prog?.exam_passed ?? null,
      cohortId: s.cohort_id ?? null,
    };
  });

  return NextResponse.json(result);
}

// POST: register a new student
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { full_name, email, platform, cohort_id } = await request.json();
  if (!full_name || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
  const login_id = await nextUniqueLoginId(platform);
  const plainPassword = generatePassword();
  const password_hash = hashPassword(plainPassword);

  const insertData: any = { login_id, password_hash, full_name, email: email || null };
  if (cohort_id) insertData.cohort_id = cohort_id;

  const { data, error } = await supabase
    .from(table)
    .insert(insertData)
    .select('id, login_id, full_name, email, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email if address provided and Resend is configured
  let emailSent = false;
  if (email && process.env.WTC_EMAIL_API_KEY) {
    try {
      await sendCredentialsEmail({ to: email, full_name, login_id, password: plainPassword, platform });
      emailSent = true;
    } catch (e) {
      console.error('Failed to send credentials email:', e);
    }
  }

  return NextResponse.json({ ...data, plainPassword, emailSent });
}

// PATCH: reset password OR assign cohort
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { login_id, platform } = body;
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  // Cohort assignment
  if ('cohort_id' in body) {
    const { error } = await supabase.from(table).update({ cohort_id: body.cohort_id }).eq('login_id', login_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  const plainPassword = generatePassword();
  const password_hash = hashPassword(plainPassword);

  const { data: student, error: fetchError } = await supabase
    .from(table)
    .select('full_name, email')
    .eq('login_id', login_id)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const { error } = await supabase.from(table).update({ password_hash }).eq('login_id', login_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send reset email if address exists and Resend is configured
  let emailSent = false;
  if (student?.email && process.env.WTC_EMAIL_API_KEY) {
    try {
      await sendCredentialsEmail({
        to: student.email, full_name: student.full_name, login_id, password: plainPassword, platform, isReset: true,
      });
      emailSent = true;
    } catch (e) {
      console.error('Failed to send reset email:', e);
    }
  }

  return NextResponse.json({ plainPassword, emailSent });
}

// DELETE: remove a student
export async function DELETE(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const login_id = searchParams.get('login_id');
  const platform = searchParams.get('platform') || 'saaio';
  if (!login_id) return NextResponse.json({ error: 'login_id required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
  const { error } = await supabase.from(table).delete().eq('login_id', login_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
