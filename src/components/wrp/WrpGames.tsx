"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Trash2, RotateCcw, Trophy, Clock } from 'lucide-react';

// ── Confetti ──────────────────────────────────────────────────────────────────

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: ['#00ff9d', '#00b0f0', '#ffb86b', '#ff5f5f', '#ffffff'][Math.floor(Math.random() * 5)],
      rot: Math.random() * 360,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      vr: (Math.random() - 0.5) * 6,
    }));
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      });
      if (pieces.some(p => p.y < canvas.height)) frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
}

// ── GAME 1: Spot the Mistake ──────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: 'attire',
    label: 'Interview Attire',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80',
    description: 'This candidate is about to walk into a job interview. How many professional mistakes can you spot?',
    mistakes: [
      { id: 1, text: 'Wearing a cap / hat indoors' },
      { id: 2, text: 'Untucked shirt' },
      { id: 3, text: 'Wearing earphones around neck' },
      { id: 4, text: 'Visible tattoos on hands (context-dependent)' },
      { id: 5, text: 'Casual sneakers instead of formal shoes' },
      { id: 6, text: 'Jeans instead of formal trousers' },
      { id: 7, text: 'No eye contact with interviewer' },
      { id: 8, text: 'Phone visible on the table' },
    ],
  },
  {
    id: 'email',
    label: 'Professional Email',
    image: null,
    emailContent: {
      subject: 'job',
      body: `hey

i saw ur ad and i want the job. im good at computers and stuff. i work hard and i am a team player. let me know if u want to meet up or whatever

thx
thabo
sent from my iphone`,
    },
    description: 'This email was sent to a hiring manager. Find every professional mistake before the timer runs out.',
    mistakes: [
      { id: 1, text: 'Subject line is vague — just "job"' },
      { id: 2, text: '"hey" — far too casual, should be "Dear [Name]"' },
      { id: 3, text: '"ur" — text speak, never in professional emails' },
      { id: 4, text: '"stuff" — vague, unprofessional language' },
      { id: 5, text: '"i work hard and i am a team player" — clichés with no evidence' },
      { id: 6, text: '"let me know if u want to meet up or whatever" — casual and dismissive' },
      { id: 7, text: '"thx" — abbreviation, not a proper sign-off' },
      { id: 8, text: 'No full name in signature' },
      { id: 9, text: 'No phone number or contact details' },
      { id: 10, text: '"sent from my iphone" — should be removed in professional emails' },
      { id: 11, text: 'No specific role mentioned' },
      { id: 12, text: 'No value proposition — why should they hire you?' },
    ],
  },
  {
    id: 'interview',
    label: 'Interview Behaviour',
    image: null,
    storyContent: `James arrives 5 minutes late to his interview. He walks in chewing gum, phone in hand, and sits down before being invited to. When asked "Tell me about yourself," he says: "Um, I don't know, I'm just a hard worker I guess. I'm good with people." He checks his phone twice during the interview. When asked why he wants the job, he says "I just need money right now." At the end, the interviewer asks if he has any questions. James says "Nope, I'm good."`,
    description: 'Read this interview scenario carefully. Find every mistake James made.',
    mistakes: [
      { id: 1, text: 'Arrived 5 minutes late' },
      { id: 2, text: 'Chewing gum during the interview' },
      { id: 3, text: 'Phone in hand when entering' },
      { id: 4, text: 'Sat down before being invited to' },
      { id: 5, text: '"Um, I don\'t know" — no preparation for the most common question' },
      { id: 6, text: '"I\'m just a hard worker" — vague cliché with no evidence' },
      { id: 7, text: 'Checked phone twice during the interview' },
      { id: 8, text: '"I just need money right now" — never say this in an interview' },
      { id: 9, text: '"Nope, I\'m good" — always have questions prepared for the interviewer' },
      { id: 10, text: 'No STAR method used for any answer' },
    ],
  },
];

interface Player { name: string; score: number; found: Set<number>; }

