"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RotateCcw, Trophy, Clock, Users, Wifi, WifiOff } from 'lucide-react';

// ── Supabase realtime client (anon key is fine for broadcast) ─────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

// ── RoomGate ──────────────────────────────────────────────────────────────────
function RoomGate({ roomCode, setRoomCode, onJoin, title }: { roomCode: string, setRoomCode: (c: string) => void, onJoin: () => void, title: string }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
      <Users className="w-12 h-12 text-accent mb-2" />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-secondary-text max-w-sm mb-4">Enter the session code provided by your facilitator to join the live game with your group.</p>
      <input
        type="text"
        value={roomCode}
        onChange={e => setRoomCode(e.target.value.toUpperCase())}
        placeholder="e.g. CLASS-A"
        className="w-full max-w-xs bg-background border border-border-subtle rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-center font-bold tracking-widest uppercase mb-2"
        onKeyDown={e => e.key === 'Enter' && roomCode.trim() && onJoin()}
      />
      <button
        onClick={onJoin}
        disabled={!roomCode.trim()}
        className="px-8 py-3 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50"
      >
        Join Room
      </button>
    </div>
  );
}

// ── useRealtime: broadcast game state & track presence ────────────────────────
function useRealtime<T>(channelName: string | null, onEvent: (payload: T) => void) {
  const [connected, setConnected] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState<Record<string, { name: string; joinedAt: number }>>({});
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const myLoginId = useRef<string>('');
  const myName = useRef<string>('');

  // Store onEvent in a ref so it doesn't trigger channel reconnections
  const eventHandlerRef = useRef(onEvent);
  useEffect(() => {
    eventHandlerRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      myLoginId.current = localStorage.getItem('ioai_user') || 'guest-' + Math.random().toString(36).slice(2, 7);
      myName.current = localStorage.getItem('ioai_name') || 'Guest';
    }
  }, []);

  useEffect(() => {
    if (!channelName) return;
    const ch = supabase.channel(channelName, { config: { broadcast: { self: true }, presence: { key: myLoginId.current || 'guest' } } });
    channelRef.current = ch;

    ch.on('broadcast', { event: 'state' }, ({ payload }: any) => {
        if (eventHandlerRef.current) eventHandlerRef.current(payload as T);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = ch.presenceState<{ name: string; joinedAt: number }>();
        const players: Record<string, { name: string; joinedAt: number }> = {};
        Object.entries(state).forEach(([key, presences]) => {
          const p = (presences as any[])[0];
          if (p) players[key] = { name: p.name, joinedAt: p.joinedAt };
        });
        setOnlinePlayers(players);
      })
      .subscribe(async status => {
        setConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          await ch.track({ name: myName.current || 'Guest', joinedAt: Date.now() });
        }
      });
    return () => { supabase.removeChannel(ch); };
  }, [channelName]);

  const broadcast = useCallback((payload: T) => {
    channelRef.current?.send({ type: 'broadcast', event: 'state', payload });
  }, []);

  return { broadcast, connected, onlinePlayers };
}

