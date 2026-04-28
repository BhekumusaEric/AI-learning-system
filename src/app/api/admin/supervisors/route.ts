import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
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
  const data = await sql`
    SELECT login_id FROM supervisors 
    WHERE login_id LIKE ${'SUP-' + year + '-%'}
  `;
  const ids = data.map((r: any) => r.login_id as string);
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
  
  try {
    // We join the supervisors table with a cohort count subquery
    const result = await sql`
      SELECT 
        login_id as id, login_id, name as full_name, email, '' as platform, created_at,
        COALESCE(array_length(cohorts, 1), 0) as cohort_count
      FROM supervisors
      ORDER BY created_at DESC
    `;

    return NextResponse.json(result.map(s => ({
      ...s,
      cohort_count: parseInt(s.cohort_count)
    })));
  } catch (error: any) {
    console.error('[ADMIN_GET_SUPERVISORS_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create supervisor
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { full_name, email, platform } = await request.json();
  if (!full_name || !platform) return NextResponse.json({ error: 'full_name and platform required' }, { status: 400 });

  try {
    const login_id = await nextSupervisorId();
    const plainPassword = generatePassword();
    const password_hash = hashPassword(plainPassword);

    const [data] = await sql`
      INSERT INTO supervisors (login_id, password, name, email)
      VALUES (${login_id}, ${password_hash}, ${full_name.trim()}, ${email?.trim() || null})
      RETURNING login_id as id, login_id, name as full_name, email, created_at
    `;

    return NextResponse.json({ ...data, plainPassword, cohort_count: 0 });
  } catch (error: any) {
    console.error('[ADMIN_POST_SUPERVISOR_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — reset supervisor password
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { login_id } = await request.json();
  if (!login_id) return NextResponse.json({ error: 'login_id required' }, { status: 400 });

  try {
    const plainPassword = generatePassword();
    await sql`
      UPDATE supervisors SET password = ${hashPassword(plainPassword)} 
      WHERE login_id = ${login_id}
    `;
    return NextResponse.json({ plainPassword });
  } catch (error: any) {
    console.error('[ADMIN_PATCH_SUPERVISOR_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — remove supervisor
export async function DELETE(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    await sql`DELETE FROM supervisors WHERE login_id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[ADMIN_DELETE_SUPERVISOR_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