function SpotTheMistake() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');
  const [phase, setPhase] = useState<'setup' | 'playing' | 'results'>('setup');
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scenario = SCENARIOS[scenarioIdx];

  const addPlayer = () => {
    if (!newName.trim()) return;
    setPlayers(p => [...p, { name: newName.trim(), score: 0, found: new Set() }]);
    setNewName('');
  };

  const startGame = () => {
    setPhase('playing');
    setCurrentPlayer(0);
    setTimeLeft(60);
    setShowAnswers(false);
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          nextPlayer();
          return 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, currentPlayer]);

  const toggleMistake = (mistakeId: number) => {
    setPlayers(prev => prev.map((p, i) => {
      if (i !== currentPlayer) return p;
      const found = new Set(p.found);
      if (found.has(mistakeId)) found.delete(mistakeId); else found.add(mistakeId);
      return { ...p, found, score: found.size };
    }));
  };

  const nextPlayer = () => {
    clearInterval(timerRef.current!);
    if (currentPlayer < players.length - 1) {
      setCurrentPlayer(c => c + 1);
      setTimeLeft(60);
    } else {
      const w = [...players].sort((a, b) => b.score - a.score)[0];
      setWinner(w);
      setPhase('results');
      setShowAnswers(true);
    }
  };

  const reset = () => {
    setPhase('setup');
    setPlayers([]);
    setCurrentPlayer(0);
    setTimeLeft(60);
    setWinner(null);
    setShowAnswers(false);
  };

  if (phase === 'setup') return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map((s, i) => (
          <button key={s.id} onClick={() => setScenarioIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${scenarioIdx === i ? 'bg-accent text-black' : 'border border-border-subtle text-secondary-text hover:text-foreground'}`}>
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-secondary-text">{scenario.description}</p>
      <div className="flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPlayer()}
          placeholder="Add player name..." className="flex-1 bg-[#0d0d0d] border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-all" />
        <button onClick={addPlayer} className="px-4 py-2 bg-accent text-black font-bold text-sm rounded-lg hover:bg-accent/90 transition-all"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex flex-wrap gap-2">
        {players.map((p, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-secondary border border-border-subtle rounded-lg text-sm">
            <span>{p.name}</span>
            <button onClick={() => setPlayers(prev => prev.filter((_, idx) => idx !== i))} className="text-error hover:text-error/80"><Trash2 className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
      {players.length >= 1 && (
        <button onClick={startGame} className="w-full py-3 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-all">
          Start Game — {scenario.label}
        </button>
      )}
    </div>
  );

  if (phase === 'playing') {
    const cp = players[currentPlayer];
    return (
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-secondary-text uppercase tracking-wider">Now playing</p>
            <p className="text-xl font-bold text-accent">{cp.name}</p>
          </div>
          <div className={`flex items-center gap-2 text-2xl font-bold ${timeLeft <= 10 ? 'text-error' : 'text-foreground'}`}>
            <Clock className="w-5 h-5" />{timeLeft}s
          </div>
        </div>

        {scenario.image && <img src={scenario.image} alt="scenario" className="w-full rounded-xl max-h-48 object-cover border border-border-subtle" />}
        {(scenario as any).emailContent && (
          <div className="bg-white text-black rounded-xl p-4 text-sm font-mono border border-border-subtle">
            <p className="font-bold mb-1">Subject: {(scenario as any).emailContent.subject}</p>
            <hr className="border-gray-200 mb-2" />
            <p className="whitespace-pre-line">{(scenario as any).emailContent.body}</p>
          </div>
        )}
        {(scenario as any).storyContent && (
          <div className="bg-secondary border border-border-subtle rounded-xl p-4 text-sm text-foreground leading-relaxed">
            {(scenario as any).storyContent}
          </div>
        )}

        <p className="text-sm font-semibold text-foreground">Tap every mistake you can find:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {scenario.mistakes.map(m => {
            const found = cp.found.has(m.id);
            return (
              <button key={m.id} onClick={() => toggleMistake(m.id)}
                className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${found ? 'bg-accent/20 border-accent text-accent font-semibold' : 'border-border-subtle text-secondary-text hover:border-accent/50'}`}>
                {found ? '✓ ' : '○ '}{m.text}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <p className="text-sm text-secondary-text">Found: <span className="text-accent font-bold">{cp.found.size}</span> / {scenario.mistakes.length}</p>
          <button onClick={nextPlayer} className="px-5 py-2 bg-accent text-black font-bold text-sm rounded-lg hover:bg-accent/90 transition-all">
            {currentPlayer < players.length - 1 ? `Next: ${players[currentPlayer + 1].name}` : 'See Results'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-5 flex flex-col gap-4 overflow-hidden">
      <Confetti active={!!winner} />
      {winner && (
        <div className="text-center py-4">
          <Trophy className="w-12 h-12 text-accent mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-accent mb-1">{winner.name} wins!</h3>
          <p className="text-secondary-text">Found {winner.score} out of {scenario.mistakes.length} mistakes</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
          <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${i === 0 ? 'bg-accent/10 border-accent/40' : 'bg-secondary border-border-subtle'}`}>
            <div className="flex items-center gap-3">
              <span className={`text-lg font-bold ${i === 0 ? 'text-accent' : 'text-secondary-text'}`}>#{i + 1}</span>
              <span className="font-semibold">{p.name}</span>
            </div>
            <span className={`font-bold text-lg ${i === 0 ? 'text-accent' : 'text-foreground'}`}>{p.score} pts</span>
          </div>
        ))}
      </div>
      {showAnswers && (
        <div className="mt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">All {scenario.mistakes.length} mistakes:</p>
          <div className="flex flex-col gap-1">
            {scenario.mistakes.map(m => <p key={m.id} className="text-sm text-foreground flex gap-2"><span className="text-accent shrink-0">✓</span>{m.text}</p>)}
          </div>
        </div>
      )}
      <button onClick={reset} className="flex items-center justify-center gap-2 w-full py-2.5 border border-border-subtle rounded-lg text-sm text-secondary-text hover:text-accent hover:border-accent transition-all">
        <RotateCcw className="w-4 h-4" />Play Again
      </button>
    </div>
  );
}

// ── GAME 2: Spin the Wheel ────────────────────────────────────────────────────

const WHEEL_COLORS = ['#00ff9d', '#00b0f0', '#ffb86b', '#ff5f5f', '#a78bfa', '#34d399', '#f472b6', '#60a5fa'];

function SpinTheWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [names, setNames] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const angleRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas || names.length === 0) return;
    const ctx = canvas.getContext('2d')!;
    const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 10;
    const slice = (2 * Math.PI) / names.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    names.forEach((name, i) => {
      const start = angle + i * slice, end = start + slice;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + slice / 2);
      ctx.textAlign = 'right'; ctx.fillStyle = '#000';
      ctx.font = `bold ${Math.min(14, 120 / names.length)}px Arial`;
      ctx.fillText(name.length > 12 ? name.slice(0, 12) + '…' : name, r - 12, 5);
      ctx.restore();
    });
    // Pointer
    ctx.beginPath(); ctx.moveTo(cx + r + 8, cy);
    ctx.lineTo(cx + r - 8, cy - 10); ctx.lineTo(cx + r - 8, cy + 10);
    ctx.fillStyle = '#fff'; ctx.fill();
  }, [names]);

  useEffect(() => { drawWheel(angleRef.current); }, [names, drawWheel]);

  const spin = () => {
    if (spinning || names.length < 2) return;
    setSpinning(true); setWinner(null); setShowConfetti(false); setTimer(null);
    const totalRot = (Math.random() * 8 + 6) * Math.PI * 2;
    const duration = 4000;
    const start = performance.now();
    const startAngle = angleRef.current;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = startAngle + totalRot * ease;
      angleRef.current = current;
      drawWheel(current);
      if (progress < 1) { requestAnimationFrame(animate); return; }
      const slice = (2 * Math.PI) / names.length;
      const normalised = ((current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const idx = Math.floor(((2 * Math.PI - normalised) / slice) % names.length);
      setWinner(names[idx]);
      setShowConfetti(true);
      setSpinning(false);
      setTimer(60);
    };
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (timer === null) return;
    if (timer <= 0) { setTimer(null); return; }
    timerRef.current = setTimeout(() => setTimer(t => (t ?? 1) - 1), 1000);
    return () => clearTimeout(timerRef.current!);
  }, [timer]);

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newName.trim()) { setNames(n => [...n, newName.trim()]); setNewName(''); } }}
          placeholder="Add participant name..." className="flex-1 bg-[#0d0d0d] border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-all" />
        <button onClick={() => { if (newName.trim()) { setNames(n => [...n, newName.trim()]); setNewName(''); } }}
          className="px-4 py-2 bg-accent text-black font-bold text-sm rounded-lg hover:bg-accent/90 transition-all"><Plus className="w-4 h-4" /></button>
      </div>

      <div className="flex flex-wrap gap-2">
        {names.map((n, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-secondary border border-border-subtle rounded-lg text-sm">
            <span>{n}</span>
            <button onClick={() => setNames(prev => prev.filter((_, idx) => idx !== i))} className="text-error hover:text-error/80"><Trash2 className="w-3 h-3" /></button>
          </div>
        ))}
      </div>

      {names.length >= 2 ? (
        <div className="relative flex flex-col items-center gap-4">
          <Confetti active={showConfetti} />
          <canvas ref={canvasRef} width={300} height={300} className="rounded-full border-4 border-border-subtle" />
          <button onClick={spin} disabled={spinning}
            className="px-8 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 text-lg">
            {spinning ? 'Spinning...' : 'Spin the Wheel'}
          </button>
          {winner && (
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{winner}</p>
              <p className="text-secondary-text text-sm">Deliver your elevator pitch!</p>
              {timer !== null && (
                <div className={`mt-3 text-4xl font-bold ${timer <= 10 ? 'text-error' : 'text-foreground'}`}>
                  {timer}s
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-secondary-text text-sm text-center py-4">Add at least 2 names to spin the wheel.</p>
      )}
    </div>
  );
}

// ── GAME 3: Buzzword Bingo ────────────────────────────────────────────────────

const BUZZWORDS = [
  'Synergy', 'Leverage', 'Bandwidth', 'Circle back', 'Deep dive',
  'Move the needle', 'Low-hanging fruit', 'Pivot', 'Scalable', 'Disruptive',
  'Value-add', 'Stakeholder', 'Deliverable', 'Agile', 'Proactive',
  'Thought leader', 'Paradigm shift', 'Core competency', 'Best practice', 'Holistic',
  'Streamline', 'Robust', 'Actionable', 'Ecosystem', 'Empower',
];

function BuzzwordBingo() {
  const [grid] = useState<string[]>(() => {
    const shuffled = [...BUZZWORDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 25);
  });
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [bingo, setBingo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const toggle = (i: number) => {
    const next = new Set(marked);
    if (next.has(i)) next.delete(i); else next.add(i);
    setMarked(next);
    // Check rows, cols, diagonals
    const rows = Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => r * 5 + c).every(idx => next.has(idx)));
    const cols = Array.from({ length: 5 }, (_, c) => Array.from({ length: 5 }, (_, r) => r * 5 + c).every(idx => next.has(idx)));
    const diag1 = [0, 6, 12, 18, 24].every(idx => next.has(idx));
    const diag2 = [4, 8, 12, 16, 20].every(idx => next.has(idx));
    if ([...rows, ...cols, diag1, diag2].some(Boolean)) { setBingo(true); setShowConfetti(true); }
  };

  const reset = () => { setMarked(new Set()); setBingo(false); setShowConfetti(false); };

  return (
    <div className="p-5 flex flex-col gap-4 relative overflow-hidden">
      <Confetti active={showConfetti} />
      <p className="text-sm text-secondary-text">Mark off each buzzword as you hear it during discussions or mock interviews. Complete a row, column, or diagonal to win.</p>
      {bingo && (
        <div className="text-center py-3 bg-accent/10 border border-accent/30 rounded-xl">
          <p className="text-2xl font-bold text-accent">BINGO!</p>
          <p className="text-secondary-text text-sm">You completed a line!</p>
        </div>
      )}
      <div className="grid grid-cols-5 gap-1.5">
        {grid.map((word, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`aspect-square flex items-center justify-center text-center text-[10px] sm:text-xs font-semibold rounded-lg border transition-all leading-tight p-1 ${
              marked.has(i) ? 'bg-accent text-black border-accent' : 'bg-secondary border-border-subtle text-secondary-text hover:border-accent/50 hover:text-foreground'
            }`}>
            {word}
          </button>
        ))}
      </div>
      <button onClick={reset} className="flex items-center justify-center gap-2 w-full py-2 border border-border-subtle rounded-lg text-sm text-secondary-text hover:text-accent hover:border-accent transition-all">
        <RotateCcw className="w-4 h-4" />New Card
      </button>
    </div>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function SpotTheMistakeGame() { return <div className="my-6 border border-border-subtle rounded-xl overflow-hidden bg-[#0d0d0d]"><div className="px-4 py-3 bg-secondary border-b border-border-subtle flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /><span className="text-sm font-bold">Spot the Mistake</span></div><SpotTheMistake /></div>; }
export function SpinTheWheelGame() { return <div className="my-6 border border-border-subtle rounded-xl overflow-hidden bg-[#0d0d0d]"><div className="px-4 py-3 bg-secondary border-b border-border-subtle flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /><span className="text-sm font-bold">Spin the Wheel — Elevator Pitch</span></div><SpinTheWheel /></div>; }
export function BuzzwordBingoGame() { return <div className="my-6 border border-border-subtle rounded-xl overflow-hidden bg-[#0d0d0d]"><div className="px-4 py-3 bg-secondary border-b border-border-subtle flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /><span className="text-sm font-bold">Buzzword Bingo</span></div><BuzzwordBingo /></div>; }
