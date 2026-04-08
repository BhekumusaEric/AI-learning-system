import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/admin_session=([^;]+)/);
  const session = m ? decodeURIComponent(m[1]) : null;
  return session === 'admin:' + (process.env.ADMIN_PASSWORD || 'supersecret');
}

function genToken() {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// GET — list all invite links
export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const data = await sql`
      SELECT * FROM invite_links 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a new invite link
export async function POST(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { type, platform, label, expires_at, max_uses } = await request.json();
  if (!type) return NextResponse.json({ error: 'type required' }, { status: 400 });

  try {
    // Unique token with collision check
    let token = genToken();
    for (let i = 0; i < 5; i++) {
      const existing = await sql`SELECT id FROM invite_links WHERE token = ${token}`;
      if (existing.length === 0) break;
      token = genToken();
    }

    const [data] = await sql`
      INSERT INTO invite_links (token, type, platform, label, expires_at, max_uses)
      VALUES (${token}, ${type}, ${platform || null}, ${label || null}, ${expires_at || null}, ${max_uses || null})
      RETURNING *
    `;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — refresh token or update expiry/label
export async function PATCH(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, refresh, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    const finalUpdates: Record<string, any> = { ...updates };

    if (refresh) {
      let token = genToken();
      for (let i = 0; i < 5; i++) {
        const existing = await sql`SELECT id FROM invite_links WHERE token = ${token}`;
        if (existing.length === 0) break;
        token = genToken();
      }
      finalUpdates.token = token;
      finalUpdates.use_count = 0;
      finalUpdates.revoked = false;
    }

    // Filter valid update keys
    const validKeys = ['token', 'label', 'expires_at', 'max_uses', 'use_count', 'revoked'];
    const filteredUpdates: Record<string, any> = {};
    validKeys.forEach(key => {
      if (key in finalUpdates) filteredUpdates[key] = finalUpdates[key];
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    const [data] = await sql`
      UPDATE invite_links SET ${sql(filteredUpdates)}
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — revoke (soft) or hard delete
export async function DELETE(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const hard = searchParams.get('hard') === 'true';
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    if (hard) {
      await sql`DELETE FROM invite_links WHERE id = ${id}`;
    } else {
      await sql`UPDATE invite_links SET revoked = true WHERE id = ${id}`;
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
