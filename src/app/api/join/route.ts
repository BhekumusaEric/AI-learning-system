import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';
import { nextUniqueLoginId } from '@/lib/loginId';

export const dynamic = 'force-dynamic';

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

  const { data, error } = await supabase
    .from('cohorts')
    .select('id, name, platform, description, location, start_date, archived')
    .eq('invite_code', code.toUpperCase())
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
  if (data.archived) return NextResponse.json({ error: 'This cohort is no longer accepting registrations' }, { status: 410 });

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { full_name, email, cohort_id, platform } = await request.json();
  if (!full_name?.trim() || !cohort_id || !platform)
    return NextResponse.json({ error: 'full_name, cohort_id and platform required' }, { status: 400 });

  // Verify cohort exists, belongs to the right platform, and is not archived
  const { data: cohort } = await supabase
    .from('cohorts')
    .select('id, archived, platform')
    .eq('id', cohort_id)
    .maybeSingle();

  if (!cohort) return NextResponse.json({ error: 'Invalid cohort' }, { status: 404 });
  if (cohort.archived) return NextResponse.json({ error: 'This cohort is no longer accepting registrations' }, { status: 410 });
  if (cohort.platform !== platform) return NextResponse.json({ error: 'Platform mismatch' }, { status: 400 });

  const table = platform === 'wrp' ? 'wrp_students' : 'dip_students';
  const login_id = await nextUniqueLoginId(platform);
  const plainPassword = generatePassword();
  const password_hash = createHash('sha256').update(plainPassword).digest('hex');

  const { data, error } = await supabase
    .from(table)
    .insert({ login_id, password_hash, full_name: full_name.trim(), email: email?.trim() || null, cohort_id })
    .select('id, login_id, full_name')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, plainPassword });
}
