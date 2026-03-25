import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(p: string) { return createHash('sha256').update(p).digest('hex'); }
function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/admin_session=([^;]+)/);
  const session = m ? decodeURIComponent(m[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

async function nextSupervisorId(): Promise<string> {
  const year = new Date().getFullYear();
  const { data } = await supabase.from('supervisors').select('login_id').like('login_id', `SUP-${year}-%`);
  const ids = (data || []).map((r: any) => r.login_id as string);
  let max = 0;
  for (const id of ids) {
    const n = parseInt(id.split('-').pop() || '0', 10);
    if (n > max) max = n;
  }
  return `SUP-${year}-${String(max + 1).padStart(3, '0')}`;
}

// GET — list all supervisors
export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabase
    .from('supervisors')
    .select('id, login_id, full_name, email, platform, created_at')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Count cohorts per supervisor
  const { data: cohorts } = await supabase.from('cohorts').select('supervisor_id');
  const cohortCounts: Record<string, number> = {};
  (cohorts || []).forEach((c: any) => {
    if (c.supervisor_id) cohortCounts[c.supervisor_id] = (cohortCounts[c.supervisor_id] || 0) + 1;
  });

  return NextResponse.json((data || []).map((s: any) => ({ ...s, cohort_count: cohortCounts[s.id] || 0 })));
}

// POST — create supervisor
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { full_name, email, platform } = await request.json();
  if (!full_name || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

  const login_id = await nextSupervisorId();
  const plainPassword = generatePassword();
  const password_hash = hashPassword(plainPassword);

  const { data, error } = await supabase
    .from('supervisors')
    .insert({ login_id, password_hash, full_name, email: email || null, platform })
    .select('id, login_id, full_name, email, platform, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, plainPassword, cohort_count: 0 });
}

// PATCH — reset supervisor password
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { login_id } = await request.json();
  const plainPassword = generatePassword();
  await supabase.from('supervisors').update({ password_hash: hashPassword(plainPassword) }).eq('login_id', login_id);
  return NextResponse.json({ plainPassword });
}

// DELETE — remove supervisor
export async function DELETE(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await supabase.from('supervisors').delete().eq('id', id);
  return NextResponse.json({ success: true });
}
