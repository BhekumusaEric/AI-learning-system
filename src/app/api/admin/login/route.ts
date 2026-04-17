import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }

  const { data: admin } = await supabase
    .from('admins')
    .select('id, username, password_hash')
    .eq('username', username)
    .eq('password_hash', hashPassword(password))
    .maybeSingle();

  if (!admin) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

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
