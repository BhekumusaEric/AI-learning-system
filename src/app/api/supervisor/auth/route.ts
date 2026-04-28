import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hash(p: string) { return createHash('sha256').update(p).digest('hex'); }

export async function POST(request: Request) {
  const { login_id, password } = await request.json();
  if (!login_id || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  try {
    const data = await sql`
      SELECT id, login_id, name as full_name, email, platform, password as password_hash 
      FROM supervisors 
      WHERE login_id = ${login_id.trim().toUpperCase()}
    `;

    if (data.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const supervisor = data[0];

    if (supervisor.password_hash !== hash(password.trim())) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      id: supervisor.id,
      login_id: supervisor.login_id,
      full_name: supervisor.full_name,
      email: supervisor.email,
      platform: supervisor.platform,
    });
  } catch (error: any) {
    console.error('[SUPERVISOR_AUTH_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
