import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

// GET /api/admin/cohorts?platform=dip
export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') || 'saaio';

  try {
    const data = await sql`
      SELECT * FROM cohorts 
      WHERE platform = ${platform} 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/cohorts  { name, platform }
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, platform } = await request.json();
  if (!name?.trim() || !platform) return NextResponse.json({ error: 'name and platform required' }, { status: 400 });

  try {
    const [data] = await sql`
      INSERT INTO cohorts (name, platform) 
      VALUES (${name.trim()}, ${platform}) 
      RETURNING *
    `;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/cohorts  { id, archived?, name? }
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, archived, name } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    if (archived !== undefined && name !== undefined) {
      await sql`UPDATE cohorts SET archived = ${archived}, name = ${name.trim()} WHERE id = ${id}`;
    } else if (archived !== undefined) {
      await sql`UPDATE cohorts SET archived = ${archived} WHERE id = ${id}`;
    } else if (name !== undefined) {
      await sql`UPDATE cohorts SET name = ${name.trim()} WHERE id = ${id}`;
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
