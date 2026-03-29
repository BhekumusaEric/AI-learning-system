import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST /api/student/request-certificate
// Body: { login_id, platform }
export async function POST(request: Request) {
  const { login_id, platform } = await request.json();
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'wrp_students';

  const { data, error } = await supabase
    .from(table)
    .update({ certificate_requested: true })
    .eq('login_id', login_id)
    .select('certificate_unlocked')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, certificate_unlocked: data.certificate_unlocked });
}

// GET /api/student/request-certificate?login_id=...&platform=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const login_id = searchParams.get('login_id');
  const platform = searchParams.get('platform');
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'wrp_students';

  const { data, error } = await supabase
    .from(table)
    .select('certificate_requested, certificate_unlocked')
    .eq('login_id', login_id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    certificate_requested: data.certificate_requested ?? false,
    certificate_unlocked: data.certificate_unlocked ?? false,
  });
}
