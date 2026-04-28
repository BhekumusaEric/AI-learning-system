import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  if (!session?.startsWith('admin:')) return false;
  return true;
}

// GET — list all admins
export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const admins = await sql`
      SELECT id, username, name as full_name, created_at 
      FROM admins 
      ORDER BY created_at ASC
    `;
    return NextResponse.json(admins);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create new admin
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { username, password, full_name } = await request.json();
  if (!username || !password || !full_name) {
    return NextResponse.json({ error: 'username, password and full_name required' }, { status: 400 });
  }
  try {
    const [admin] = await sql`
      INSERT INTO admins (username, password, name)
      VALUES (${username}, ${hashPassword(password)}, ${full_name})
      RETURNING id, username, name as full_name, created_at
    `;
    return NextResponse.json(admin);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update username or password
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, username, password, full_name } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  
  try {
    const updates: Record<string, any> = {};
    if (username) updates.username = username;
    if (full_name) updates.name = full_name;
    if (password) updates.password = hashPassword(password);
    
    if (Object.keys(updates).length === 0) return NextResponse.json({ success: true });

    await sql`
      UPDATE admins SET ${sql(updates)} WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — remove admin
export async function DELETE(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    // Prevent deleting last admin
    const admins = await sql`SELECT count(*) as count FROM admins`;
    const count = parseInt(admins[0].count);
    
    if (count <= 1) return NextResponse.json({ error: 'Cannot delete the last admin' }, { status: 400 });
    
    await sql`DELETE FROM admins WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
