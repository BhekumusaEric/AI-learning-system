import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const PLATFORM_META = {
  dip: {
    name: 'IDC SEF Digital Inclusion Program',
    programTitle: 'Python Programming Fundamentals',
    certUrl: 'https://ai-learning-system-ten.vercel.app/dip/certificate',
    competencies: ['Variables & Data Types', 'Lists & Loops', 'Functions', 'Dictionaries', 'String Methods', 'Problem Solving'],
    table: 'dip_students',
    color: '#00ff9d',
  },
  wrp: {
    name: 'WeThinkCode_ Work Readiness Program',
    programTitle: 'Work Readiness Program',
    certUrl: 'https://ai-learning-system-ten.vercel.app/wrp/certificate',
    competencies: ['Verbal Communication', 'Written Communication', 'Interview Skills', 'LinkedIn & Personal Brand', 'CV & Resume Building', 'Workplace Readiness'],
    table: 'wrp_students',
    color: '#00ff9d',
  },
};

function buildCongratulationsEmail(full_name: string, platform: 'dip' | 'wrp') {
  const meta = PLATFORM_META[platform];
  const firstName = full_name.split(' ')[0];

  const competencyBadges = meta.competencies
    .map(c => `<span style="display:inline-block;font-size:11px;letter-spacing:1px;text-transform:uppercase;border:1px solid #0047AB;color:#0047AB;background:#e0e7ff;padding:4px 10px;border-radius:12px;margin:3px;font-weight:bold;">${c}</span>`)
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f7fa;">
  <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:560px;margin:40px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">

    <!-- Header -->
    <div style="background:#0047AB;border-bottom:1px solid #003380;padding:32px;text-align:center;">
      <p style="margin:0 0 8px 0;color:#ffffff;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">● ${meta.name}</p>
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:bold;letter-spacing:1px;">Congratulations, ${firstName}!</h1>
    </div>

    <!-- Body -->
    <div style="padding:36px 32px;">

      <p style="color:#334155;font-size:15px;line-height:1.8;margin:0 0 24px 0;">
        You've done it! You have successfully completed the
        <strong style="color:#0047AB;">${meta.programTitle}</strong> — and that is something to be genuinely proud of.
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.8;margin:0 0 28px 0;">
        Completing this program shows real commitment and dedication. The skills you've built here are a foundation you can carry forward into your career, your studies, and beyond.
      </p>

      <!-- Competencies -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:24px;margin-bottom:28px;text-align:center;">
        <p style="color:#64748b;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px 0;font-weight:bold;">Skills You've Earned</p>
        <div>${competencyBadges}</div>
      </div>

      <!-- Certificate CTA -->
      <div style="background:#ffffff;border:2px solid #0047AB;border-radius:10px;padding:24px;margin-bottom:28px;text-align:center;box-shadow:0 4px 10px rgba(0, 71, 171, 0.05);">
        <p style="color:#0047AB;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px 0;font-weight:bold;">Your Certificate is Ready</p>
        <p style="color:#475569;font-size:13px;margin:0 0 20px 0;line-height:1.6;">
          Your official Certificate of Completion is waiting for you. Download it and share it on LinkedIn, add it to your CV, or keep it as a record of your achievement.
        </p>
        <a href="${meta.certUrl}" style="display:inline-block;background:#0047AB;color:#ffffff;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;transition:background 0.2s;">
          Download My Certificate →
        </a>
      </div>

      <p style="color:#64748b;font-size:13px;line-height:1.8;margin:0;">
        Thank you for being part of this program. We hope this is just the beginning of your journey in tech. Keep building, keep learning, and keep going.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f1f5f9;border-top:1px solid #e2e8f0;padding:20px 32px;">
      <p style="color:#64748b;font-size:12px;margin:0;line-height:1.6;">
        ${meta.name}<br/>
        This is an automated message — please do not reply directly to this email.
      </p>
    </div>

  </div>
</body>
</html>`;

  return {
    subject: `Congratulations ${firstName} — Your Certificate of Completion is Ready!`,
    html,
  };
}

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// POST /api/admin/congratulate
// Body: { platform: 'dip' | 'wrp' }
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { platform } = await request.json();
  if (!platform || !PLATFORM_META[platform as 'dip' | 'wrp']) {
    return NextResponse.json({ error: 'platform must be dip or wrp' }, { status: 400 });
  }

  const meta = PLATFORM_META[platform as 'dip' | 'wrp'];

  const { data: students, error } = await supabase
    .from(meta.table)
    .select('full_name, email')
    .not('email', 'is', null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const recipients = (students || []).filter(s => s.email?.trim());
  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, message: 'No students with email addresses found' });
  }

  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL;

  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    recipients.map(async (s) => {
      try {
        const { subject, html } = buildCongratulationsEmail(s.full_name, platform as 'dip' | 'wrp');
        const to = adminEmail || s.email!;
        const subjectLine = adminEmail ? `[FORWARD TO ${s.email}] ${subject}` : subject;
        await sendEmail({ to_email: to, subject: subjectLine, message_html: html });
        sent++;
      } catch {
        failed++;
      }
    })
  );

  return NextResponse.json({ sent, failed, total: recipients.length });
}
