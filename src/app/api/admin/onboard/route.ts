import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createHash } from 'crypto';
import { withUniqueLoginIdRetry } from '@/lib/loginId';
import { buildCredentialsEmail, adminForwardSubject } from '@/lib/emailTemplate';
import { getPlatformFromProgram } from '@/lib/applications';
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

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { students, cohortName, program } = await request.json();
  
  if (!students || !Array.isArray(students) || !cohortName || !program) {
    return NextResponse.json({ error: 'Students, cohortName, and program required' }, { status: 400 });
  }

  const platform = getPlatformFromProgram(program);
  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  // 1. Create or get the cohort
  let cohortId: string;
  try {
    const existing = await sql`
      SELECT id FROM cohorts WHERE name = ${cohortName} AND platform = ${platform}
    `;

    if (existing.length > 0) {
      cohortId = existing[0].id;
    } else {
      const [newCohort] = await sql`
        INSERT INTO cohorts (name, platform, archived)
        VALUES (${cohortName}, ${platform}, false)
        RETURNING id
      `;
      cohortId = newCohort.id;
    }
  } catch (e: any) {
    return NextResponse.json({ error: `Cohort operation failed: ${e.message}` }, { status: 500 });
  }

  const results: any[] = [];
  const emailPromises: Promise<void>[] = [];

  // 2. Process each student
  for (const student of students) {
    const full_name = (student.Full_Name || `${student.First_Name} ${student.Last_Name}`).trim();
    const email = (student.Email_Address || '').trim() || null;

    const plainPassword = generatePassword();
    const password_hash = hashPassword(plainPassword);

    const { error: insertError, login_id } = await withUniqueLoginIdRetry(platform, async (generated_id, trx: any) => {
      try {
        await trx`
          INSERT INTO ${trx(table)} (login_id, password_hash, full_name, email, cohort_id)
          VALUES (${generated_id}, ${password_hash}, ${full_name}, ${email}, ${cohortId})
        `;
        return { error: null };
      } catch (e: any) {
        return { error: e };
      }
    });

    if (insertError) {
      results.push({ full_name, success: false, error: insertError.message });
      continue;
    }

    const resultEntry = { full_name, login_id, plainPassword, email, success: true, emailSent: false };
    results.push(resultEntry);

    if (email && process.env.WTC_EMAIL_API_KEY) {
      emailPromises.push(
        sendCredentialsEmail(email, full_name, login_id, plainPassword, platform)
          .then(() => { resultEntry.emailSent = true; })
          .catch((e: any) => console.error(`Email failed for ${login_id}:`, e.message))
      );
    }
  }

  await Promise.allSettled(emailPromises);

  return NextResponse.json({ 
    success: true, 
    results, 
    cohortId,
    cohortName 
  });
}
