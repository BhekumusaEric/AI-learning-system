import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    .map(c => `<span style="display:inline-block;font-size:11px;letter-spacing:1px;text-transform:uppercase;border:1px solid #d4af37;color:#888;padding:4px 10px;border-radius:3px;margin:3px;">${c}</span>`)
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <div style="font-family:'Courier New',Courier,monospace;max-width:560px;margin:40px auto;background:#000;border:1px solid #222;border-radius:12px;overflow:hidden;">

    <!-- Gold top bar -->
    <div style="height:4px;background:linear-gradient(to right,#b8960c,#d4af37,#f0d060,#d4af37,#b8960c);"></div>

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d0d0d 0%,#111 100%);border-bottom:1px solid #2a2a2a;padding:40px 32px;text-align:center;">
      <p style="margin:0 0 12px 0;color:#d4af37;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Certificate of Completion</p>
      <h1 style="margin:0 0 8px 0;color:#fff;font-size:30px;font-weight:bold;letter-spacing:1px;">
        Congratulations,<br/>${firstName_cap}!
      </h1>
      <p style="margin:8px 0 0 0;color:#888;font-size:13px;letter-spacing:2px;text-transform:uppercase;">${meta.name}</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 32px;">

      <p style="color:#e0e0e0;font-size:15px;line-height:1.9;margin:0 0 20px 0;">
        Dear <strong style="color:#fff;">${firstName_cap}</strong>,
      </p>

      <p style="color:#c0c0c0;font-size:14px;line-height:1.9;margin:0 0 20px 0;">
        On behalf of the entire team, it is our honour and privilege to formally recognise your achievement.
        You have successfully completed the <strong style="color:#d4af37;">${meta.programTitle}</strong> — 
        and we could not be more proud of what you have accomplished.
      </p>

      <p style="color:#c0c0c0;font-size:14px;line-height:1.9;margin:0 0 28px 0;">
        This was not easy. It required dedication, persistence, and a genuine desire to grow. 
        You showed up, you put in the work, and you earned this. That matters.
      </p>

      <!-- Skills earned -->
      <div style="background:#0d0d0d;border:1px solid #2a2a2a;border-radius:10px;padding:24px;margin-bottom:28px;text-align:center;">
        <p style="color:#666;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px 0;">Skills You Have Earned</p>
        <div>${badges}</div>
      </div>

      <!-- Certificate unlock box -->
      <div style="background:#0a0a0a;border:1px solid #d4af37;border-radius:10px;padding:28px;margin-bottom:28px;text-align:center;">
        <p style="color:#d4af37;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:0 0 10px 0;">Your Certificate is Now Available</p>
        <p style="color:#b0b0b0;font-size:13px;margin:0 0 24px 0;line-height:1.7;">
          Your official Certificate of Completion has been unlocked and is ready to download.
          Add it to your LinkedIn profile, attach it to your CV, or simply keep it as a record of your hard work.
        </p>
        <a href="${meta.certUrl}" style="display:inline-block;background:linear-gradient(135deg,#b8960c,#d4af37);color:#000;padding:16px 40px;border-radius:8px;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:1px;">
          Download My Certificate
        </a>
      </div>

      <p style="color:#666;font-size:13px;line-height:1.9;margin:0;">
        We hope this is just the beginning of your journey. Keep building, keep learning, and keep going.
        The world needs people like you — curious, committed, and capable.
      </p>

    </div>

    <!-- Footer -->
    <div style="height:4px;background:linear-gradient(to right,#b8960c,#d4af37,#f0d060,#d4af37,#b8960c);"></div>
    <div style="background:#0d0d0d;padding:20px 32px;">
      <p style="color:#444;font-size:12px;margin:0;line-height:1.6;">
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

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// POST /api/admin/unlock-certificate
// Body: { login_id, platform }
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { login_id, platform } = await request.json();
  if (!login_id || !platform || !PLATFORM_META[platform as 'dip' | 'wrp']) {
    return NextResponse.json({ error: 'login_id and platform (dip|wrp) required' }, { status: 400 });
  }

  const meta = PLATFORM_META[platform as 'dip' | 'wrp'];

  // Unlock in DB
  const { data: student, error } = await supabase
    .from(meta.table)
    .update({ certificate_unlocked: true })
    .eq('login_id', login_id)
    .select('full_name, email')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send grand email
  let emailSent = false;
  if (student.email && process.env.RESEND_API_KEY) {
    try {
      const { subject, html } = buildUnlockEmail(student.full_name, platform as 'dip' | 'wrp');
      const adminEmail = process.env.ADMIN_EMAIL;
      const to = adminEmail || student.email;
      const subjectLine = adminEmail ? `[FORWARD TO ${student.email}] ${subject}` : subject;
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to, subject: subjectLine, html,
      });
      emailSent = true;
    } catch (e) {
      console.error('Failed to send unlock email:', e);
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
    .select('login_id, full_name, email, certificate_requested, certificate_unlocked, name_change_requested, certificate_name')
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
