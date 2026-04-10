import re

with open('src/components/wrp/WrpGames.tsx', 'r') as f:
    games_code = f.read()

# 1. Replace useWrpStudents and useRealtime
replacement_hooks = """// ── RoomGate ──────────────────────────────────────────────────────────────────
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
}"""

games_code = re.sub(r'// ── useWrpStudents: fetch all registered WRP students ─────────────────────────.*?return { broadcast, connected };\n}', replacement_hooks, games_code, flags=re.DOTALL)

# 2. SpotTheMistake
spot_old = """function SpotTheMistake() {
  const { students, loading } = useWrpStudents();
  const [localFound, setLocalFound] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<SpotState>({
    phase: 'setup', scenarioIdx: 0, currentPlayerIdx: 0,
    timeLeft: 60, scores: {}, showAnswers: false,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHost = useRef(false);

  const { broadcast, connected } = useRealtime<SpotState>('spot-the-mistake', (payload) => {
    setGameState(payload);
    // Reset local found when player changes
    setLocalFound(new Set());
  });"""

spot_new = """function SpotTheMistake() {
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

  if (!joinedRoom) return <RoomGate roomCode={roomCode} setRoomCode={setRoomCode} onJoin={() => setJoinedRoom(roomCode.trim())} title="Spot the Mistake" />;"""
games_code = games_code.replace(spot_old, spot_new)
games_code = games_code.replace("{loading ? 'Loading students...' : `${students.length} students registered`}", "{`${students.length} students in room`}")
games_code = games_code.replace("{students.length === 0 && !loading && (", "{students.length === 0 && (")
games_code = games_code.replace("No students registered yet. Add students via the Admin dashboard.", "Waiting for students to join...")


# 3. SpinTheWheel
wheel_old = """function SpinTheWheel() {
  const { students, loading } = useWrpStudents();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wheelState, setWheelState] = useState<WheelState>({ phase: 'setup', winner: null, timeLeft: 60, timerActive: false });
  const angleRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHost = useRef(false);

  const names = students.map(s => s.full_name);

  const { broadcast, connected } = useRealtime<WheelState & { angle?: number }>('spin-the-wheel', (payload) => {
    if (payload.angle !== undefined) angleRef.current = payload.angle;
    setWheelState({ phase: payload.phase, winner: payload.winner, timeLeft: payload.timeLeft, timerActive: payload.timerActive });
    if (payload.winner && payload.phase === 'pitched') setShowConfetti(true);
  });"""

wheel_new = """function SpinTheWheel() {
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

  if (!joinedRoom) return <RoomGate roomCode={roomCode} setRoomCode={setRoomCode} onJoin={() => setJoinedRoom(roomCode.trim())} title="Spin the Wheel" />;"""
games_code = games_code.replace(wheel_old, wheel_new)
games_code = games_code.replace("{loading ? 'Loading students...' : `${names.length} students on the wheel`}", "{`${names.length} students in room`}")
games_code = games_code.replace("{loading ? 'Loading students...' : 'No students registered yet. Add students via the Admin dashboard.'}", "'Waiting for students to join...'")


# 4. BuzzwordBingo
bingo_old = """function BuzzwordBingo() {
  const { students } = useWrpStudents();
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

  const { broadcast, connected } = useRealtime<BingoHostEvent>('buzzword-bingo', (payload) => {
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
  });

  // Separate channel for bingo announcements
  const { broadcast: broadcastBingo } = useRealtime<{ winner: string }>('buzzword-bingo-winners', (payload) => {
    setBingoWinners(prev => prev.includes(payload.winner) ? prev : [...prev, payload.winner]);
  });"""

bingo_new = """function BuzzwordBingo() {
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

  if (!joinedRoom) return <RoomGate roomCode={roomCode} setRoomCode={setRoomCode} onJoin={() => setJoinedRoom(roomCode.trim())} title="Buzzword Bingo" />;"""

games_code = games_code.replace(bingo_old, bingo_new)

with open('src/components/wrp/WrpGames.tsx', 'w') as f:
    f.write(games_code)

print("WrpGames updated successfully")
