import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await sql`
      SELECT login_id, full_name 
      FROM wrp_students 
      ORDER BY full_name ASC
    `;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[WRP_GET_STUDENTS_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
