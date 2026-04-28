import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(p: string) {
  return createHash('sha256').update(p).digest('hex');
}

export async function POST(request: Request) {
  const { login_id, password, platform } = await request.json();
  if (!login_id || !password || !platform) {
    return NextResponse.json({ error: 'login_id, password, and platform are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  const idColumn = platform === 'saaio' ? 'student_id' : 'login_id';

  try {
    const data = await sql`
      SELECT ${sql(idColumn)} as login_id, full_name, password as password_hash, email 
      FROM ${sql(table)} 
      WHERE ${sql(idColumn)} = ${login_id.trim().toUpperCase()}
    `;

    if (data.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = data[0];

    if (user.password_hash !== hashPassword(password.trim())) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const has_email = !!(user.email);
    return NextResponse.json({ 
      success: true, 
      login_id: user.login_id, 
      full_name: user.full_name, 
      has_email 
    });
  } catch (error: any) {
    console.error('[STUDENT_LOGIN_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
