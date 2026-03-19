import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

function hashPassword(p: string) {
  return createHash('sha256').update(p).digest('hex');
}

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateLoginId(platform: string, index: number) {
  const prefix = platform === 'dip' ? 'DIP' : 'SAAIO';
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(index).padStart(3, '0')}`;
}

async function sendCredentialsEmail(to: string, full_name: string, login_id: string, password: string, platform: string) {
  const platformName = platform === 'dip' ? 'IDC SEF Digital Inclusion Program' : 'SAAIO Training Grounds';
  const loginUrl = platform === 'dip'
    ? 'https://ai-learning-system-ten.vercel.app/dip/login'
    : 'https://ai-learning-system-ten.vercel.app/login';

  const adminEmail = process.env.ADMIN_EMAIL;
  const recipient = adminEmail || to;
  const subject = adminEmail && adminEmail !== to
    ? `[FORWARD TO ${to}] Welcome to ${platformName} — Your Login Credentials`
    : `Welcome to ${platformName} — Your Login Credentials`;

  const forwardNote = adminEmail && adminEmail !== to
    ? `<div style="background:#1a1a00;border:1px solid #ffb86b;border-radius:8px;padding:12px;margin-bottom:20px;">
        <p style="color:#ffb86b;font-size:12px;margin:0;">📧 <strong>ADMIN:</strong> Please forward this email to <strong>${to}</strong></p>
       </div>`
    : '';

  const html = `
    <div style="font-family:monospace;background:#000;color:#fff;padding:32px;max-width:480px;margin:0 auto;border-radius:12px;">
      ${forwardNote}
      <h2 style="color:#00ff9d;margin-bottom:8px;">${platformName}</h2>
      <p style="color:#b0b0b0;margin-bottom:24px;">Hi ${full_name}, welcome! Here are your login credentials.</p>
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:20px;margin-bottom:24px;">
        <div style="margin-bottom:12px;">
          <span style="color:#b0b0b0;font-size:12px;">LOGIN ID</span><br/>
          <span style="color:#00ff9d;font-size:20px;font-weight:bold;letter-spacing:2px;">${login_id}</span>
        </div>
        <div>
          <span style="color:#b0b0b0;font-size:12px;">PASSWORD</span><br/>
          <span style="color:#ffb86b;font-size:20px;font-weight:bold;letter-spacing:4px;">${password}</span>
        </div>
      </div>
      <a href="${loginUrl}" style="display:block;background:#00ff9d;color:#000;text-align:center;padding:12px;border-radius:8px;font-weight:bold;text-decoration:none;margin-bottom:24px;">Go to Login Page →</a>
      <p style="color:#555;font-size:12px;">Keep these credentials safe. If you need help, contact your program administrator.</p>
    </div>`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: recipient,
    subject,
    html,
  });
}

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// POST /api/admin/students/bulk
// Body: { platform: 'saaio'|'dip', students: [{ full_name, email? }] }
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { platform, students } = await request.json();
  if (!platform || !Array.isArray(students) || students.length === 0) {
    return NextResponse.json({ error: 'platform and students array required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : 'saaio_students';

  // Get current count to generate sequential IDs
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
  let nextIndex = (count || 0) + 1;

  const results: { full_name: string; login_id: string; plainPassword: string; email: string | null; success: boolean; error?: string; emailSent?: boolean }[] = [];
  const emailPromises: Promise<void>[] = [];

  for (const student of students) {
    const full_name = (student.full_name || '').trim();
    const email = (student.email || '').trim() || null;

    if (!full_name) {
      results.push({ full_name: '', login_id: '', plainPassword: '', email, success: false, error: 'Missing full_name' });
      continue;
    }

    const login_id = generateLoginId(platform, nextIndex);
    const plainPassword = generatePassword();
    const password_hash = hashPassword(plainPassword);

    const { error: insertError } = await supabase
      .from(table)
      .insert({ login_id, password_hash, full_name, email });

    if (insertError) {
      results.push({ full_name, login_id, plainPassword: '', email, success: false, error: insertError.message });
      continue;
    }

    nextIndex++;
    const resultEntry = { full_name, login_id, plainPassword, email, success: true, emailSent: false };
    results.push(resultEntry);

    // Fire emails in parallel — don't block the loop
    if (email && process.env.RESEND_API_KEY) {
      emailPromises.push(
        sendCredentialsEmail(email, full_name, login_id, plainPassword, platform)
          .then(() => { resultEntry.emailSent = true; })
          .catch((e: any) => console.error(`Email failed for ${login_id}:`, e.message))
      );
    }
  }

  // Wait for all emails to finish before responding
  await Promise.allSettled(emailPromises);

  const succeeded = results.filter(r => r.success).length;
  return NextResponse.json({ succeeded, total: students.length, results });
}
