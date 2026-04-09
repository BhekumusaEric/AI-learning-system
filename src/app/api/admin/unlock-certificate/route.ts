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
  },
  wrp: {
    name: 'WeThinkCode_ Work Readiness Program',
    programTitle: 'Work Readiness Program',
    certUrl: 'https://ai-learning-system-ten.vercel.app/wrp/certificate',
    competencies: ['Verbal Communication', 'Written Communication', 'Interview Skills', 'LinkedIn & Personal Brand', 'CV & Resume Building', 'Workplace Readiness'],
    table: 'wrp_students',
  },
};

function buildUnlockEmail(full_name: string, platform: 'dip' | 'wrp') {
  const meta = PLATFORM_META[platform];
  const firstName = full_name.trim().split(' ')[0];
  const firstName_cap = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  const badges = meta.competencies
    .map(c => `<span style="display:inline-block;font-size:11px;letter-spacing:1px;text-transform:uppercase;border:1px solid #0047AB;color:#0047AB;background:#e0e7ff;padding:4px 10px;border-radius:12px;margin:3px;font-weight:bold;">${c}</span>`)
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f7fa;">
  <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:560px;margin:40px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">

    <!-- Top bar -->
    <div style="height:6px;background:#0047AB;"></div>

    <!-- Header -->
    <div style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:40px 32px;text-align:center;">
      <p style="margin:0 0 12px 0;color:#0047AB;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Certificate of Completion</p>
      <h1 style="margin:0 0 8px 0;color:#0f172a;font-size:30px;font-weight:bold;letter-spacing:1px;">
        Congratulations,<br/>${firstName_cap}!
      </h1>
      <p style="margin:8px 0 0 0;color:#64748b;font-size:13px;letter-spacing:1px;text-transform:uppercase;">${meta.name}</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 32px;">

      <p style="color:#334155;font-size:15px;line-height:1.9;margin:0 0 20px 0;">
        Dear <strong style="color:#0f172a;">${firstName_cap}</strong>,
      </p>

      <p style="color:#475569;font-size:15px;line-height:1.9;margin:0 0 20px 0;">
        On behalf of the entire team, it is our honour and privilege to formally recognise your achievement.
        You have successfully completed the <strong style="color:#0047AB;">${meta.programTitle}</strong> — 
        and we could not be more proud of what you have accomplished.
      </p>

      <p style="color:#475569;font-size:15px;line-height:1.9;margin:0 0 28px 0;">
        This was not easy. It required dedication, persistence, and a genuine desire to grow. 
        You showed up, you put in the work, and you earned this. That matters.
      </p>

      <!-- Skills earned -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:24px;margin-bottom:28px;text-align:center;">
        <p style="color:#64748b;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px 0;font-weight:bold;">Skills You Have Earned</p>
        <div>${badges}</div>
      </div>

      <!-- Certificate unlock box -->
      <div style="background:#ffffff;border:2px solid #0047AB;border-radius:10px;padding:28px;margin-bottom:28px;text-align:center;box-shadow:0 4px 10px rgba(0, 71, 171, 0.05);">
        <p style="color:#0047AB;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px 0;font-weight:bold;">Your Certificate is Now Available</p>
        <p style="color:#475569;font-size:14px;margin:0 0 24px 0;line-height:1.7;">
          Your official Certificate of Completion has been unlocked and is ready to download.
          Add it to your LinkedIn profile, attach it to your CV, or simply keep it as a record of your hard work.
        </p>
        <a href="${meta.certUrl}" style="display:inline-block;background:#0047AB;color:#ffffff;padding:16px 40px;border-radius:8px;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;transition:background 0.2s;">
          Download My Certificate
        </a>
      </div>

      <p style="color:#64748b;font-size:14px;line-height:1.9;margin:0;">
        We hope this is just the beginning of your journey. Keep building, keep learning, and keep going.
        The world needs people like you — curious, committed, and capable.
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
    subject: `Congratulations ${firstName_cap} — Your Certificate of Completion is Ready`,
    html,
  };
}

