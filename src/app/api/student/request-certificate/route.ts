import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET — fetch certificate status + saved name
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const login_id = searchParams.get('login_id');
  const platform = searchParams.get('platform');
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'wrp_students';
  const { data, error } = await supabase
    .from(table)
    .select('certificate_requested, certificate_unlocked, certificate_name, name_change_requested, verify_token')
    .eq('login_id', login_id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    certificate_requested: data.certificate_requested ?? false,
    certificate_unlocked: data.certificate_unlocked ?? false,
    certificate_name: data.certificate_name ?? null,
    name_change_requested: data.name_change_requested ?? false,
  });
}

// POST — request certificate OR save name OR request name change
export async function POST(request: Request) {
  const body = await request.json();
  const { login_id, platform, action, certificate_name } = body;
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'wrp_students';

  if (action === 'save_name') {
    // Lock the name permanently on first download
    const { error } = await supabase
      .from(table)
      .update({ certificate_name, name_change_requested: false })
      .eq('login_id', login_id)
      .is('certificate_name', null); // only if not already set
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'request_name_change') {
    const { error } = await supabase
      .from(table)
      .update({ name_change_requested: true })
      .eq('login_id', login_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // Default: request certificate
  const { data, error } = await supabase
    .from(table)
    .update({ certificate_requested: true })
    .eq('login_id', login_id)
    .select('certificate_unlocked')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, certificate_unlocked: data.certificate_unlocked });
}
