import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { login_id, password, platform } = await request.json();

  if (!login_id || !platform) {
    return NextResponse.json({ error: 'login_id and platform are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  const { data, error } = await supabase
    .from(table)
    .select('id, login_id, full_name, email, email_verified, password_hash')
    .eq('login_id', login_id.trim().toUpperCase())
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Student ID not found' }, { status: 401 });
  }

  // Verify password if one is set on the account
  if (data.password_hash && password) {
    const hash = createHash('sha256').update(password).digest('hex');
    if (hash !== data.password_hash) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
  } else if (data.password_hash && !password) {
    return NextResponse.json({ error: 'Password required' }, { status: 401 });
  }

  const has_email = !!(data.email);
  return NextResponse.json({ success: true, login_id: data.login_id, full_name: data.full_name, has_email });
}
