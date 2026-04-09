import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

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
    label: 'WeThinkCode_ Work Readiness Program',
  },
};

type Platform = keyof typeof PLATFORM_CONFIG;

const TEMPLATES: Record<string, Record<Platform, { subject: string; heading: string; body: string; cta: string }>> = {
  reminder: {
    saaio: {
      subject: 'Keep going — your WeThinkCode_ training is waiting',
      heading: "Don't lose your momentum!",
      body: `You're registered on the WeThinkCode_ IDC Curriculum but there's still course content waiting for you.<br/><br/>
Every chapter you complete brings you one step closer to your final certification.<br/><br/>
Log in now and pick up where you left off.`,
      cta: 'Continue Learning →',
    },
    dip: {
      subject: 'Your Python journey is waiting for you',
      heading: "Keep building your Python skills!",
      body: `You're registered on the <strong>IDC SEF Digital Inclusion Program</strong> and there's still content waiting for you.<br/><br/>
Every lesson you complete brings you closer to your Certificate of Completion and a stronger foundation in Python programming.<br/><br/>
Log in now and pick up where you left off — your progress is saved and ready.`,
      cta: 'Continue My Python Journey →',
    },
    wrp: {
      subject: 'Your Work Readiness journey is waiting',
      heading: "Keep building your career skills!",
      body: `You're registered on the <strong>WeThinkCode_ Work Readiness Program</strong> and there are still modules waiting for you.<br/><br/>
Every module you complete sharpens the skills employers are looking for — communication, interview readiness, CV writing, and more.<br/><br/>
Log in now and continue your journey toward workplace confidence.`,
      cta: 'Continue My WRP Journey →',
    },
  },
  mark_done: {
    saaio: {
      subject: 'Quick reminder: mark your completed topics',
      heading: "Your progress isn't being tracked!",
      body: `After reading or completing a topic, make sure you click the <strong style="color:#0047AB;">Mark as Done</strong> button at the bottom of each page.<br/><br/>
Without marking pages done, your progress won't be saved and your completion percentage won't update.<br/><br/>
Log in and go through your completed chapters — mark each one done so your progress reflects your hard work.`,
      cta: 'Update My Progress →',
    },
    dip: {
      subject: 'Are your Python lessons marked as complete?',
      heading: "Don't lose your hard-earned progress!",
      body: `A quick reminder — after completing each Python lesson, make sure you click the <strong style="color:#0047AB;">Mark Complete & Next</strong> button at the bottom of the page.<br/><br/>
If you skip this step, your progress won't be saved and your completion percentage won't update — which could affect your eligibility for the final exam and certificate.<br/><br/>
Log in now and make sure all your completed lessons are marked.`,
      cta: 'Check My Progress →',
    },
    wrp: {
      subject: 'Have you marked your WRP modules as complete?',
      heading: "Your progress might not be saved!",
      body: `A quick reminder — after finishing each Work Readiness module, make sure you click the <strong style="color:#0047AB;">Next</strong> button at the bottom of the page to save your progress.<br/><br/>
Without this step, your completion percentage won't update and you may not qualify for your Certificate of Completion.<br/><br/>
Log in now and check that all your completed modules are recorded.`,
      cta: 'Check My WRP Progress →',
    },
  },
  exam_reminder: {
    saaio: {
      subject: 'You\'re close — have you taken the final exam?',
      heading: 'Your final exam is waiting!',
      body: `You've been making great progress on the WeThinkCode_ IDC Curriculum.<br/><br/>
If you've completed 80% or more of the course content, you're eligible to take the <strong>Final Exam</strong>.<br/><br/>
Don't leave your certification unfinished — log in and complete the exam to earn your Certificate of Completion.`,
      cta: 'Take the Final Exam →',
    },
    dip: {
      subject: 'You\'re so close — take your Python Final Exam!',
      heading: "Your certificate is one exam away!",
      body: `You've been working hard on the <strong>IDC SEF Digital Inclusion Program</strong> — and it shows!<br/><br/>
If you've completed at least 80% of the Python lessons, you're now eligible to take the <strong>Final Exam</strong>.<br/><br/>
Pass the exam and your Certificate of Completion will be unlocked. You've done the hard work — now finish strong!`,
      cta: 'Take My Final Exam →',
    },
    wrp: {
      subject: 'Almost there — complete your WRP for your certificate!',
      heading: "Your WRP certificate is within reach!",
      body: `You've been putting in the work on the <strong>WeThinkCode_ Work Readiness Program</strong> — and you're almost done!<br/><br/>
Once you've completed at least 80% of the program modules, you can request your <strong>Certificate of Completion</strong>.<br/><br/>
Log in, finish your remaining modules, and claim the certificate that proves your workplace readiness.`,
      cta: 'Finish My WRP →',
    },
  },
  kaggle: {
    saaio: {
      subject: 'New Kaggle challenges have been added',
      heading: 'New challenges are live!',
      body: `Fresh <strong style="color:#0047AB;">Kaggle challenges</strong> have been added to the WeThinkCode_ IDC Curriculum.<br/><br/>
These hands-on competitions are one of the best ways to apply what you've learned and build real-world experience that stands out to employers.<br/><br/>
Log in, head to the Challenges section, and start competing!`,
      cta: 'View Kaggle Challenges →',
    },
    dip: {
      subject: 'New Kaggle challenges have been added',
      heading: 'New challenges are live!',
      body: `Fresh <strong style="color:#0047AB;">Kaggle challenges</strong> have been added to the WeThinkCode_ IDC Curriculum.<br/><br/>
These hands-on competitions are one of the best ways to apply what you've learned and build real-world experience that stands out to employers.<br/><br/>
Log in, head to the Challenges section, and start competing!`,
      cta: 'View Kaggle Challenges →',
    },
    wrp: {
      subject: 'New Kaggle challenges have been added',
      heading: 'New challenges are live!',
      body: `Fresh <strong style="color:#0047AB;">Kaggle challenges</strong> have been added to the WeThinkCode_ IDC Curriculum.<br/><br/>
These hands-on competitions are one of the best ways to apply what you've learned and build real-world experience that stands out to employers.<br/><br/>
Log in, head to the Challenges section, and start competing!`,
      cta: 'View Kaggle Challenges →',
    },
  },
  cert_reminder: {
    saaio: {
      subject: 'Your certificate is ready — have you downloaded it?',
      heading: "Don't forget your Certificate!",
      body: `Your Certificate of Completion has been unlocked — but it looks like you haven't downloaded it yet.<br/><br/>
Your certificate is proof of everything you've achieved. Add it to your LinkedIn profile, attach it to your CV, and share it with the world.<br/><br/>
Log in now and download your certificate before you forget!`,
      cta: 'Download My Certificate →',
    },
    dip: {
      subject: 'Your DIP certificate is ready — download it now!',
      heading: "Your Python certificate is waiting!",
      body: `Your <strong>IDC SEF Digital Inclusion Program</strong> Certificate of Completion has been unlocked!<br/><br/>
This certificate is proof of your Python programming skills and your commitment to learning. Add it to your LinkedIn, attach it to your CV, and show employers what you've achieved.<br/><br/>
Log in now and download your certificate — you've earned it!`,
      cta: 'Download My DIP Certificate →',
    },
    wrp: {
      subject: 'Your WRP certificate is ready — download it now!',
      heading: "Your Work Readiness certificate is waiting!",
      body: `Your <strong>WeThinkCode_ Work Readiness Program</strong> Certificate of Completion has been unlocked!<br/><br/>
This certificate proves your workplace readiness — your communication skills, interview preparation, CV writing, and professional presence. Share it with confidence.<br/><br/>
Log in now and download your certificate — you've worked hard for this!`,
      cta: 'Download My WRP Certificate →',
    },
  },
};

