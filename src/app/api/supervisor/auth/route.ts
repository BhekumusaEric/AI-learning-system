import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hash(p: string) { return createHash('sha256').update(p).digest('hex'); }

export async function POST(request: Request) {
  const { login_id, password } = await request.json();
  if (!login_id || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { data, error } = await supabase
    .from('supervisors')
    .select('id, login_id, full_name, email, platform, password_hash')
    .eq('login_id', login_id.trim().toUpperCase())
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  if (data.password_hash !== hash(password.trim())) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  return NextResponse.json({
    success: true,
    id: data.id,
    login_id: data.login_id,
    full_name: data.full_name,
    email: data.email,
    platform: data.platform,
  });
}
