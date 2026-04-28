import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

const SESSION_HOURS = 8;

function getTable(login_id: string) {
  if (login_id.startsWith('DIP-')) return 'dip_students';
  if (login_id.startsWith('WRP-')) return 'wrp_students';
  return null;
}

// POST /api/auth/session — issue a new session token on login
export async function POST(request: Request) {
  const { login_id } = await request.json();
  if (!login_id) return NextResponse.json({ error: 'login_id required' }, { status: 400 });

  const table = getTable(login_id);
  if (!table) return NextResponse.json({ error: 'Invalid login_id' }, { status: 400 });

  const token = randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000).toISOString();

  try {
    await sql`
      UPDATE ${sql(table)}
      SET session_token = ${token}, session_expires_at = ${expires_at}
      WHERE login_id = ${login_id}
    `;
    return NextResponse.json({ token, expires_at });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/auth/session?login_id=X&token=Y — validate session
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const login_id = searchParams.get('login_id');
  const token = searchParams.get('token');

  if (!login_id || !token) return NextResponse.json({ valid: false, reason: 'missing' });

  const table = getTable(login_id);
  if (!table) return NextResponse.json({ valid: false, reason: 'invalid_id' });

  try {
    const rows = await sql`
      SELECT session_token, session_expires_at
      FROM ${sql(table)}
      WHERE login_id = ${login_id}
    `;

    const data = rows[0];
    if (!data) return NextResponse.json({ valid: false, reason: 'not_found' });

    if (data.session_token !== token) {
      return NextResponse.json({ valid: false, reason: 'concurrent_session' });
    }

    if (!data.session_expires_at || new Date(data.session_expires_at) < new Date()) {
      return NextResponse.json({ valid: false, reason: 'expired' });
    }

    return NextResponse.json({ valid: true });
  } catch (error: any) {
    return NextResponse.json({ valid: false, reason: error.message }, { status: 500 });
  }
}