// Which notification types are available per platform
export const PLATFORM_NOTIFICATION_TYPES: Record<Platform, string[]> = {
  saaio: ['reminder', 'mark_done', 'exam_reminder', 'kaggle', 'cert_reminder'],
  dip:   ['reminder', 'mark_done', 'exam_reminder', 'cert_reminder'],
  wrp:   ['reminder', 'mark_done', 'cert_reminder'],
};

const TYPE_LABELS: Record<string, { label: string; desc: string }> = {
  reminder:      { label: 'Course Reminder',        desc: 'Nudge students to continue their course content' },
  mark_done:     { label: 'Mark Done Reminder',     desc: 'Remind students to mark lessons as complete' },
  exam_reminder: { label: 'Exam Reminder',          desc: 'Encourage eligible students to take the final exam' },
  kaggle:        { label: 'Kaggle Challenges',      desc: 'Announce new Kaggle challenges (SAAIO only)' },
  cert_reminder: { label: 'Certificate Reminder',   desc: 'Remind unlocked students to download their certificate' },
};

function buildNotificationEmail(type: string, platform: Platform, customMessage?: string) {
  const t = TEMPLATES[type]?.[platform] ?? TEMPLATES['reminder'][platform];
  const { loginUrl, label } = PLATFORM_CONFIG[platform];
  const body = customMessage ? customMessage.replace(/\n/g, '<br/>') : t.body;
  const subject = customMessage ? `${label} — Message from your program team` : t.subject;

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

// GET — return available types for a platform
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = (searchParams.get('platform') || 'saaio') as Platform;
  const types = (PLATFORM_NOTIFICATION_TYPES[platform] || PLATFORM_NOTIFICATION_TYPES.saaio)
    .map(t => ({ type: t, ...TYPE_LABELS[t] }));
  return NextResponse.json(types);
}

// POST /api/admin/notify
// Body: { type, platform, message?, cohort_id?, date_from?, date_to? }
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, message, platform = 'saaio', cohort_id, date_from, date_to } = await request.json();
  if (!type || !TEMPLATES[type]) {
    return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
  }

  const config = PLATFORM_CONFIG[platform as Platform] || PLATFORM_CONFIG.saaio;

  let query = supabase.from(config.table).select('full_name, email, cohort_id, created_at').not('email', 'is', null);
  if (cohort_id) query = query.eq('cohort_id', cohort_id);
  if (date_from) query = query.gte('created_at', date_from);
  if (date_to) query = query.lte('created_at', date_to + 'T23:59:59Z');

  const { data: students, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const recipients = (students || []).filter(s => s.email?.trim());
  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0, message: 'No students match the selected filters' });
  }

  const { subject, html } = buildNotificationEmail(type, platform as Platform, message?.trim() || undefined);
  const adminEmail = process.env.ADMIN_EMAIL;

  let sent = 0, failed = 0;
  await Promise.allSettled(
    recipients.map(async (s) => {
      try {
        const to = adminEmail || s.email!;
        const subjectLine = adminEmail ? `[FORWARD TO ${s.email}] ${subject}` : subject;
        await sendEmail({ to_email: to, subject: subjectLine, message_html: html });
        sent++;
      } catch { failed++; }
    })
  );

  return NextResponse.json({ sent, failed, total: recipients.length });
}
