import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/wrp/quiz?limit=10  — top scores leaderboard
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const { data, error } = await supabase
    .from('wrp_progress')
    .select('login_id, quiz_scores')
    .not('quiz_scores', 'is', null)
    .order('quiz_scores->best_score', { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Join with student names
  const loginIds = (data || []).map((r: any) => r.login_id);
  const { data: students } = await supabase
    .from('wrp_students')
    .select('login_id, full_name')
    .in('login_id', loginIds);

  const nameMap: Record<string, string> = {};
  (students || []).forEach((s: any) => { nameMap[s.login_id] = s.full_name; });

  const leaderboard = (data || [])
    .map((r: any) => ({
      login_id: r.login_id,
      full_name: nameMap[r.login_id] || r.login_id,
      best_score: r.quiz_scores?.best_score ?? 0,
      best_correct: r.quiz_scores?.best_correct ?? 0,
      total_questions: r.quiz_scores?.total_questions ?? 0,
      games_played: r.quiz_scores?.games_played ?? 0,
    }))
    .sort((a: any, b: any) => b.best_score - a.best_score);

  return NextResponse.json(leaderboard);
}

// POST /api/wrp/quiz  — save a player's score after a game
export async function POST(request: Request) {
  const { login_id, correct, total, score } = await request.json();
  if (!login_id) return NextResponse.json({ error: 'login_id required' }, { status: 400 });

  // Fetch existing scores
  const { data: existing } = await supabase
    .from('wrp_progress')
    .select('quiz_scores')
    .eq('login_id', login_id)
    .single();

  const prev = existing?.quiz_scores || {};
  const updated = {
    best_score: Math.max(prev.best_score ?? 0, score),
    best_correct: Math.max(prev.best_correct ?? 0, correct),
    total_questions: total,
    games_played: (prev.games_played ?? 0) + 1,
    last_played: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('wrp_progress')
    .upsert({ login_id, quiz_scores: updated, last_active: new Date().toISOString() }, { onConflict: 'login_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, quiz_scores: updated });
}
