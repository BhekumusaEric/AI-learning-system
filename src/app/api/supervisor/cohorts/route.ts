import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function genCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase();
}

function getSupervisorId(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/supervisor_id=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

// GET — list cohorts for this supervisor
export async function GET(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('cohorts')
    .select('*')
    .eq('supervisor_id', supervisorId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Count students per cohort
  const cohortIds = (data || []).map((c: any) => c.id);
  const counts: Record<string, number> = {};
  if (cohortIds.length > 0) {
    for (const platform of ['dip', 'wrp']) {
      const table = platform === 'dip' ? 'dip_students' : 'wrp_students';
      const { data: students } = await supabase
        .from(table)
        .select('cohort_id')
        .in('cohort_id', cohortIds);
      (students || []).forEach((s: any) => {
        counts[s.cohort_id] = (counts[s.cohort_id] || 0) + 1;
      });
    }
  }

  return NextResponse.json((data || []).map((c: any) => ({ ...c, student_count: counts[c.id] || 0 })));
}

// POST — create a new cohort
export async function POST(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, platform, description, location, start_date } = await request.json();
  if (!name || !platform) return NextResponse.json({ error: 'name and platform required' }, { status: 400 });

  // Generate unique invite code
  let invite_code = genCode();
  let attempts = 0;
  while (attempts < 5) {
    const { data: existing } = await supabase.from('cohorts').select('id').eq('invite_code', invite_code).maybeSingle();
    if (!existing) break;
    invite_code = genCode();
    attempts++;
  }

  const { data, error } = await supabase
    .from('cohorts')
    .insert({ name, platform, description, location, start_date: start_date || null, supervisor_id: supervisorId, invite_code })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH — update cohort (archive, rename)
export async function PATCH(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Verify ownership
  const { data: cohort } = await supabase.from('cohorts').select('supervisor_id').eq('id', id).maybeSingle();
  if (!cohort || cohort.supervisor_id !== supervisorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data, error } = await supabase.from('cohorts').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — archive a cohort
export async function DELETE(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data: cohort } = await supabase.from('cohorts').select('supervisor_id').eq('id', id).maybeSingle();
  if (!cohort || cohort.supervisor_id !== supervisorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await supabase.from('cohorts').update({ archived: true }).eq('id', id);
  return NextResponse.json({ success: true });
}
