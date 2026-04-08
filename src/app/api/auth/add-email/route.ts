import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// POST /api/auth/add-email
// Body: { login_id, platform, email }
export async function POST(request: Request) {
  const { login_id, platform, email } = await request.json();
  if (!login_id || !platform || !email?.trim()) {
    return NextResponse.json({ error: 'login_id, platform, and email are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';
  const normalizedEmail = email.trim().toLowerCase();

  // Check email not already used by another student on this platform
  const { data: existing } = await supabase
    .from(table)
    .select('login_id')
    .eq('email', normalizedEmail)
    .neq('login_id', login_id.toUpperCase())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'This email is already linked to another account.' }, { status: 409 });
  }

  const otp = generateOtp();
  const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

  const { error: updateError } = await supabase
    .from(table)
    .update({ email: normalizedEmail, email_otp: otp, email_otp_expires_at: expires_at, email_verified: false })
    .eq('login_id', login_id.toUpperCase());

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // Send OTP email
  const platformName = platform === 'dip' ? 'IDC SEF Digital Inclusion Program' : platform === 'wrp' ? 'WeThinkCode_ Work Readiness Program' : 'SAAIO Training Grounds';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f5f7fa;">
  <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:480px;margin:40px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="background:#0047AB;border-bottom:1px solid #003380;padding:24px 32px;">
      <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">● ${platformName}</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#0f172a;font-size:20px;margin:0 0 12px 0;">Verify your email address</h2>
      <p style="color:#334155;font-size:14px;line-height:1.7;margin:0 0 28px 0;">
        Enter the code below to verify your email and unlock full access to the platform.
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:28px;text-align:center;margin-bottom:28px;">
        <p style="color:#64748b;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px 0;font-weight:bold;">Your verification code</p>
        <p style="color:#0047AB;font-size:48px;font-weight:bold;letter-spacing:12px;margin:0;">${otp}</p>
        <p style="color:#475569;font-size:12px;margin:12px 0 0 0;">Expires in 15 minutes</p>
      </div>
      <div style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:16px;">
        <p style="color:#475569;font-size:12px;margin:0;line-height:1.6;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;">
      <p style="color:#64748b;font-size:12px;margin:0;">This is an automated message — please do not reply.</p>
    </div>
  </div>
</body>
</html>`;

  let emailSent = false;
  try {
    await sendEmail({
      to_email: normalizedEmail,
      subject: `${otp} is your verification code — ${platformName}`,
      message_html: html,
    });
    emailSent = true;
  } catch (e: any) {
    console.error('Failed to send OTP email:', e);
    // Don't block the student — email is saved, they can verify later
  }

  return NextResponse.json({ success: true, emailSent });
}
