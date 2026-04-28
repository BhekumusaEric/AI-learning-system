import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/wrp/quiz?limit=10  — top scores leaderboard
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    // Join with student names in a single query
    const data = await sql`
      SELECT 
        p.login_id, 
        s.name as full_name, 
        p.quiz_scores
      FROM wrp_progress p
      JOIN wrp_students s ON p.login_id = s.login_id
      WHERE p.quiz_scores IS NOT NULL
      ORDER BY (p.quiz_scores->>'best_score')::int DESC
      LIMIT ${limit}
    `;

    const leaderboard = data.map((r: any) => ({
      login_id: r.login_id,
      full_name: r.full_name,
      best_score: r.quiz_scores?.best_score ?? 0,
      best_correct: r.quiz_scores?.best_correct ?? 0,
      total_questions: r.quiz_scores?.total_questions ?? 0,
      games_played: r.quiz_scores?.games_played ?? 0,
    }));

    return NextResponse.json(leaderboard);
  } catch (error: any) {
    console.error('[WRP_QUIZ_GET_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/wrp/quiz  — save a player's score after a game
export async function POST(request: Request) {
  const { login_id, correct, total, score } = await request.json();
  if (!login_id) return NextResponse.json({ error: 'login_id required' }, { status: 400 });

  try {
    // Fetch existing scores
    const existing = await sql`
      SELECT quiz_scores FROM wrp_progress WHERE login_id = ${login_id}
    `;

    const prev = existing.length > 0 ? (existing[0].quiz_scores || {}) : {};
    const updated = {
      best_score: Math.max(prev.best_score ?? 0, score),
      best_correct: Math.max(prev.best_correct ?? 0, correct),
      total_questions: total,
      games_played: (prev.games_played ?? 0) + 1,
      last_played: new Date().toISOString(),
    };

    // Upsert using native Postgres syntax
    await sql`
      INSERT INTO wrp_progress (login_id, quiz_scores, last_active)
      VALUES (${login_id}, ${sql.json(updated)}, ${new Date().toISOString()})
      ON CONFLICT (login_id) 
      DO UPDATE SET 
        quiz_scores = EXCLUDED.quiz_scores,
        last_active = EXCLUDED.last_active
    `;

    return NextResponse.json({ success: true, quiz_scores: updated });
  } catch (error: any) {
    console.error('[WRP_QUIZ_POST_FAILED]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
