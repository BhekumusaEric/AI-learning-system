import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const PLATFORM_META = {
  dip: {
    name: 'IDC SEF Digital Inclusion Program',
    programTitle: 'Digital Inclusion Program',
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
  const firstName_cap = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

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
        You've done it! You have successfully completed the <strong style="color:#0047AB;">${meta.programTitle}</strong> — and that is something to be genuinely proud of.
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

      <!-- Feedback CTA -->
      <div style="background:linear-gradient(135deg,#f0f7ff 0%,#e8f4ff 100%);border:1px solid #bfdbfe;border-radius:12px;padding:28px;margin-bottom:28px;">
        <p style="color:#1e40af;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px 0;font-weight:bold;">One Last Thing, ${firstName_cap} 🙏</p>
        <p style="color:#1e3a5f;font-size:15px;font-weight:bold;margin:0 0 12px 0;line-height:1.5;">Would you take 2 minutes to share your experience?</p>
        <p style="color:#334155;font-size:13px;margin:0 0 8px 0;line-height:1.8;">
          Your journey through this program matters — not just to you, but to every student who comes after you.
          Your honest feedback directly shapes how we improve the program, what we keep, what we fix, and how we can better support future learners.
        </p>
        <p style="color:#334155;font-size:13px;margin:0 0 20px 0;line-height:1.8;">
          It takes less than 2 minutes, and it would mean the world to us. 💙
        </p>
        <div style="text-align:center;">
          <a href="https://forms.gle/kTtTVPpFeAHWawi28" style="display:inline-block;background:#0047AB;color:#ffffff;padding:14px 36px;border-radius:8px;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;">
            Share My Feedback →
          </a>
          <p style="color:#64748b;font-size:11px;margin:12px 0 0 0;">Anonymous &amp; takes less than 2 minutes</p>
        </div>
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
// Body: { platform, login_ids?: string[], cohort_id?: string, date_from?: string, date_to?: string }
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { platform, login_ids, cohort_id, date_from, date_to } = await request.json();
  if (!platform || !PLATFORM_META[platform as 'dip' | 'wrp']) {
    return NextResponse.json({ error: 'platform must be dip or wrp' }, { status: 400 });
  }

  const meta = PLATFORM_META[platform as 'dip' | 'wrp'];

  let query = supabase
    .from(meta.table)
    .select('login_id, full_name, email, created_at, cohort_id')
    .not('email', 'is', null);

  if (login_ids?.length) query = query.in('login_id', login_ids);
  if (cohort_id) query = query.eq('cohort_id', cohort_id);
  if (date_from) query = query.gte('created_at', date_from);
  if (date_to) query = query.lte('created_at', date_to + 'T23:59:59Z');

  const { data: students, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const recipients = (students || []).filter(s => s.email?.trim());
  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0, message: 'No students match the selected filters' });
  }

  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL;

  let sent = 0;
  let failed = 0;
  let errorMsgs: string[] = [];

  await Promise.allSettled(
    recipients.map(async (s) => {
      try {
        const { subject, html } = buildCongratulationsEmail(s.full_name, platform as 'dip' | 'wrp');
        const to = adminEmail || s.email!;
        const subjectLine = adminEmail ? `[FORWARD TO ${s.email}] ${subject}` : subject;
        await sendEmail({ to_email: to, subject: subjectLine, message_html: html });
        sent++;
      } catch (e: any) {
        failed++;
        errorMsgs.push(e.message || String(e));
      }
    })
  );

  return NextResponse.json({ sent, failed, total: recipients.length, errors: errorMsgs.slice(0, 5) });
}
