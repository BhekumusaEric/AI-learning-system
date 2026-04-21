import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

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

  try {
    const cohorts = await sql`
      SELECT * FROM cohorts 
      WHERE supervisor_id = ${supervisorId} 
      ORDER BY created_at DESC
    `;

    if (cohorts.length === 0) return NextResponse.json([]);

    const cohortIds = cohorts.map(c => c.id);
    
    // Count students per cohort across DIP and WRP tables
    // We use a UNION ALL to combine the counts from both tables
    const counts = await sql`
      SELECT cohort_id, COUNT(*) as count 
      FROM (
        SELECT cohort_id FROM dip_students WHERE cohort_id IN ${sql(cohortIds)}
        UNION ALL
        SELECT cohort_id FROM wrp_students WHERE cohort_id IN ${sql(cohortIds)}
      ) as combined_students
      GROUP BY cohort_id
    `;

    const countMap: Record<string, number> = {};
    counts.forEach(c => {
      countMap[c.cohort_id] = parseInt(c.count);
    });

    const result = cohorts.map(c => ({
      ...c,
      student_count: countMap[c.id] || 0
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[SUPERVISOR_GET_COHORTS_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a new cohort
export async function POST(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, platform, description, location, start_date } = await request.json();
  if (!name || !platform) return NextResponse.json({ error: 'name and platform required' }, { status: 400 });

  try {
    // Generate unique invite code
    let invite_code = genCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await sql`SELECT id FROM cohorts WHERE invite_code = ${invite_code}`;
      if (existing.length === 0) break;
      invite_code = genCode();
      attempts++;
    }

    const [cohort] = await sql`
      INSERT INTO cohorts (name, platform, description, location, start_date, supervisor_id, invite_code)
      VALUES (${name}, ${platform}, ${description || null}, ${location || null}, ${start_date || null}, ${supervisorId}, ${invite_code})
      RETURNING *
    `;

    return NextResponse.json(cohort);
  } catch (error: any) {
    console.error('[SUPERVISOR_POST_COHORT_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update cohort (archive, rename)
export async function PATCH(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    // Verify ownership
    const cohort = await sql`SELECT supervisor_id FROM cohorts WHERE id = ${id}`;
    if (cohort.length === 0) return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
    if (cohort[0].supervisor_id !== supervisorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Filter valid update keys
    const validKeys = ['name', 'description', 'location', 'start_date', 'archived'];
    const filteredUpdates: Record<string, any> = {};
    validKeys.forEach(key => {
      if (key in updates) filteredUpdates[key] = updates[key];
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    const [updatedCohort] = await sql`
      UPDATE cohorts SET ${sql(filteredUpdates)}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(updatedCohort);
  } catch (error: any) {
    console.error('[SUPERVISOR_PATCH_COHORT_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — archive a cohort
export async function DELETE(request: Request) {
  const supervisorId = getSupervisorId(request);
  if (!supervisorId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    const cohort = await sql`SELECT supervisor_id FROM cohorts WHERE id = ${id}`;
    if (cohort.length === 0) return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
    if (cohort[0].supervisor_id !== supervisorId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await sql`UPDATE cohorts SET archived = true WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[SUPERVISOR_DELETE_COHORT_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
