import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

function sessionToken(password: string) {
  return createHash('sha256').update('admin_session:' + password).digest('hex');
}

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'supersecret';

  if (username === validUser && password === validPass) {
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_session', sessionToken(validPass), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    });
    return res;
  }

  return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
}
