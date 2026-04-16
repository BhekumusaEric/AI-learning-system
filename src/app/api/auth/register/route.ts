import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { nextUniqueLoginId, withUniqueLoginIdRetry } from '@/lib/loginId';
import { buildCredentialsEmail, adminForwardSubject } from '@/lib/emailTemplate';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function hashPassword(p: string) {
  return createHash('sha256').update(p).digest('hex');
}

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function sendCredentialsEmail(to: string, full_name: string, login_id: string, password: string, platform: string) {
  const { subject, html } = buildCredentialsEmail({ full_name, login_id, password, platform });
  const adminEmail = process.env.ADMIN_EMAIL;
  const recipient = adminEmail || to;
  const subjectLine = adminEmail && adminEmail !== to ? adminForwardSubject(subject, to) : subject;

  await sendEmail({
    to_email: recipient,
    subject: subjectLine,
    message_html: html,
  });
}

// POST /api/auth/register
// Body: { full_name, email, platform: 'dip' | 'saaio' }
export async function POST(request: Request) {
  const { full_name, email, platform } = await request.json();

  if (!full_name?.trim() || !email?.trim() || !platform) {
    return NextResponse.json({ error: 'full_name, email, and platform are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const { data: existing } = await supabase
    .from(table)
    .select('login_id, full_name')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ already_registered: true, login_id: existing.login_id, full_name: existing.full_name });
  }

  const plainPassword = generatePassword();
  const password_hash = hashPassword(plainPassword);

  const { error: insertError, login_id } = await withUniqueLoginIdRetry(platform, async (generated_id) => {
    return await supabase
      .from(table)
      .insert({ login_id: generated_id, password_hash, full_name: full_name.trim(), email: normalizedEmail });
  });

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  // Send credentials email
  let emailSent = false;
  if (process.env.WTC_EMAIL_API_KEY) {
    try {
      await sendCredentialsEmail(normalizedEmail, full_name.trim(), login_id, plainPassword, platform);
      emailSent = true;
    } catch (e: any) {
      console.error('Failed to send registration email:', e.message);
    }
  }

  return NextResponse.json({ already_registered: false, login_id, full_name: full_name.trim(), plainPassword, emailSent });
}
