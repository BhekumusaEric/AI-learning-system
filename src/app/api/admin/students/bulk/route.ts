import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { Resend } from 'resend';
import { nextUniqueLoginId } from '@/lib/loginId';
import { buildCredentialsEmail, adminForwardSubject } from '@/lib/emailTemplate';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to: recipient,
    subject: subjectLine,
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

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  const results: { full_name: string; login_id: string; plainPassword: string; email: string | null; success: boolean; error?: string; emailSent?: boolean }[] = [];
  const emailPromises: Promise<void>[] = [];

  for (const student of students) {
    const full_name = (student.full_name || '').trim();
    const email = (student.email || '').trim() || null;

    if (!full_name) {
      results.push({ full_name: '', login_id: '', plainPassword: '', email, success: false, error: 'Missing full_name' });
      continue;
    }

    // Get a unique ID fresh for each student — accounts for concurrent inserts
    const login_id = await nextUniqueLoginId(platform);
    const plainPassword = generatePassword();
    const password_hash = hashPassword(plainPassword);

    const { error: insertError } = await supabase
      .from(table)
      .insert({ login_id, password_hash, full_name, email });

    if (insertError) {
      results.push({ full_name, login_id, plainPassword: '', email, success: false, error: insertError.message });
      continue;
    }

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
