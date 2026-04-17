import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { login_id, password, platform } = await request.json();

  if (!login_id || !platform) {
    return NextResponse.json({ error: 'login_id and platform are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  try {
    const data = await sql`
      SELECT id, login_id, full_name, email, email_verified, password_hash
      FROM ${sql(table)} 
      WHERE login_id = ${login_id.trim().toUpperCase()}
    `;

    if (data.length === 0) {
      return NextResponse.json({ error: 'Student ID not found' }, { status: 401 });
    }

    const user = data[0];

    // Verify password if one is set on the account (not enforced for SAAIO)
    if (platform !== 'saaio' && user.password_hash && password) {
      const hash = createHash('sha256').update(password).digest('hex');
      if (hash !== user.password_hash) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
      }
    } else if (platform !== 'saaio' && user.password_hash && !password) {
      return NextResponse.json({ error: 'Password required' }, { status: 401 });
    }

    const has_email = !!(user.email);

    return NextResponse.json({ 
      success: true, 
      login_id: user.login_id, 
      full_name: user.full_name, 
      has_email 
    });
  } catch (error: any) {
    console.error('[VERIFY_SESSION_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
