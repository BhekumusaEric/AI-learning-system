import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

function hashPassword(p: string) {
  return createHash('sha256').update(p).digest('hex');
}

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateLoginId(platform: string, index: number) {
  const prefix = platform === 'dip' ? 'DIP' : 'SAAIO';
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(index).padStart(3, '0')}`;
}

async function sendCredentialsEmail(to: string, full_name: string, login_id: string, password: string, platform: string) {
  const platformName = platform === 'dip' ? 'IDC SEF Digital Inclusion Program' : 'SAAIO Training Grounds';
  const loginUrl = platform === 'dip'
    ? 'https://ai-learning-system-ten.vercel.app/dip/login'
    : 'https://ai-learning-system-ten.vercel.app/saaio/login';

  const html = `
    <div style="font-family:monospace;background:#000;color:#fff;padding:32px;max-width:480px;margin:0 auto;border-radius:12px;">
      <h2 style="color:#00ff9d;margin-bottom:8px;">${platformName}</h2>
      <p style="color:#b0b0b0;margin-bottom:24px;">Hi ${full_name}, welcome! Here are your login credentials.</p>
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:20px;margin-bottom:24px;">
        <div style="margin-bottom:12px;">
          <span style="color:#b0b0b0;font-size:12px;">LOGIN ID</span><br/>
          <span style="color:#00ff9d;font-size:20px;font-weight:bold;letter-spacing:2px;">${login_id}</span>
        </div>
        <div>
          <span style="color:#b0b0b0;font-size:12px;">PASSWORD</span><br/>
          <span style="color:#ffb86b;font-size:20px;font-weight:bold;letter-spacing:4px;">${password}</span>
        </div>
      </div>
      <a href="${loginUrl}" style="display:block;background:#00ff9d;color:#000;text-align:center;padding:12px;border-radius:8px;font-weight:bold;text-decoration:none;margin-bottom:24px;">Go to Login Page →</a>
      <p style="color:#555;font-size:12px;">Keep these credentials safe. If you need help, contact your program administrator.</p>
    </div>`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to,
    subject: `Welcome to ${platformName} — Your Login Credentials`,
    html,
  });
}

// POST /api/auth/register
// Body: { full_name, email, platform: 'dip' | 'saaio' }
export async function POST(request: Request) {
  const { full_name, email, platform } = await request.json();

  if (!full_name?.trim() || !email?.trim() || !platform) {
    return NextResponse.json({ error: 'full_name, email, and platform are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : 'saaio_students';
  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const { data: existing } = await supabase
    .from(table)
    .select('login_id, full_name')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ already_registered: true, login_id: existing.login_id, full_name: existing.full_name });
  }

  // Create new student
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
  const login_id = generateLoginId(platform, (count || 0) + 1);
  const plainPassword = generatePassword();
  const password_hash = hashPassword(plainPassword);

  const { error: insertError } = await supabase
    .from(table)
    .insert({ login_id, password_hash, full_name: full_name.trim(), email: normalizedEmail });

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  // Send credentials email
  let emailSent = false;
  if (process.env.RESEND_API_KEY) {
    try {
      await sendCredentialsEmail(normalizedEmail, full_name.trim(), login_id, plainPassword, platform);
      emailSent = true;
    } catch (e: any) {
      console.error('Failed to send registration email:', e.message);
    }
  }

  return NextResponse.json({ already_registered: false, login_id, full_name: full_name.trim(), plainPassword, emailSent });
}
