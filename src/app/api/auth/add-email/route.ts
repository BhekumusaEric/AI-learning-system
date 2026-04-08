import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
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

  try {
    // 1. Check email not already used by another student on this platform
    const existing = await sql`
      SELECT login_id FROM ${sql(table)} 
      WHERE email = ${normalizedEmail} 
      AND login_id != ${login_id.toUpperCase()}
    `;

    if (existing.length > 0) {
      return NextResponse.json({ error: 'This email is already linked to another account.' }, { status: 409 });
    }

    const otp = generateOtp();
    const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

    // 2. Update student with OTP and email
    const result = await sql`
      UPDATE ${sql(table)} 
      SET email = ${normalizedEmail}, 
          email_otp = ${otp}, 
          email_otp_expires_at = ${expires_at}, 
          email_verified = false 
      WHERE login_id = ${login_id.toUpperCase()}
      RETURNING login_id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    }

    // 3. Send OTP email
    const platformName = platform === 'dip' ? 'IDC SEF Digital Inclusion Program' : platform === 'wrp' ? 'WeThinkCode_ Work Readiness Program' : 'WeThinkCode_ Training Grounds';

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <div style="font-family:'Courier New',Courier,monospace;max-width:480px;margin:40px auto;background:#000;border:1px solid #222;border-radius:12px;overflow:hidden;">
    <div style="background:#0d0d0d;border-bottom:1px solid #1a1a1a;padding:24px 32px;">
      <p style="margin:0;color:#00ff9d;font-size:11px;letter-spacing:3px;text-transform:uppercase;">● ${platformName}</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#fff;font-size:20px;margin:0 0 12px 0;">Verify your email address</h2>
      <p style="color:#b0b0b0;font-size:14px;line-height:1.7;margin:0 0 28px 0;">
        Enter the code below to verify your email and unlock full access to the platform.
      </p>
      <div style="background:#111;border:1px solid #2a2a2a;border-radius:10px;padding:28px;text-align:center;margin-bottom:28px;">
        <p style="color:#666;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px 0;">Your verification code</p>
        <p style="color:#00ff9d;font-size:48px;font-weight:bold;letter-spacing:12px;margin:0;">${otp}</p>
        <p style="color:#555;font-size:12px;margin:12px 0 0 0;">Expires in 15 minutes</p>
      </div>
      <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:8px;padding:16px;">
        <p style="color:#555;font-size:12px;margin:0;line-height:1.6;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    </div>
    <div style="background:#0d0d0d;border-top:1px solid #1a1a1a;padding:20px 32px;">
      <p style="color:#444;font-size:12px;margin:0;">This is an automated message — please do not reply.</p>
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
  } catch (error: any) {
    console.error('[ADD_EMAIL_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
