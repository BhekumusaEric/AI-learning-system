import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createHash } from 'crypto';
import { nextUniqueLoginId, withUniqueLoginIdRetry } from '@/lib/loginId';

export const dynamic = 'force-dynamic';

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

  try {
    const data = await sql`
      SELECT id, name, platform, description, location, start_date, archived 
      FROM cohorts 
      WHERE UPPER(invite_code) = ${code.toUpperCase()}
    `;

    if (data.length === 0) return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
    if (data[0].archived) return NextResponse.json({ error: 'This cohort is no longer accepting registrations' }, { status: 410 });

    return NextResponse.json(data[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { full_name, email, cohort_id, platform } = await request.json();
  if (!full_name?.trim() || !cohort_id || !platform)
    return NextResponse.json({ error: 'full_name, cohort_id and platform required' }, { status: 400 });

  try {
    // Verify cohort exists, belongs to the right platform, and is not archived
    const cohort = await sql`
      SELECT id, archived, platform FROM cohorts WHERE id = ${cohort_id}
    `;

    if (cohort.length === 0) return NextResponse.json({ error: 'Invalid cohort' }, { status: 404 });
    if (cohort[0].archived) return NextResponse.json({ error: 'This cohort is no longer accepting registrations' }, { status: 410 });
    if (cohort[0].platform !== platform) return NextResponse.json({ error: 'Platform mismatch' }, { status: 400 });

    const table = platform === 'wrp' ? 'wrp_students' : 'dip_students';
    const plainPassword = generatePassword();
    const password_hash = createHash('sha256').update(plainPassword).digest('hex');

    const { data, error, login_id } = await withUniqueLoginIdRetry(platform, async (generated_id) => {
      try {
        const result = await sql`
          INSERT INTO ${sql(table)} (login_id, password, name, email, cohort_id)
          VALUES (${generated_id}, ${password_hash}, ${full_name.trim()}, ${email?.trim() || null}, ${cohort_id})
          RETURNING login_id as id, login_id, name as full_name
        `;
        return { error: null, data: result[0] };
      } catch (e: any) {
        return { error: e };
      }
    });

    if (error) throw error;
    return NextResponse.json({ ...data, plainPassword });
  } catch (error: any) {
    console.error('[JOIN_POST_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
