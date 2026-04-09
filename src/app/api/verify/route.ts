import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

  // Check DIP first, then WRP
  const { data: dip } = await supabase
    .from('dip_students')
    .select('full_name, certificate_name, certificate_unlocked, created_at')
    .eq('verify_token', token)
    .maybeSingle();

  if (dip?.certificate_unlocked) {
    return NextResponse.json({
      valid: true,
      name: dip.certificate_name || dip.full_name,
      program: 'IDC SEF Digital Inclusion Program',
      platform: 'dip',
      issued_at: dip.created_at,
    });
  }

  const { data: wrp } = await supabase
    .from('wrp_students')
    .select('full_name, certificate_name, certificate_unlocked, created_at')
    .eq('verify_token', token)
    .maybeSingle();

  if (wrp?.certificate_unlocked) {
    return NextResponse.json({
      valid: true,
      name: wrp.certificate_name || wrp.full_name,
      program: 'WeThinkCode_ Work Readiness Program',
      platform: 'wrp',
      issued_at: wrp.created_at,
    });
  }

  return NextResponse.json({ valid: false }, { status: 404 });
}
