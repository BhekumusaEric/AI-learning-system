import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const TEMPLATES = {
  reminder: {
    subject: 'Keep going — your WeThinkCode_ training is waiting',
    heading: "Don't lose your momentum!",
    body: `You're registered on the WeThinkCode_ IDC Curriculum but there's still course content waiting for you.<br/><br/>
Every chapter you complete brings you one step closer to your final certification.<br/><br/>
Log in now and pick up where you left off.`,
    cta: 'Continue Learning →',
  },
  mark_done: {
    subject: 'Quick reminder: mark your completed topics',
    heading: "Your progress isn't being tracked!",
    body: `After reading or completing a topic, make sure you click the <strong style="color:#0047AB;">Mark as Done</strong> button at the bottom of each page.<br/><br/>
Without marking pages done, your progress won't be saved and your completion percentage won't update.<br/><br/>
Log in and go through your completed chapters — mark each one done so your progress reflects your hard work.`,
    cta: 'Update My Progress →',
  },
  kaggle: {
    subject: 'New technical challenges have been added',
    heading: 'New challenges are live!',
    body: `Fresh <strong style="color:#0047AB;">technical challenges</strong> have been added to the WeThinkCode_ IDC Curriculum.<br/><br/>
These hands-on competitions are one of the best ways to apply what you've learned and build real experience.<br/><br/>
Log in, head to the Challenges section, and start competing!`,
    cta: 'View Challenges →',
  },
};

const PLATFORM_CONFIG = {
  saaio: {
    table: 'saaio_students',
    loginUrl: 'https://ai-learning-system-ten.vercel.app/saaio/login',
    label: 'WeThinkCode_ IDC Curriculum',
  },
  dip: {
    table: 'dip_students',
    loginUrl: 'https://ai-learning-system-ten.vercel.app/dip/login',
    label: 'IDC SEF Digital Inclusion Program',
  },
  wrp: {
    table: 'wrp_students',
    loginUrl: 'https://ai-learning-system-ten.vercel.app/wrp/login',
    label: 'Work Readiness Program',
  },
};

function buildNotificationEmail(type: keyof typeof TEMPLATES, platform: keyof typeof PLATFORM_CONFIG, customMessage?: string) {
  const t = TEMPLATES[type];
  const { loginUrl, label } = PLATFORM_CONFIG[platform];
  const body = customMessage ? customMessage.replace(/\n/g, '<br/>') : t.body;
  const subject = customMessage ? `${label} — Message from your admin` : t.subject;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f7fa;">
  <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:520px;margin:40px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="background:#0047AB;border-bottom:1px solid #003380;padding:24px 32px;">
      <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">● ${label}</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#0f172a;font-size:20px;margin:0 0 20px 0;">${t.heading}</h2>
      <p style="color:#334155;font-size:15px;line-height:1.8;margin:0 0 28px 0;">${body}</p>
      <a href="${loginUrl}" style="display:block;background:#0047AB;color:#ffffff;text-align:center;padding:14px 24px;border-radius:8px;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;margin-bottom:28px;">${t.cta}</a>
      <div style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
        <p style="color:#475569;font-size:12px;margin:0;line-height:1.6;">
          You're receiving this because you're registered on the ${label}.<br/>
          Need help? Contact your program administrator.
        </p>
      </div>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;">
      <p style="color:#64748b;font-size:12px;margin:0;">This is an automated message — please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// POST /api/admin/notify
// Body: { type: 'reminder' | 'mark_done' | 'kaggle', platform: 'saaio' | 'dip' | 'wrp', message?: string }
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, message, platform = 'saaio' } = await request.json();
  if (!type || !TEMPLATES[type as keyof typeof TEMPLATES]) {
    return NextResponse.json({ error: 'Invalid type. Must be reminder, mark_done, or kaggle' }, { status: 400 });
  }

  const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG] || PLATFORM_CONFIG.saaio;

  const { data: students, error } = await supabase
    .from(config.table)
    .select('full_name, email')
    .not('email', 'is', null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const recipients = (students || []).filter(s => s.email?.trim());
  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0, message: 'No students with email addresses found' });
  }

  const { subject, html } = buildNotificationEmail(type as keyof typeof TEMPLATES, platform as keyof typeof PLATFORM_CONFIG, message?.trim() || undefined);
  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL;

  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    recipients.map(async (s) => {
      try {
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