function buildDeclineEmail(full_name: string, platform: 'dip' | 'wrp') {
  const meta = PLATFORM_META[platform];
  const firstName = full_name.trim().split(' ')[0];
  const firstName_cap = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f7fa;">
  <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:560px;margin:40px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="height:6px;background:#e11d48;"></div>
    <div style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:40px 32px;text-align:center;">
      <p style="margin:0 0 12px 0;color:#e11d48;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Certificate Requirements Update</p>
      <h1 style="margin:0 0 8px 0;color:#0f172a;font-size:26px;font-weight:bold;letter-spacing:1px;">
        Action Needed, ${firstName_cap}
      </h1>
      <p style="margin:8px 0 0 0;color:#64748b;font-size:13px;letter-spacing:1px;text-transform:uppercase;">${meta.name}</p>
    </div>
    <div style="padding:36px 32px;">
      <p style="color:#334155;font-size:15px;line-height:1.9;margin:0 0 20px 0;">
        Dear <strong style="color:#0f172a;">${firstName_cap}</strong>,
      </p>
      <p style="color:#475569;font-size:15px;line-height:1.9;margin:0 0 20px 0;">
        You recently requested your official Certificate of Completion for the <strong>${meta.programTitle}</strong>. 
        We are thrilled to see your enthusiasm!
      </p>
      <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:10px;padding:24px;margin-bottom:28px;">
        <p style="color:#be123c;font-size:14px;line-height:1.7;margin:0;">
          <strong>Our records indicate you have not yet completed all requirements.</strong><br/><br/>
          Before we can issue your certificate, please ensure you have:<br/>
          1. Achieved <strong>100% completion</strong> across all learning modules.<br/>
          ${platform === 'dip' ? '2. Passed the <strong>final examination</strong>.<br/>' : ''}
        </p>
      </div>
      <p style="color:#475569;font-size:15px;line-height:1.9;margin:0 0 28px 0;">
        Please log back into the platform, finish any remaining tasks, and submit your request again. We look forward to celebrating your success very soon!
      </p>
      <a href="https://ai-learning-system-ten.vercel.app" style="display:inline-block;background:#0f172a;color:#ffffff;padding:16px 40px;border-radius:8px;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;transition:background 0.2s;">
        Return to Dashboard
      </a>
    </div>
    <div style="background:#f1f5f9;border-top:1px solid #e2e8f0;padding:20px 32px;">
      <p style="color:#64748b;font-size:12px;margin:0;line-height:1.6;">
        ${meta.name}<br/>
        This is an automated message.
      </p>
    </div>
  </div>
</body>
</html>`;

  return { subject: `Certificate Request Update — Action Required`, html };
}

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// POST /api/admin/unlock-certificate
// Body: { login_id, platform, action?: 'unlock' | 'decline' }
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { login_id, platform, action = 'unlock' } = await request.json();
  if (!login_id || !platform || !PLATFORM_META[platform as 'dip' | 'wrp']) {
    return NextResponse.json({ error: 'login_id and platform (dip|wrp) required' }, { status: 400 });
  }

  const meta = PLATFORM_META[platform as 'dip' | 'wrp'];

  let updatePayload = {};
  if (action === 'decline') {
    updatePayload = { certificate_requested: false };
  } else {
    updatePayload = { certificate_unlocked: true };
  }

  // Update in DB
  const { data: student, error } = await supabase
    .from(meta.table)
    .update(updatePayload)
    .eq('login_id', login_id)
    .select('full_name, email')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email
  let emailSent = false;
  if (student.email && process.env.WTC_EMAIL_API_KEY) {
    try {
      const { subject, html } = action === 'decline'
        ? buildDeclineEmail(student.full_name, platform as 'dip' | 'wrp')
        : buildUnlockEmail(student.full_name, platform as 'dip' | 'wrp');

      const adminEmail = process.env.ADMIN_EMAIL;
      const to = adminEmail || student.email;
      const subjectLine = adminEmail ? `[FORWARD TO ${student.email}] ${subject}` : subject;
      await sendEmail({
        to_email: to,
        subject: subjectLine,
        message_html: html,
      });
      emailSent = true;
    } catch (e) {
      console.error('Failed to send email:', e);
    }
  }

  return NextResponse.json({ success: true, emailSent, full_name: student.full_name });
}

// GET /api/admin/unlock-certificate?platform=dip — list pending requests
export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') as 'dip' | 'wrp' | null;
  if (!platform || !PLATFORM_META[platform]) return NextResponse.json({ error: 'platform required' }, { status: 400 });

  const { data, error } = await supabase
    .from(PLATFORM_META[platform].table)
    .select('login_id, full_name, email, certificate_requested, certificate_unlocked, name_change_requested, certificate_name, completedCount, examPassed')
    .or('certificate_requested.eq.true,name_change_requested.eq.true')
    .order('full_name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// PATCH /api/admin/unlock-certificate — approve name change
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { login_id, platform } = await request.json();
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = PLATFORM_META[platform as 'dip' | 'wrp']?.table;
  if (!table) return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });

  // Clear the locked name and the request flag so student can re-enter
  const { error } = await supabase
    .from(table)
    .update({ certificate_name: null, name_change_requested: false })
    .eq('login_id', login_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
