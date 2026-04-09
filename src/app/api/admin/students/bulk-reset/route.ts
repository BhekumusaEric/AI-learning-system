import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
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

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// POST /api/admin/students/bulk-reset
// Body: { platform, only_missing?: boolean }
// only_missing=true  → only reset students who have no password yet
// only_missing=false → reset ALL students
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { platform, only_missing = true } = await request.json();
  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  // Fetch students
  let query = supabase.from(table).select('login_id, full_name, email, password_hash');
  if (only_missing) query = query.is('password_hash', null);

  const { data: students, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!students?.length) return NextResponse.json({ updated: 0, emailed: 0 });

  let updated = 0;
  let emailed = 0;
  const adminEmail = process.env.ADMIN_EMAIL;

  await Promise.all(students.map(async (s) => {
    const plain = generatePassword();
    const hash = hashPassword(plain);

    const { error: updateError } = await supabase
      .from(table)
      .update({ password_hash: hash })
      .eq('login_id', s.login_id);

    if (updateError) return;
    updated++;

    if (s.email && process.env.WTC_EMAIL_API_KEY) {
      try {
        const { subject, html } = buildCredentialsEmail({
          full_name: s.full_name,
          login_id: s.login_id,
          password: plain,
          platform,
          isReset: !!s.password_hash,
        });
        const to = adminEmail || s.email;
        const subjectLine = adminEmail ? adminForwardSubject(subject, s.email) : subject;
        await sendEmail({ to_email: to, subject: subjectLine, message_html: html });
        emailed++;
      } catch {}
    }
  }));

  return NextResponse.json({ updated, emailed });
}
