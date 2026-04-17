import re

with open('src/components/wrp/LiveQuiz.tsx', 'r') as f:
    quiz_code = f.read()

# Add RoomGate
room_gate = """function ConnectedBadge({ connected }: { connected: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${connected ? 'bg-accent/10 text-accent' : 'bg-error/10 text-error'}`}>
      {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      {connected ? 'Live' : 'Connecting...'}
    </div>
  );
}

// ── RoomGate ──────────────────────────────────────────────────────────────────
function RoomGate({ roomCode, setRoomCode, onJoin, title }: { roomCode: string, setRoomCode: (c: string) => void, onJoin: () => void, title: string }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
      <div className="bg-accent/20 p-4 rounded-full mb-2">
        <Trophy className="w-8 h-8 text-accent" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-secondary-text max-w-sm mb-4">Enter the session code provided by your facilitator to join the live quiz with your group.</p>
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
}"""
quiz_code = re.sub(r'function ConnectedBadge.*?\n}', room_gate, quiz_code, flags=re.DOTALL)

# Modify LiveQuiz component
live_quiz_old = """export default function LiveQuiz() {
  const myLoginId = useRef<string>('');
  const myName = useRef<string>('');
  const isHost = useRef(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

  const [connected, setConnected] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState<Record<string, { name: string; joinedAt: number }>>({});
  const [gameState, setGameState] = useState<GameState>({
    phase: 'lobby', questionIdx: 0,
    questions: shuffle(ALL_QUESTIONS).slice(0, 10),
    timeLeft: 20, scores: {}, selectedAnswer: {},
  });
  const [myAnswer, setMyAnswer] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState(false);"""

live_quiz_new = """export default function LiveQuiz() {
  const [roomCode, setRoomCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const myLoginId = useRef<string>('');
  const myName = useRef<string>('');
  const isHost = useRef(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

  const [connected, setConnected] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState<Record<string, { name: string; joinedAt: number }>>({});
  const [gameState, setGameState] = useState<GameState>({
    phase: 'lobby', questionIdx: 0,
    questions: shuffle(ALL_QUESTIONS).slice(0, 10),
    timeLeft: 20, scores: {}, selectedAnswer: {},
  });
  const [myAnswer, setMyAnswer] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState(false);"""
quiz_code = quiz_code.replace(live_quiz_old, live_quiz_new)

# Modify channel setup
channel_old = """useEffect(() => {
    const ch = supabase.channel('live-quiz', { config: { broadcast: { self: true }, presence: { key: myLoginId.current || 'guest' } } });"""
channel_new = """useEffect(() => {
    if (!joinedRoom) return;
    const ch = supabase.channel(`live-quiz-${joinedRoom}`, { config: { broadcast: { self: true }, presence: { key: myLoginId.current || 'guest' } } });"""
quiz_code = quiz_code.replace(channel_old, channel_new)

effect_deps_old = """    return () => {
      clearInterval(heartbeatRef.current!);
      clearTimeout(inactivityRef.current!);
      supabase.removeChannel(ch);
    };
  }, [resetInactivityTimer]);"""
effect_deps_new = """    return () => {
      clearInterval(heartbeatRef.current!);
      clearTimeout(inactivityRef.current!);
      supabase.removeChannel(ch);
    };
  }, [resetInactivityTimer, joinedRoom]);"""
quiz_code = quiz_code.replace(effect_deps_old, effect_deps_new)

# Inject RoomGate render before game states
render_intercept = """
  // ── LOBBY ──
  if (gameState.phase === 'lobby') return ("""
render_intercept_new = """
  if (!joinedRoom) return <RoomGate roomCode={roomCode} setRoomCode={setRoomCode} onJoin={() => setJoinedRoom(roomCode.trim())} title="Live Quiz" />;

  // ── LOBBY ──
  if (gameState.phase === 'lobby') return ("""
quiz_code = quiz_code.replace(render_intercept, render_intercept_new)

with open('src/components/wrp/LiveQuiz.tsx', 'w') as f:
    f.write(quiz_code)

print("LiveQuiz updated successfully")
