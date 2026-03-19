import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

function generateLoginId(platform: string, count: number) {
  const prefix = platform === 'saaio' ? 'SAAIO' : 'DIP';
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(count + 1).padStart(3, '0')}`;
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
  const platformName = platform === 'dip' ? 'IDC SEF Digital Inclusion Program' : 'SAAIO Training Grounds';
  const loginUrl = platform === 'dip'
    ? 'https://ai-learning-system-ten.vercel.app/dip/login'
    : 'https://ai-learning-system-ten.vercel.app/login';

  const subject = isReset
    ? `Your password has been reset — ${platformName}`
    : `Welcome to ${platformName} — Your Login Credentials`;

  const adminEmail = process.env.ADMIN_EMAIL;
  const forwardNote = adminEmail
    ? `<div style="background:#1a1a00;border:1px solid #ffb86b;border-radius:8px;padding:12px;margin-bottom:20px;">
        <p style="color:#ffb86b;font-size:12px;margin:0;">📧 <strong>ADMIN:</strong> Please forward this email to <strong>${to}</strong></p>
       </div>`
    : '';

  const html = `
    <div style="font-family: monospace; background: #000; color: #fff; padding: 32px; max-width: 480px; margin: 0 auto; border-radius: 12px;">
      ${forwardNote}
      <h2 style="color: #00ff9d; margin-bottom: 8px;">${platformName}</h2>
      <p style="color: #b0b0b0; margin-bottom: 24px;">
        ${isReset ? `Hi ${full_name}, your password has been reset.` : `Hi ${full_name}, welcome! Here are your login credentials.`}
      </p>

      <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <div style="margin-bottom: 12px;">
          <span style="color: #b0b0b0; font-size: 12px;">LOGIN ID</span><br/>
          <span style="color: #00ff9d; font-size: 20px; font-weight: bold; letter-spacing: 2px;">${login_id}</span>
        </div>
        <div>
          <span style="color: #b0b0b0; font-size: 12px;">PASSWORD</span><br/>
          <span style="color: #ffb86b; font-size: 20px; font-weight: bold; letter-spacing: 4px;">${password}</span>
        </div>
      </div>

      <a href="${loginUrl}" style="display: block; background: #00ff9d; color: #000; text-align: center; padding: 12px; border-radius: 8px; font-weight: bold; text-decoration: none; margin-bottom: 24px;">
        Go to Login Page →
      </a>

      <p style="color: #555; font-size: 12px;">Keep these credentials safe. If you need help, contact your program administrator.</p>
    </div>
  `;

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const recipient = adminEmail || to;
  const subjectLine = adminEmail && adminEmail !== to
    ? `[FORWARD TO ${to}] ${subject}`
    : subject;

  await resend.emails.send({
    from: fromAddress,
    to: recipient,
    subject: subjectLine,
    html,
  });
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
    };
  });

  return NextResponse.json(result);
}

// POST: register a new student
export async function POST(request: Request) {
  const { full_name, email, platform } = await request.json();
  if (!full_name || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'saaio_students';
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

  // Send email if address provided and Resend is configured
  let emailSent = false;
  if (email && process.env.RESEND_API_KEY) {
    try {
      await sendCredentialsEmail({ to: email, full_name, login_id, password: plainPassword, platform });
      emailSent = true;
    } catch (e) {
      console.error('Failed to send credentials email:', e);
    }
  }

  return NextResponse.json({ ...data, plainPassword, emailSent });
}

// PATCH: reset a student's password
export async function PATCH(request: Request) {
  const { login_id, platform } = await request.json();
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'saaio_students';
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
  if (student?.email && process.env.RESEND_API_KEY) {
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
  const { searchParams } = new URL(request.url);
  const login_id = searchParams.get('login_id');
  const platform = searchParams.get('platform') || 'saaio';
  if (!login_id) return NextResponse.json({ error: 'login_id required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'saaio_students';
  const { error } = await supabase.from(table).delete().eq('login_id', login_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
