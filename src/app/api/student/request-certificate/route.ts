import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET — fetch certificate status + saved name
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const login_id = searchParams.get('login_id');
  const platform = searchParams.get('platform');
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'wrp_students';

  try {
    const rows = await sql`
      SELECT certificate_requested, certificate_unlocked, certificate_name, name_change_requested
      FROM ${sql(table)}
      WHERE login_id = ${login_id}
    `;
    if (rows.length === 0) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    const data = rows[0];
    return NextResponse.json({
      certificate_requested: data.certificate_requested ?? false,
      certificate_unlocked: data.certificate_unlocked ?? false,
      certificate_name: data.certificate_name ?? null,
      name_change_requested: data.name_change_requested ?? false,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST — request certificate OR save name OR request name change
export async function POST(request: Request) {
  const body = await request.json();
  const { login_id, platform, action, certificate_name } = body;
  if (!login_id || !platform) return NextResponse.json({ error: 'login_id and platform required' }, { status: 400 });

  const table = platform === 'dip' ? 'dip_students' : 'wrp_students';

  try {
    if (action === 'save_name') {
      // Lock the name permanently on first download (only if not already set)
      await sql`
        UPDATE ${sql(table)}
        SET certificate_name = ${certificate_name}, name_change_requested = false
        WHERE login_id = ${login_id} AND certificate_name IS NULL
      `;
      return NextResponse.json({ success: true });
    }

    if (action === 'request_name_change') {
      await sql`
        UPDATE ${sql(table)} SET name_change_requested = true WHERE login_id = ${login_id}
      `;
      return NextResponse.json({ success: true });
    }

    // Default: request certificate
    const rows = await sql`
      UPDATE ${sql(table)}
      SET certificate_requested = true
      WHERE login_id = ${login_id}
      RETURNING certificate_unlocked
    `;
    if (rows.length === 0) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    return NextResponse.json({ success: true, certificate_unlocked: rows[0].certificate_unlocked });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
