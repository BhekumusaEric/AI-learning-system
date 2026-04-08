import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST /api/auth/verify-otp
// Body: { login_id, platform, otp }
export async function POST(request: Request) {
  const { login_id, platform, otp } = await request.json();
  if (!login_id || !platform || !otp) {
    return NextResponse.json({ error: 'login_id, platform, and otp are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  try {
    const data = await sql`
      SELECT email_otp, email_otp_expires_at 
      FROM ${sql(table)} 
      WHERE login_id = ${login_id.toUpperCase()}
    `;

    if (data.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const user = data[0];

    if (!user.email_otp) {
      return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 });
    }

    if (new Date(user.email_otp_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code has expired. Please request a new one.' }, { status: 400 });
    }

    if (user.email_otp !== otp.trim()) {
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
    }

    // Mark verified, clear OTP
    await sql`
      UPDATE ${sql(table)} 
      SET email_verified = true, 
          email_otp = null, 
          email_otp_expires_at = null 
      WHERE login_id = ${login_id.toUpperCase()}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[VERIFY_OTP_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
