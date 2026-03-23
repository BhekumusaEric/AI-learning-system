import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST /api/auth/verify-otp
// Body: { login_id, platform, otp }
export async function POST(request: Request) {
  const { login_id, platform, otp } = await request.json();
  if (!login_id || !platform || !otp) {
    return NextResponse.json({ error: 'login_id, platform, and otp are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  const { data, error } = await supabase
    .from(table)
    .select('email_otp, email_otp_expires_at')
    .eq('login_id', login_id.toUpperCase())
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

  if (!data.email_otp) return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 });

  if (new Date(data.email_otp_expires_at) < new Date()) {
    return NextResponse.json({ error: 'Code has expired. Please request a new one.' }, { status: 400 });
  }

  if (data.email_otp !== otp.trim()) {
    return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
  }

  // Mark verified, clear OTP
  await supabase
    .from(table)
    .update({ email_verified: true, email_otp: null, email_otp_expires_at: null })
    .eq('login_id', login_id.toUpperCase());

  return NextResponse.json({ success: true });
}
