import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getTable(loginId: string) {
  if (loginId.startsWith('DIP-')) return 'dip_progress';
  if (loginId.startsWith('WRP-')) return 'wrp_progress';
  return 'saaio_progress';
}

// GET: Fetch user progress
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'guest';

  const table = getTable(username);
  
  try {
    const result = await sql`
      SELECT completed_pages FROM ${sql(table)} WHERE login_id = ${username}
    `;
    
    return NextResponse.json({ 
      completedPages: result[0]?.completed_pages || {} 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Update user progress
export async function POST(request: Request) {
  const body = await request.json();
  const { username, completedPages, examScore, examPassed } = body;

  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const table = getTable(username);

  try {
    // Check existing to merge
    const existing = await sql`
      SELECT completed_pages FROM ${sql(table)} WHERE login_id = ${username}
    `;
    
    const merged = { ...(existing[0]?.completed_pages || {}), ...(completedPages || {}) };

    // UPSERT style using postgres-js ON CONFLICT
    await sql`
      INSERT INTO ${sql(table)} (login_id, completed_pages, last_active, exam_score, exam_passed)
      VALUES (${username}, ${sql.json(merged)}, NOW(), ${examScore ?? null}, ${examPassed ?? null})
      ON CONFLICT (login_id) 
      DO UPDATE SET 
        completed_pages = EXCLUDED.completed_pages,
        last_active = EXCLUDED.last_active,
        exam_score = COALESCE(EXCLUDED.exam_score, ${sql(table)}.exam_score),
        exam_passed = COALESCE(EXCLUDED.exam_passed, ${sql(table)}.exam_passed)
    `;

    return NextResponse.json({ success: true, completedPages: merged });
  } catch (error: any) {
    console.error('[PROGRESS_UPDATE_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const table = getTable(username);

  try {
    await sql`DELETE FROM ${sql(table)} WHERE login_id = ${username}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
