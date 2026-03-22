"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy, Clock, Wifi, WifiOff, Play, RotateCcw, CheckCircle, XCircle, Zap } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Quiz Questions ────────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  // Verbal Communication
  { q: 'What is an elevator pitch?', options: ['A speech given in an elevator', 'A 30–60 second summary of who you are and what you offer', 'A formal presentation to a board', 'A written introduction email'], correct: 1, topic: 'Verbal Communication' },
  { q: 'Which of these is the best opening for an elevator pitch?', options: ['"Um, so I\'m kind of good at stuff"', '"Hi, I\'m a hard worker and team player"', '"Hi, I\'m Thabo — a junior developer with a passion for fintech solutions"', '"I need a job and I think I\'d be good here"'], correct: 2, topic: 'Verbal Communication' },
  { q: 'Eye contact during a conversation shows:', options: ['Aggression', 'Confidence and engagement', 'Nervousness', 'Disrespect'], correct: 1, topic: 'Verbal Communication' },
  { q: 'Active listening means:', options: ['Waiting for your turn to speak', 'Nodding, asking questions, and showing you understood', 'Agreeing with everything said', 'Taking notes on your phone'], correct: 1, topic: 'Verbal Communication' },

  // Written Communication
  { q: 'Which subject line is most professional?', options: ['"job"', '"hey"', '"Application for Junior Developer Role — Thabo Nkosi"', '"PLEASE READ URGENT"'], correct: 2, topic: 'Written Communication' },
  { q: 'A professional email should start with:', options: ['"Hey"', '"Yo"', '"Dear Ms. Naidoo,"', '"Sup,"'], correct: 2, topic: 'Written Communication' },
  { q: 'Which sign-off is appropriate for a job application email?', options: ['"Thx"', '"Later"', '"Kind regards, Thabo Nkosi"', '"Sent from my iPhone"'], correct: 2, topic: 'Written Communication' },
  { q: 'What does "CC" mean in an email?', options: ['Carbon Copy — sends a copy to another person', 'Confidential Content', 'Cancel and Close', 'Correct Copy'], correct: 0, topic: 'Written Communication' },

  // Interview Skills
  { q: 'What time should you arrive for a job interview?', options: ['Exactly on time', '5–10 minutes early', '30 minutes early', 'It doesn\'t matter'], correct: 1, topic: 'Interview Skills' },
  { q: 'The STAR method stands for:', options: ['Skill, Task, Action, Result', 'Situation, Task, Action, Result', 'Strength, Talent, Ability, Result', 'Story, Topic, Answer, Review'], correct: 1, topic: 'Interview Skills' },
  { q: 'When asked "Tell me about yourself," you should:', options: ['Recite your entire life story', 'Say "I don\'t know"', 'Give a structured 60-second professional summary', 'Ask the interviewer to go first'], correct: 2, topic: 'Interview Skills' },
  { q: 'At the end of an interview, you should:', options: ['Say "Nope, I\'m good" when asked if you have questions', 'Ask at least one thoughtful question', 'Ask about salary immediately', 'Leave without saying goodbye'], correct: 1, topic: 'Interview Skills' },

  // LinkedIn & Personal Brand
  { q: 'Your LinkedIn headline should be:', options: ['Just your job title', 'A keyword-rich description of your value', 'Your phone number', 'Left blank'], correct: 1, topic: 'LinkedIn & Personal Brand' },
  { q: 'Which is a buzzword to AVOID on LinkedIn?', options: ['Python developer', 'Data analyst', 'Synergy-driven thought leader', 'Customer service specialist'], correct: 2, topic: 'LinkedIn & Personal Brand' },
  { q: 'A professional profile photo should show:', options: ['You at a party', 'A clear, well-lit headshot with a neutral background', 'A group photo', 'A cartoon avatar'], correct: 1, topic: 'LinkedIn & Personal Brand' },

  // CV & Resume
  { q: 'How long should a CV be for a recent graduate?', options: ['5–6 pages', '1–2 pages', 'As long as possible', 'Half a page'], correct: 1, topic: 'CV & Resume' },
  { q: 'Which section should appear first on a CV?', options: ['Hobbies', 'References', 'Contact details and professional summary', 'Certifications'], correct: 2, topic: 'CV & Resume' },
  { q: 'Achievement bullets on a CV should:', options: ['Be vague and general', 'Use action verbs and include numbers where possible', 'Be written in paragraph form', 'List duties only'], correct: 1, topic: 'CV & Resume' },
  { q: 'Why include volunteer work on a CV?', options: ['It fills space', 'It shows initiative, values, and real-world skills', 'Employers don\'t care about it', 'It replaces work experience'], correct: 1, topic: 'CV & Resume' },

  // Workplace Readiness
  { q: 'What does "professionalism" mean in the workplace?', options: ['Wearing a suit every day', 'Behaving with integrity, reliability, and respect', 'Never making mistakes', 'Always agreeing with your manager'], correct: 1, topic: 'Workplace Readiness' },
  { q: 'If you will be late to work, you should:', options: ['Say nothing and hope no one notices', 'Notify your manager as early as possible', 'Send a message after you arrive', 'Ask a colleague to cover for you'], correct: 1, topic: 'Workplace Readiness' },
  { q: 'Constructive feedback from a manager should be:', options: ['Ignored', 'Taken personally and argued against', 'Listened to and used to improve', 'Shared with colleagues'], correct: 2, topic: 'Workplace Readiness' },
  { q: 'Which is an example of a "soft skill"?', options: ['Python programming', 'Excel formulas', 'Active listening and communication', 'Database management'], correct: 2, topic: 'Workplace Readiness' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Question { q: string; options: string[]; correct: number; topic: string; }
interface PlayerScore { login_id: string; name: string; score: number; correct: number; answered: boolean; lastAnswerCorrect: boolean | null; }

interface GameState {
  phase: 'lobby' | 'question' | 'reveal' | 'finished';
  questionIdx: number;
  questions: Question[];
  timeLeft: number;
  scores: Record<string, PlayerScore>;
  selectedAnswer: Record<string, number>; // login_id -> answer index
}

// ── ConnectedBadge ────────────────────────────────────────────────────────────
function ConnectedBadge({ connected }: { connected: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${connected ? 'bg-accent/10 text-accent' : 'bg-error/10 text-error'}`}>
      {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {connected ? 'Live' : 'Connecting...'}
    </div>
  );
}

// ── Leaderboard (persistent) ──────────────────────────────────────────────────
export function QuizLeaderboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wrp/quiz')
      .then(r => r.json())
      .then(d => { setScores(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-secondary-text text-sm text-center py-4">Loading leaderboard...</p>;
  if (scores.length === 0) return <p className="text-secondary-text text-sm text-center py-4">No quiz scores yet. Play the live quiz to appear here!</p>;

  return (
    <div className="flex flex-col gap-2">
      {scores.slice(0, 10).map((s, i) => (
        <div key={s.login_id} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${i === 0 ? 'bg-accent/10 border-accent/40' : i === 1 ? 'bg-secondary border-border-subtle' : 'bg-secondary border-border-subtle'}`}>
          <div className="flex items-center gap-3">
            <span className={`text-lg font-bold w-6 ${i === 0 ? 'text-accent' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-secondary-text'}`}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </span>
            <div>
              <p className="font-semibold text-sm">{s.full_name}</p>
              <p className="text-xs text-secondary-text">{s.games_played} game{s.games_played !== 1 ? 's' : ''} played</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-bold text-lg ${i === 0 ? 'text-accent' : 'text-foreground'}`}>{s.best_score} pts</p>
            <p className="text-xs text-secondary-text">{s.best_correct}/{s.total_questions} correct</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main LiveQuiz component ───────────────────────────────────────────────────
export default function LiveQuiz() {
  const myLoginId = useRef<string>('');
  const myName = useRef<string>('');
  const isHost = useRef(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    phase: 'lobby', questionIdx: 0,
    questions: shuffle(ALL_QUESTIONS).slice(0, 10),
    timeLeft: 20, scores: {}, selectedAnswer: {},
  });
  const [myAnswer, setMyAnswer] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState(false);

  // Read identity from localStorage
  useEffect(() => {
    myLoginId.current = localStorage.getItem('ioai_user') || 'guest-' + Math.random().toString(36).slice(2, 7);
    myName.current = localStorage.getItem('ioai_name') || 'Guest';
  }, []);

  const broadcast = useCallback((state: GameState) => {
    channelRef.current?.send({ type: 'broadcast', event: 'quiz', payload: state });
  }, []);

  useEffect(() => {
    const ch = supabase.channel('live-quiz', { config: { broadcast: { self: true } } });
    channelRef.current = ch;
    ch.on('broadcast', { event: 'quiz' }, ({ payload }: any) => {
      setGameState(payload as GameState);
      setMyAnswer(null);
    })
      .subscribe(status => setConnected(status === 'SUBSCRIBED'));
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Host timer
  const advanceQuestion = useCallback((prev: GameState) => {
    clearInterval(timerRef.current!);
    const nextIdx = prev.questionIdx + 1;
    if (nextIdx >= prev.questions.length) {
      const next: GameState = { ...prev, phase: 'finished', timeLeft: 0 };
      setGameState(next);
      broadcast(next);
    } else {
      // Brief reveal phase
      const reveal: GameState = { ...prev, phase: 'reveal' };
      setGameState(reveal);
      broadcast(reveal);
      setTimeout(() => {
        const next: GameState = { ...prev, phase: 'question', questionIdx: nextIdx, timeLeft: 20, selectedAnswer: {} };
        setGameState(next);
        broadcast(next);
      }, 3000);
    }
  }, [broadcast]);

  useEffect(() => {
    if (gameState.phase !== 'question' || !isHost.current) return;
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.phase !== 'question') { clearInterval(timerRef.current!); return prev; }
        if (prev.timeLeft <= 1) {
          clearInterval(timerRef.current!);
          advanceQuestion(prev);
          return prev;
        }
        const next = { ...prev, timeLeft: prev.timeLeft - 1 };
        broadcast(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [gameState.phase, gameState.questionIdx, advanceQuestion, broadcast]);

  // Save score when game finishes
  useEffect(() => {
    if (gameState.phase !== 'finished' || savedScore || !myLoginId.current || myLoginId.current.startsWith('guest')) return;
    const me = gameState.scores[myLoginId.current];
    if (!me) return;
    setSavedScore(true);
    fetch('/api/wrp/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id: myLoginId.current, correct: me.correct, total: gameState.questions.length, score: me.score }),
    });
  }, [gameState.phase, gameState.scores, gameState.questions.length, savedScore]);

  const startGame = () => {
    isHost.current = true;
    const next: GameState = {
      phase: 'question', questionIdx: 0,
      questions: shuffle(ALL_QUESTIONS).slice(0, 10),
      timeLeft: 20, scores: {}, selectedAnswer: {},
    };
    setGameState(next);
    broadcast(next);
    setMyAnswer(null);
    setSavedScore(false);
  };

  const submitAnswer = (answerIdx: number) => {
    if (myAnswer !== null || gameState.phase !== 'question') return;
    setMyAnswer(answerIdx);
    const q = gameState.questions[gameState.questionIdx];
    const isCorrect = answerIdx === q.correct;
    // Points: faster = more points (max 100, min 10)
    const points = isCorrect ? Math.max(10, Math.round((gameState.timeLeft / 20) * 100)) : 0;
    const prevMe = gameState.scores[myLoginId.current] || { login_id: myLoginId.current, name: myName.current, score: 0, correct: 0, answered: false, lastAnswerCorrect: null };
    const updatedScores = {
      ...gameState.scores,
      [myLoginId.current]: {
        ...prevMe,
        score: prevMe.score + points,
        correct: prevMe.correct + (isCorrect ? 1 : 0),
        answered: true,
        lastAnswerCorrect: isCorrect,
      },
    };
    const selectedAnswer = { ...gameState.selectedAnswer, [myLoginId.current]: answerIdx };
    const next = { ...gameState, scores: updatedScores, selectedAnswer };
    setGameState(next);
    broadcast(next);
  };

  const reset = () => {
    isHost.current = false;
    clearInterval(timerRef.current!);
    const next: GameState = {
      phase: 'lobby', questionIdx: 0,
      questions: shuffle(ALL_QUESTIONS).slice(0, 10),
      timeLeft: 20, scores: {}, selectedAnswer: {},
    };
    setGameState(next);
    broadcast(next);
    setMyAnswer(null);
    setSavedScore(false);
  };

  const q = gameState.questions[gameState.questionIdx];
  const sortedScores = Object.values(gameState.scores).sort((a, b) => b.score - a.score);
  const answeredCount = Object.values(gameState.selectedAnswer).length;

  // ── LOBBY ──
  if (gameState.phase === 'lobby') return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Work Readiness Live Quiz</h3>
          <p className="text-sm text-secondary-text mt-1">10 questions · 20 seconds each · fastest correct answer = most points</p>
        </div>
        <ConnectedBadge connected={connected} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {['Verbal Communication', 'Written Communication', 'Interview Skills', 'LinkedIn & Personal Brand', 'CV & Resume', 'Workplace Readiness'].map(t => (
          <div key={t} className="px-3 py-2 bg-secondary border border-border-subtle rounded-lg text-xs text-secondary-text text-center">{t}</div>
        ))}
      </div>
      <button onClick={startGame} className="w-full py-4 bg-accent text-black font-bold text-lg rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2">
        <Play className="w-5 h-5" />Start Quiz for Everyone
      </button>
      <p className="text-xs text-secondary-text text-center">Anyone on this page will see the quiz start in real time</p>
    </div>
  );

  // ── QUESTION ──
  if (gameState.phase === 'question') return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-secondary-text uppercase tracking-wider">Q{gameState.questionIdx + 1}/{gameState.questions.length}</span>
          <span className="text-xs px-2 py-0.5 bg-secondary border border-border-subtle rounded-full text-secondary-text">{q.topic}</span>
        </div>
        <div className="flex items-center gap-3">
          <ConnectedBadge connected={connected} />
          <div className={`flex items-center gap-1.5 text-2xl font-bold ${gameState.timeLeft <= 5 ? 'text-error animate-pulse' : gameState.timeLeft <= 10 ? 'text-warning' : 'text-foreground'}`}>
            <Clock className="w-5 h-5" />{gameState.timeLeft}s
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${(gameState.timeLeft / 20) * 100}%` }} />
      </div>

      <p className="text-lg font-bold text-foreground leading-snug">{q.q}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {q.options.map((opt, i) => {
          const chosen = myAnswer === i;
          return (
            <button key={i} onClick={() => submitAnswer(i)} disabled={myAnswer !== null}
              className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                chosen ? 'bg-accent/20 border-accent text-accent' :
                myAnswer !== null ? 'border-border-subtle text-secondary-text/50 cursor-not-allowed' :
                'border-border-subtle text-foreground hover:border-accent/50 hover:bg-secondary'
              }`}>
              <span className="font-bold mr-2 text-secondary-text">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>

      {myAnswer !== null && (
        <p className="text-center text-sm text-secondary-text">Answer submitted! Waiting for others... ({answeredCount} answered)</p>
      )}

      {/* Live mini-leaderboard */}
      {sortedScores.length > 0 && (
        <div className="border-t border-border-subtle pt-3">
          <p className="text-xs text-secondary-text uppercase tracking-wider mb-2">Live Scores</p>
          <div className="flex flex-wrap gap-2">
            {sortedScores.slice(0, 5).map((s, i) => (
              <div key={s.login_id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${s.login_id === myLoginId.current ? 'bg-accent/10 border-accent/40 text-accent' : 'bg-secondary border-border-subtle text-secondary-text'}`}>
                {s.answered && (s.lastAnswerCorrect ? <CheckCircle className="w-3 h-3 text-accent" /> : <XCircle className="w-3 h-3 text-error" />)}
                {s.name.split(' ')[0]} · {s.score}
              </div>
            ))}
          </div>
        </div>
      )}

      {isHost.current && (
        <button onClick={() => advanceQuestion(gameState)} className="text-xs text-secondary-text hover:text-accent transition-colors text-center">
          Skip to next question →
        </button>
      )}
    </div>
  );

  // ── REVEAL ──
  if (gameState.phase === 'reveal') return (
    <div className="p-5 flex flex-col gap-4">
      <p className="text-xs font-bold uppercase tracking-wider text-secondary-text text-center">Answer Revealed</p>
      <p className="text-lg font-bold text-foreground text-center">{q.q}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {q.options.map((opt, i) => (
          <div key={i} className={`px-4 py-3 rounded-xl border text-sm font-medium ${i === q.correct ? 'bg-accent/20 border-accent text-accent' : 'border-border-subtle text-secondary-text/50'}`}>
            {i === q.correct && <CheckCircle className="w-4 h-4 inline mr-2" />}
            <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-secondary-text animate-pulse">Next question coming up...</p>
    </div>
  );

  // ── FINISHED ──
  const myFinalScore = gameState.scores[myLoginId.current];
  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="text-center py-4">
        <Trophy className="w-12 h-12 text-accent mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-foreground mb-1">Quiz Complete!</h3>
        {myFinalScore && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-accent font-bold text-lg">{myFinalScore.score} points</span>
            <span className="text-secondary-text text-sm">({myFinalScore.correct}/{gameState.questions.length} correct)</span>
          </div>
        )}
        {savedScore && <p className="text-xs text-accent mt-1">✓ Score saved to leaderboard</p>}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-secondary-text mb-1">Final Standings</p>
        {sortedScores.map((s, i) => (
          <div key={s.login_id} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${i === 0 ? 'bg-accent/10 border-accent/40' : s.login_id === myLoginId.current ? 'bg-secondary border-accent/20' : 'bg-secondary border-border-subtle'}`}>
            <div className="flex items-center gap-3">
              <span className={`font-bold text-lg ${i === 0 ? 'text-accent' : 'text-secondary-text'}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <span className="font-semibold text-sm">{s.name}{s.login_id === myLoginId.current ? ' (you)' : ''}</span>
            </div>
            <div className="text-right">
              <span className={`font-bold ${i === 0 ? 'text-accent' : 'text-foreground'}`}>{s.score} pts</span>
              <span className="text-xs text-secondary-text ml-2">{s.correct}/{gameState.questions.length}</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={reset} className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all">
        <RotateCcw className="w-4 h-4" />Play Again
      </button>
    </div>
  );
}
