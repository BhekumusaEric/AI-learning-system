import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { login_id, platform } = await request.json();

  if (!login_id || !platform) {
    return NextResponse.json({ error: 'login_id and platform are required' }, { status: 400 });
  }

  const table = platform === 'dip' ? 'dip_students' : platform === 'wrp' ? 'wrp_students' : 'saaio_students';

  try {
    const data = await sql`
      SELECT id, login_id, full_name, email 
      FROM ${sql(table)} 
      WHERE login_id = ${login_id.trim().toUpperCase()}
    `;

    if (data.length === 0) {
      return NextResponse.json({ error: 'Student ID not found' }, { status: 401 });
    }

    const user = data[0];
    const has_email = !!(user.email);

    return NextResponse.json({ 
      success: true, 
      login_id: user.login_id, 
      full_name: user.full_name, 
      has_email 
    });
  } catch (error: any) {
    console.error('[VERIFY_SESSION_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
