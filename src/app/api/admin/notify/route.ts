import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

const TEMPLATES = {
  reminder: {
    subject: 'Keep going — your SAAIO training is waiting 🚀',
    heading: "Don't lose your momentum!",
    body: `You're registered on the SAAIO Training Grounds but there's still course content waiting for you.<br/><br/>
Every chapter you complete brings you one step closer to being ready for the <strong style="color:#00ff9d;">International Olympiad in Artificial Intelligence</strong>.<br/><br/>
Log in now and pick up where you left off.`,
    cta: 'Continue Learning →',
  },
  mark_done: {
    subject: 'Quick reminder: mark your completed topics ✅',
    heading: "Your progress isn't being tracked!",
    body: `After reading or completing a topic, make sure you click the <strong style="color:#00ff9d;">Mark as Done</strong> button at the bottom of each page.<br/><br/>
Without marking pages done, your progress won't be saved and your completion percentage won't update.<br/><br/>
Log in and go through your completed chapters — mark each one done so your progress reflects your hard work.`,
    cta: 'Update My Progress →',
  },
  kaggle: {
    subject: 'New Kaggle challenges have been added 🏆',
    heading: 'New challenges are live!',
    body: `Fresh <strong style="color:#00ff9d;">Kaggle challenges</strong> have been added to the SAAIO Training Grounds.<br/><br/>
These hands-on competitions are one of the best ways to apply what you've learned and build real experience for the IOAI.<br/><br/>
Log in, head to the Kaggle Challenges section, and start competing!`,
    cta: 'View Kaggle Challenges →',
  },
};

function buildNotificationEmail(type: keyof typeof TEMPLATES, customMessage?: string) {
  const t = TEMPLATES[type];
  const loginUrl = 'https://ai-learning-system-ten.vercel.app/saaio/login';
  const body = customMessage ? customMessage.replace(/\n/g, '<br/>') : t.body;
  const subject = customMessage ? 'SAAIO Training Grounds — Message from your admin' : t.subject;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <div style="font-family:'Courier New',Courier,monospace;max-width:520px;margin:40px auto;background:#000;border:1px solid #222;border-radius:12px;overflow:hidden;">
    <div style="background:#0d0d0d;border-bottom:1px solid #1a1a1a;padding:24px 32px;">
      <p style="margin:0;color:#00ff9d;font-size:11px;letter-spacing:3px;text-transform:uppercase;">● SAAIO Training Grounds</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#fff;font-size:20px;margin:0 0 20px 0;">${t.heading}</h2>
      <p style="color:#b0b0b0;font-size:15px;line-height:1.8;margin:0 0 28px 0;">${body}</p>
      <a href="${loginUrl}" style="display:block;background:#00ff9d;color:#000;text-align:center;padding:14px 24px;border-radius:8px;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;margin-bottom:28px;">${t.cta}</a>
      <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:8px;padding:16px;">
        <p style="color:#555;font-size:12px;margin:0;line-height:1.6;">
          You're receiving this because you're registered on the SAAIO Training Grounds.<br/>
          Need help? Contact your program administrator.
        </p>
      </div>
    </div>
    <div style="background:#0d0d0d;border-top:1px solid #1a1a1a;padding:20px 32px;">
      <p style="color:#444;font-size:12px;margin:0;">This is an automated message — please do not reply directly to this email.</p>
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
// Body: { type: 'reminder' | 'mark_done' | 'kaggle', message?: string }
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, message } = await request.json();
  if (!type || !TEMPLATES[type as keyof typeof TEMPLATES]) {
    return NextResponse.json({ error: 'Invalid type. Must be reminder, mark_done, or kaggle' }, { status: 400 });
  }

  const { data: students, error } = await supabase
    .from('saaio_students')
    .select('full_name, email')
    .not('email', 'is', null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const recipients = (students || []).filter(s => s.email?.trim());
  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, message: 'No students with email addresses found' });
  }

  const { subject, html } = buildNotificationEmail(type as keyof typeof TEMPLATES, message?.trim() || undefined);
  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL;

  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    recipients.map(async (s) => {
      try {
        const to = adminEmail || s.email!;
        const subjectLine = adminEmail ? `[FORWARD TO ${s.email}] ${subject}` : subject;
        await resend.emails.send({ from, to, subject: subjectLine, html });
        sent++;
      } catch {
        failed++;
      }
    })
  );

  return NextResponse.json({ sent, failed, total: recipients.length });
}
