import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function requireAdmin(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/admin_session=([^;]+)/);
  const session = match ? decodeURIComponent(match[1]) : null;
  return session?.startsWith('admin:');
}

export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const submissions = await sql`
      SELECT 
        n.id, 
        n.login_id, 
        n.page_id, 
        n.colab_url, 
        n.submitted_at,
        s.full_name,
        c.name as cohort_name
      FROM notebook_submissions n
      LEFT JOIN saaio_students s ON n.login_id = s.student_id
      LEFT JOIN cohorts c ON s.cohort_id = c.id
      ORDER BY n.submitted_at DESC
    `;
    return NextResponse.json(submissions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
