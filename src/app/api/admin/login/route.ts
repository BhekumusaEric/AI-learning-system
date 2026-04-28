import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const sessionValue = 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_session', sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });
  return res;
}
