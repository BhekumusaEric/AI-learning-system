import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { login_id, platform } = await request.json();

  if (!login_id || !platform) {
    return NextResponse.json({ error: 'login_id and platform are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : 'saaio_students';

  const { data, error } = await supabase
    .from(table)
    .select('id, login_id, full_name')
    .eq('login_id', login_id.trim().toUpperCase())
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Student ID not found' }, { status: 401 });
  }

  return NextResponse.json({ success: true, login_id: data.login_id, full_name: data.full_name });
}