function ConnectedBadge({ connected }: { connected: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${connected ? 'bg-accent/10 text-accent' : 'bg-error/10 text-error'}`}>
      {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {connected ? 'Live' : 'Connecting...'}
    </div>
  );
}

// ── GAME 1: Spot the Mistake ──────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 'attire', label: 'Interview Attire',
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
    id: 'email', label: 'Professional Email',
    image: null,
    emailContent: {
      subject: 'job',
      body: `hey\n\ni saw ur ad and i want the job. im good at computers and stuff. i work hard and i am a team player. let me know if u want to meet up or whatever\n\nthx\nthabo\nsent from my iphone`,
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
    id: 'interview', label: 'Interview Behaviour',
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

interface SpotState {
  phase: 'setup' | 'playing' | 'results';
  scenarioIdx: number;
  currentPlayerIdx: number;
  timeLeft: number;
  scores: Record<string, { name: string; found: number[] }>;
  showAnswers: boolean;
}

function SpotTheMistake() {
  const [roomCode, setRoomCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const [localFound, setLocalFound] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<SpotState>({
    phase: 'setup', scenarioIdx: 0, currentPlayerIdx: 0,
    timeLeft: 60, scores: {}, showAnswers: false,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHost = useRef(false);

  const handleState = useCallback((payload: SpotState) => {
    setGameState(payload);
    // Reset local found when player changes
    setLocalFound(new Set());
  }, []);

  const { broadcast, connected, onlinePlayers } = useRealtime<SpotState>(joinedRoom ? `spot-the-mistake-${joinedRoom}` : null, handleState);

  const students = Object.entries(onlinePlayers)
    .sort((a, b) => a[1].joinedAt - b[1].joinedAt)
    .map(([login_id, p]) => ({ login_id, full_name: p.name }));

  if (!joinedRoom) return <RoomGate roomCode={roomCode} setRoomCode={setRoomCode} onJoin={() => setJoinedRoom(roomCode.trim())} title="Spot the Mistake" />;

  const update = (patch: Partial<SpotState>) => {
    const next = { ...gameState, ...patch };
    setGameState(next);
    broadcast(next);
  };

  const scenario = SCENARIOS[gameState.scenarioIdx];
  const playerNames = students.map(s => s.full_name);
  const currentName = playerNames[gameState.currentPlayerIdx] ?? '';

  // Host-side timer
  useEffect(() => {
    if (gameState.phase !== 'playing' || !isHost.current) return;
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timerRef.current!);
          advancePlayer(prev);
          return prev;
        }
        const next = { ...prev, timeLeft: prev.timeLeft - 1 };
        broadcast(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [gameState.phase, gameState.currentPlayerIdx]);

  const advancePlayer = (prev: SpotState) => {
    if (prev.currentPlayerIdx < playerNames.length - 1) {
      const next = { ...prev, currentPlayerIdx: prev.currentPlayerIdx + 1, timeLeft: 60 };
      setGameState(next);
      broadcast(next);
      setLocalFound(new Set());
    } else {
      const next = { ...prev, phase: 'results' as const, showAnswers: true };
      setGameState(next);
      broadcast(next);
    }
  };

  const startGame = () => {
    isHost.current = true;
    const next: SpotState = {
      phase: 'playing', scenarioIdx: gameState.scenarioIdx,
      currentPlayerIdx: 0, timeLeft: 60, scores: {}, showAnswers: false,
    };
    setGameState(next);
    broadcast(next);
    setLocalFound(new Set());
  };

  const toggleMistake = (id: number) => {
    if (gameState.phase !== 'playing') return;
    const next = new Set(localFound);
    if (next.has(id)) next.delete(id); else next.add(id);
    setLocalFound(next);
    // Update scores for current player
    const scores = { ...gameState.scores, [currentName]: { name: currentName, found: Array.from(next) } };
    const updated = { ...gameState, scores };
    setGameState(updated);
    broadcast(updated);
  };

  const reset = () => {
    isHost.current = false;
    const next: SpotState = { phase: 'setup', scenarioIdx: 0, currentPlayerIdx: 0, timeLeft: 60, scores: {}, showAnswers: false };
    setGameState(next);
    broadcast(next);
    setLocalFound(new Set());
  };

  if (gameState.phase === 'setup') return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-secondary-text">
          <Users className="w-4 h-4" />
          {`${students.length} students in room`}
        </div>
        <ConnectedBadge connected={connected} />
      </div>
      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map((s, i) => (
          <button key={s.id} onClick={() => update({ scenarioIdx: i })}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${gameState.scenarioIdx === i ? 'bg-accent text-black' : 'border border-border-subtle text-secondary-text hover:text-foreground'}`}>
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-secondary-text">{scenario.description}</p>
      {students.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {students.map(s => (
            <div key={s.login_id} className="px-3 py-1.5 bg-secondary border border-border-subtle rounded-lg text-sm">{s.full_name}</div>
          ))}
        </div>
      )}
      {students.length >= 1 && (
        <button onClick={startGame} className="w-full py-3 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-all">
          Start Game — {scenario.label}
        </button>
      )}
      {students.length === 0 && (
        <p className="text-sm text-error text-center py-2">Waiting for students to join...</p>
      )}
    </div>
  );

  if (gameState.phase === 'playing') return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs text-secondary-text uppercase tracking-wider">Now playing</p>
          <p className="text-xl font-bold text-accent">{currentName}</p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectedBadge connected={connected} />
          <div className={`flex items-center gap-2 text-2xl font-bold ${gameState.timeLeft <= 10 ? 'text-error' : 'text-foreground'}`}>
            <Clock className="w-5 h-5" />{gameState.timeLeft}s
          </div>
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
          const found = localFound.has(m.id);
          return (
            <button key={m.id} onClick={() => toggleMistake(m.id)}
              className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${found ? 'bg-accent/20 border-accent text-accent font-semibold' : 'border-border-subtle text-secondary-text hover:border-accent/50'}`}>
              {found ? '✓ ' : '○ '}{m.text}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
        <p className="text-sm text-secondary-text">Found: <span className="text-accent font-bold">{localFound.size}</span> / {scenario.mistakes.length}</p>
        {isHost.current && (
          <button onClick={() => advancePlayer(gameState)} className="px-5 py-2 bg-accent text-black font-bold text-sm rounded-lg hover:bg-accent/90 transition-all">
            {gameState.currentPlayerIdx < playerNames.length - 1 ? `Next: ${playerNames[gameState.currentPlayerIdx + 1]}` : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );

  // Results
  const sortedScores = Object.values(gameState.scores).sort((a, b) => b.found.length - a.found.length);
  const winner = sortedScores[0];
  return (
    <div className="relative p-5 flex flex-col gap-4 overflow-hidden">
      <Confetti active={!!winner} />
      <div className="flex items-center justify-between">
        <ConnectedBadge connected={connected} />
      </div>
      {winner && (
        <div className="text-center py-4">
          <Trophy className="w-12 h-12 text-accent mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-accent mb-1">{winner.name} wins!</h3>
          <p className="text-secondary-text">Found {winner.found.length} out of {scenario.mistakes.length} mistakes</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {sortedScores.map((p, i) => (
          <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${i === 0 ? 'bg-accent/10 border-accent/40' : 'bg-secondary border-border-subtle'}`}>
            <div className="flex items-center gap-3">
              <span className={`text-lg font-bold ${i === 0 ? 'text-accent' : 'text-secondary-text'}`}>#{i + 1}</span>
              <span className="font-semibold">{p.name}</span>
            </div>
            <span className={`font-bold text-lg ${i === 0 ? 'text-accent' : 'text-foreground'}`}>{p.found.length} pts</span>
          </div>
        ))}
      </div>
      {gameState.showAnswers && (
        <div className="mt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">All {scenario.mistakes.length} mistakes:</p>
          <div className="flex flex-col gap-1">
            {scenario.mistakes.map(m => <p key={m.id} className="text-sm text-foreground flex gap-2"><span className="text-accent shrink-0">✓</span>{m.text}</p>)}
          </div>
        </div>
      )}
      {isHost.current && (
        <button onClick={reset} className="flex items-center justify-center gap-2 w-full py-2.5 border border-border-subtle rounded-lg text-sm text-secondary-text hover:text-accent hover:border-accent transition-all">
          <RotateCcw className="w-4 h-4" />Play Again
        </button>
      )}
    </div>
  );
}

