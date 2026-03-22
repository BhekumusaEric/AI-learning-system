import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(p: string) {
  return createHash('sha256').update(p).digest('hex');
}

export async function POST(request: Request) {
  const { login_id, password, platform } = await request.json();
  if (!login_id || !password || !platform) {
    return NextResponse.json({ error: 'login_id, password, and platform are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  const { data, error } = await supabase
    .from(table)
    .select('id, login_id, full_name, password_hash')
    .eq('login_id', login_id.trim().toUpperCase())
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (data.password_hash !== hashPassword(password.trim())) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ success: true, login_id: data.login_id, full_name: data.full_name });
}