// ── GAME 2: Spin the Wheel ────────────────────────────────────────────────────
const WHEEL_COLORS = ['#00ff9d', '#00b0f0', '#ffb86b', '#ff5f5f', '#a78bfa', '#34d399', '#f472b6', '#60a5fa'];

interface WheelState {
  phase: 'setup' | 'spinning' | 'pitched';
  winner: string | null;
  timeLeft: number;
  timerActive: boolean;
}

function SpinTheWheel() {
  const [roomCode, setRoomCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wheelState, setWheelState] = useState<WheelState>({ phase: 'setup', winner: null, timeLeft: 60, timerActive: false });
  const angleRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHost = useRef(false);

  const handleState = useCallback((payload: WheelState & { angle?: number }) => {
    if (payload.angle !== undefined) angleRef.current = payload.angle;
    setWheelState({ phase: payload.phase, winner: payload.winner, timeLeft: payload.timeLeft, timerActive: payload.timerActive });
    if (payload.winner && payload.phase === 'pitched') setShowConfetti(true);
  }, []);

  const { broadcast, connected, onlinePlayers } = useRealtime<WheelState & { angle?: number }>(joinedRoom ? `spin-the-wheel-${joinedRoom}` : null, handleState);

  const students = Object.entries(onlinePlayers)
    .sort((a, b) => a[1].joinedAt - b[1].joinedAt)
    .map(([login_id, p]) => ({ login_id, full_name: p.name }));
  const names = students.map(s => s.full_name);

  if (!joinedRoom) return <RoomGate roomCode={roomCode} setRoomCode={setRoomCode} onJoin={() => setJoinedRoom(roomCode.trim())} title="Spin the Wheel" />;

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
    ctx.beginPath(); ctx.moveTo(cx + r + 8, cy);
    ctx.lineTo(cx + r - 8, cy - 10); ctx.lineTo(cx + r - 8, cy + 10);
    ctx.fillStyle = '#fff'; ctx.fill();
  }, [names]);

  useEffect(() => { drawWheel(angleRef.current); }, [names, drawWheel]);

  // Sync wheel drawing when angle updates from broadcast
  useEffect(() => {
    drawWheel(angleRef.current);
  }, [wheelState, drawWheel]);

  const spin = () => {
    if (wheelState.phase === 'spinning' || names.length < 2) return;
    isHost.current = true;
    setShowConfetti(false);
    const totalRot = (Math.random() * 8 + 6) * Math.PI * 2;
    const duration = 4000;
    const start = performance.now();
    const startAngle = angleRef.current;
    setWheelState(s => ({ ...s, phase: 'spinning', winner: null, timerActive: false }));

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = startAngle + totalRot * ease;
      angleRef.current = current;
      drawWheel(current);
      // Broadcast angle updates every ~100ms
      if (Math.floor(elapsed / 100) !== Math.floor((elapsed - 16) / 100)) {
        broadcast({ phase: 'spinning', winner: null, timeLeft: 60, timerActive: false, angle: current });
      }
      if (progress < 1) { requestAnimationFrame(animate); return; }
      const slice = (2 * Math.PI) / names.length;
      const normalised = ((current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const idx = Math.floor(((2 * Math.PI - normalised) / slice) % names.length);
      const winner = names[idx];
      const next: WheelState = { phase: 'pitched', winner, timeLeft: 60, timerActive: true };
      setWheelState(next);
      setShowConfetti(true);
      broadcast({ ...next, angle: current });
    };
    requestAnimationFrame(animate);
  };

  // Countdown timer (host drives it)
  useEffect(() => {
    if (!wheelState.timerActive || !isHost.current) return;
    timerRef.current = setInterval(() => {
      setWheelState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timerRef.current!);
          const next = { ...prev, timerActive: false, timeLeft: 0 };
          broadcast({ ...next, angle: angleRef.current });
          return next;
        }
        const next = { ...prev, timeLeft: prev.timeLeft - 1 };
        broadcast({ ...next, angle: angleRef.current });
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [wheelState.timerActive]);

  const reset = () => {
    isHost.current = false;
    clearInterval(timerRef.current!);
    const next: WheelState = { phase: 'setup', winner: null, timeLeft: 60, timerActive: false };
    setWheelState(next);
    setShowConfetti(false);
    broadcast({ ...next, angle: 0 });
    angleRef.current = 0;
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm text-secondary-text">
          <Users className="w-4 h-4" />
          {`${names.length} students in room`}
        </div>
        <ConnectedBadge connected={connected} />
      </div>

      {names.length >= 2 ? (
        <div className="relative flex flex-col items-center gap-4">
          <Confetti active={showConfetti} />
          <canvas ref={canvasRef} width={300} height={300} className="rounded-full border-4 border-border-subtle" />
          {isHost.current || wheelState.phase === 'setup' ? (
            <button onClick={spin} disabled={wheelState.phase === 'spinning'}
              className="px-8 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 text-lg">
              {wheelState.phase === 'spinning' ? 'Spinning...' : 'Spin the Wheel'}
            </button>
          ) : (
            <p className="text-sm text-secondary-text">Waiting for host to spin...</p>
          )}
          {wheelState.winner && (
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{wheelState.winner}</p>
              <p className="text-secondary-text text-sm">Deliver your elevator pitch!</p>
              {wheelState.timerActive && (
                <div className={`mt-3 text-4xl font-bold ${wheelState.timeLeft <= 10 ? 'text-error' : 'text-foreground'}`}>
                  {wheelState.timeLeft}s
                </div>
              )}
              {!wheelState.timerActive && wheelState.timeLeft === 0 && (
                <p className="text-accent font-bold mt-2">Time's up!</p>
              )}
            </div>
          )}
          {isHost.current && wheelState.phase !== 'setup' && (
            <button onClick={reset} className="flex items-center justify-center gap-2 px-4 py-2 border border-border-subtle rounded-lg text-sm text-secondary-text hover:text-accent hover:border-accent transition-all">
              <RotateCcw className="w-4 h-4" />Reset
            </button>
          )}
        </div>
      ) : (
        <p className="text-secondary-text text-sm text-center py-4">
          {loading ? 'Loading students...' : 'Waiting for students to join...'}
        </p>
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

interface BingoState {
  grid: string[];
  marked: number[];
  bingo: boolean;
  playerName: string;
}

// Each player gets their own shuffled card; bingo is per-player
// Host broadcasts a "new card" event to reshuffle everyone
interface BingoHostEvent { type: 'new-card' | 'call-word'; word?: string }

function BuzzwordBingo() {
  const [roomCode, setRoomCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const [myName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ioai_name') || 'You';
    }
    return 'You';
  });

  const makeGrid = () => [...BUZZWORDS].sort(() => Math.random() - 0.5).slice(0, 25);
  const [grid, setGrid] = useState<string[]>(makeGrid);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [bingo, setBingo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [calledWord, setCalledWord] = useState<string | null>(null);
  // Leaderboard: who called BINGO
  const [bingoWinners, setBingoWinners] = useState<string[]>([]);

  const handleState = useCallback((payload: BingoHostEvent) => {
    if (payload.type === 'new-card') {
      setGrid(makeGrid());
      setMarked(new Set());
      setBingo(false);
      setShowConfetti(false);
      setCalledWord(null);
      setBingoWinners([]);
    }
    if (payload.type === 'call-word' && payload.word) {
      setCalledWord(payload.word);
    }
  }, []);

  const handleBingo = useCallback((payload: { winner: string }) => {
    setBingoWinners(prev => prev.includes(payload.winner) ? prev : [...prev, payload.winner]);
  }, []);

  const { broadcast, connected, onlinePlayers } = useRealtime<BingoHostEvent>(joinedRoom ? `buzzword-bingo-${joinedRoom}` : null, handleState);
  const { broadcast: broadcastBingo } = useRealtime<{ winner: string }>(joinedRoom ? `buzzword-bingo-winners-${joinedRoom}` : null, handleBingo);

  const students = Object.entries(onlinePlayers)
    .sort((a, b) => a[1].joinedAt - b[1].joinedAt)
    .map(([login_id, p]) => ({ login_id, full_name: p.name }));

  if (!joinedRoom) return <RoomGate roomCode={roomCode} setRoomCode={setRoomCode} onJoin={() => setJoinedRoom(roomCode.trim())} title="Buzzword Bingo" />;

  const toggle = (i: number) => {
    const next = new Set(marked);
    if (next.has(i)) next.delete(i); else next.add(i);
    setMarked(next);
    const rows = Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => r * 5 + c).every(idx => next.has(idx)));
    const cols = Array.from({ length: 5 }, (_, c) => Array.from({ length: 5 }, (_, r) => r * 5 + c).every(idx => next.has(idx)));
    const diag1 = [0, 6, 12, 18, 24].every(idx => next.has(idx));
    const diag2 = [4, 8, 12, 16, 20].every(idx => next.has(idx));
    if (!bingo && [...rows, ...cols, diag1, diag2].some(Boolean)) {
      setBingo(true);
      setShowConfetti(true);
      broadcastBingo({ winner: myName });
    }
  };

  const newCard = () => {
    broadcast({ type: 'new-card' });
  };

  return (
    <div className="p-5 flex flex-col gap-4 relative overflow-hidden">
      <Confetti active={showConfetti} />
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-secondary-text">Mark off each buzzword as you hear it. Complete a row, column, or diagonal to win.</p>
        <ConnectedBadge connected={connected} />
      </div>

      {calledWord && (
        <div className="text-center py-2 bg-accent/10 border border-accent/30 rounded-xl animate-pulse">
          <p className="text-sm text-secondary-text">Called word:</p>
          <p className="text-xl font-bold text-accent">{calledWord}</p>
        </div>
      )}

      {bingo && (
        <div className="text-center py-3 bg-accent/10 border border-accent/30 rounded-xl">
          <p className="text-2xl font-bold text-accent">BINGO!</p>
          <p className="text-secondary-text text-sm">You completed a line!</p>
        </div>
      )}

      {bingoWinners.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-text">BINGO Winners:</p>
          {bingoWinners.map((w, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Trophy className="w-3.5 h-3.5 text-accent" />
              <span className="font-semibold text-accent">{w}</span>
            </div>
          ))}
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

      <div className="flex gap-2">
        <button onClick={newCard} className="flex items-center justify-center gap-2 flex-1 py-2 border border-border-subtle rounded-lg text-sm text-secondary-text hover:text-accent hover:border-accent transition-all">
          <RotateCcw className="w-4 h-4" />New Card (all players)
        </button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1 border-t border-border-subtle">
        <p className="text-xs text-secondary-text w-full">Players online:</p>
        {students.map(s => (
          <div key={s.login_id} className="px-2 py-1 bg-secondary border border-border-subtle rounded text-xs text-secondary-text">{s.full_name}</div>
        ))}
      </div>
    </div>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────
export function SpotTheMistakeGame() {
  return (
    <div className="my-6 border border-border-subtle rounded-xl overflow-hidden bg-[#0d0d0d]">
      <div className="px-4 py-3 bg-secondary border-b border-border-subtle flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-sm font-bold">Spot the Mistake</span>
      </div>
      <SpotTheMistake />
    </div>
  );
}

export function SpinTheWheelGame() {
  return (
    <div className="my-6 border border-border-subtle rounded-xl overflow-hidden bg-[#0d0d0d]">
      <div className="px-4 py-3 bg-secondary border-b border-border-subtle flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-sm font-bold">Spin the Wheel — Elevator Pitch</span>
      </div>
      <SpinTheWheel />
    </div>
  );
}

export function BuzzwordBingoGame() {
  return (
    <div className="my-6 border border-border-subtle rounded-xl overflow-hidden bg-[#0d0d0d]">
      <div className="px-4 py-3 bg-secondary border-b border-border-subtle flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-sm font-bold">Buzzword Bingo</span>
      </div>
      <BuzzwordBingo />
    </div>
  );
}
