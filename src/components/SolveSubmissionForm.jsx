import { useState, useMemo } from 'react';
import axios from 'axios';
import {
  Send, Zap, Star, Loader2, CheckCircle2, XCircle,
  Code2, PlayCircle, Monitor, RefreshCw,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SUBMISSION_TYPES = [
  { value: 'Automated_Sync', label: 'Auto Sync', icon: Monitor },
  { value: 'Theory_Video', label: 'Theory Video', icon: PlayCircle },
  { value: 'Manual_Problem', label: 'Coding Problem', icon: Code2 },
];

const CODING_PLATFORMS = ['LeetCode', 'GeeksforGeeks', 'Other'];

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

const DIFFICULTY_STYLES = {
  Easy: { active: 'text-emerald-400 border-emerald-500 bg-emerald-500/10', points: '10 pts' },
  Medium: { active: 'text-amber-400 border-amber-500 bg-amber-500/10', points: '30 pts' },
  Hard: { active: 'text-rose-400 border-rose-500 bg-rose-500/10', points: '50 pts (+Steal!)' },
};

const TOPICS = [
  '(No Topic)',
  'Arrays & Hashing',
  'Dynamic Programming',
  'Graphs',
  'Trees',
  'Binary Search',
  'Two Pointers',
  'Sliding Window',
  'Backtracking',
  'Heaps & Priority Queues',
  'Greedy Algorithms',
  'Linked Lists',
  'Stacks & Queues',
  'Tries',
  'Math & Number Theory',
];

const isMorningBlitz = () => {
  const h = new Date().getHours();
  return h >= 7 && h < 9;
};

const isDesperationActive = (activeScore = 0, opponentScore = 0) => {
  const h = new Date().getHours();
  const trailingBy = opponentScore - activeScore;
  return h >= 18 && trailingBy >= 150;
};

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------
function Toast({ type, message }) {
  if (!message) return null;
  const ok = type === 'success';
  return (
    <div className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm animate-fade-in
      ${ok
        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
        : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
      }`}
    >
      {ok
        ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
        : <XCircle size={16} className="shrink-0 mt-0.5" />
      }
      <span>{message}</span>
    </div>
  );
}

function SegmentedToggle({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 bg-gray-700/60 rounded-xl p-1.5">
      {SUBMISSION_TYPES.map(({ value: v, label, icon: Icon }) => (
        <button
          key={v}
          type="button"
          id={`type-${v.toLowerCase()}`}
          onClick={() => onChange(v)}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs
                      font-semibold transition-all duration-200 active:scale-95
            ${value === v
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/50'
            }`}
        >
          <Icon size={13} />
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{label.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  );
}

function BonusBar({ activeP1 = null, opponent = null, solves = [] }) {
  const blitzActive      = isMorningBlitz();
  const despActive       = isDesperationActive(activeP1?.dailyScore ?? 0, opponent?.dailyScore ?? 0);
  const streakActive     = (activeP1?.currentStreak ?? 0) >= 7;

  const getStartOfCurrentDay = () => {
    const now = new Date();
    const start = new Date(now);
    if (now.getHours() < 4) {
      start.setDate(start.getDate() - 1);
    }
    start.setHours(4, 0, 0, 0);
    return start;
  };

  const startOfDay = getStartOfCurrentDay();
  const todaysSolves = solves?.filter(s => new Date(s?.submittedAt) >= startOfDay) || [];
  const fbClaimed = todaysSolves.length > 0;

  // Unclaimed: Glows Red. Claimed: Fades out completely.
  const fbBadgeStyle = fbClaimed
    ? 'text-gray-500 border-gray-700 opacity-40 grayscale'
    : 'text-red-400 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] opacity-100';

  const pills = [
    {
      key: 'blitz',
      active: blitzActive,
      emoji: '⚡',
      label: 'Morning Blitz',
      mult: '×1.5',
      activeStyle: 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.4)]',
      icon: <Zap size={11} className="animate-pulse" />,
    },
    {
      key: 'desp',
      active: despActive,
      emoji: '🚨',
      label: 'Desperation Mode',
      mult: '×2.5',
      activeStyle: 'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_14px_rgba(239,68,68,0.5)]',
      icon: null,
    },
    {
      key: 'streak',
      active: streakActive,
      emoji: '🔥',
      label: 'Streak Buff',
      mult: '×1.1',
      activeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(251,191,36,0.4)]',
      icon: null,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bonus Arsenal</span>
        <div className={`px-2 py-0.5 text-[9px] font-black rounded-full border transition-all duration-500 ${fbBadgeStyle} tracking-widest`}>
          🩸 FIRST BLOOD
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {pills.map(({ key, active, emoji, label, mult, activeStyle, icon, customActiveText }) => (
          <div
            key={key}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 border
              text-center transition-all duration-300 select-none
              ${
                active
                  ? `${activeStyle} ring-1 ring-white/10`
                  : 'bg-gray-800/60 border-gray-700/50 text-gray-600 opacity-40 grayscale'
              }`}
          >
            <span className={`text-base leading-none ${active ? '' : 'grayscale'}`}>{emoji}</span>
            <span className="text-[9px] font-bold leading-tight mt-0.5">{label}</span>
            <span className={`text-[10px] font-black leading-none ${
              active ? 'text-white/80' : 'text-gray-600'
            }`}>{mult}</span>
            {active && (
              <span className="mt-0.5 text-[8px] font-black tracking-widest uppercase animate-pulse">{customActiveText || 'LIVE'}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BattleCoach — dynamic motivational quote based on point differential
// ---------------------------------------------------------------------------
// Quote pools — all trailing/leading quotes use Math.abs(pointDiff) or pointDiff inline
const TIED_QUOTES = [
  'Mexican standoff. 0-0. First code takes the crown.',
  'Deadlock. Smash a Hard solve and break the tie.',
  'Who wants it more today? Time to draw first blood.',
];

const TRAILING_QUOTES = [
  (pointDiff) => `Down ${Math.abs(pointDiff)} points. They are getting comfortable. Wake up!`,
  () => 'Do not let them run away with your Daily Crown!',
  (pointDiff) => `Stop scrolling. You are down ${Math.abs(pointDiff)}. Lock in and solve.`,
];

const LEADING_QUOTES = [
  (pointDiff) => `Up ${pointDiff}. Step on the gas. Make the gap unclosable.`,
  (pointDiff) => `Dominating by ${pointDiff}. Grind them into the ground.`,
  () => 'CRUSH their spirit with another Hard solve.',
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function BattleCoach({ activeScore = 0, opponentScore = 0 }) {
  const pointDiff = activeScore - opponentScore;

  const quote = useMemo(() => {
    if (pointDiff === 0)  return pickRandom(TIED_QUOTES);
    if (pointDiff < 0)   return pickRandom(TRAILING_QUOTES)(pointDiff);
    return pickRandom(LEADING_QUOTES)(pointDiff);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScore, opponentScore]);

  const isLeading  = pointDiff > 0;
  const isTrailing = pointDiff < 0;

  // Status chip
  const statusLabel = isLeading  ? `+${pointDiff} LEADING`
                    : isTrailing ? `${pointDiff} TRAILING`
                    : 'DEADLOCKED';

  const statusStyle = isLeading
    ? 'bg-violet-600/90 text-white shadow-[0_0_12px_rgba(139,92,246,0.7)]'
    : isTrailing
    ? 'bg-rose-600/90 text-white shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse'
    : 'bg-cyan-700/80 text-white';

  const containerStyle = isLeading
    ? 'border-violet-500/40 bg-gradient-to-r from-violet-500/10 to-violet-500/5'
    : isTrailing
    ? 'border-rose-500/40 bg-gradient-to-r from-rose-500/10 to-rose-500/5'
    : 'border-cyan-500/40 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5';

  const quoteColor = isLeading ? 'text-violet-200'
                   : isTrailing ? 'text-rose-200'
                   : 'text-cyan-200';

  return (
    <div className={`rounded-xl border px-4 py-3 flex flex-col gap-2 animate-fade-in ${containerStyle}`}>
      {/* Status chip row */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-500">Battle Coach</span>
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>
      {/* Quote */}
      <p className={`text-xs italic font-semibold leading-snug ${quoteColor}`}>
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AutoSyncPanel — shown exclusively when Automated_Sync tab is active
// ---------------------------------------------------------------------------
function AutoSyncPanel({ activeUserId, onSyncSuccess, showToast }) {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/solves/sync`, {
        userId: activeUserId,
      });
      showToast('success', data.message);
      // Trigger scoreboard refresh so any newly detected solves pop up instantly
      if (onSyncSuccess) onSyncSuccess();
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Sync failed. Is the backend running?';
      showToast('error', msg);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 px-4 text-center
                    animate-fade-in">
      {/* Icon */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20
                        flex items-center justify-center">
          <Monitor size={28} className="text-cyan-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500/20
                        border border-amber-500/30 flex items-center justify-center">
          <RefreshCw size={12} className="text-amber-400" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5 max-w-xs">
        <p className="text-gray-200 font-semibold text-sm leading-snug">
          Fetch your latest accepted submissions from both LeetCode and GeeksforGeeks.
        </p>
        <p className="text-gray-500 text-xs leading-relaxed">
          Points, multipliers, and streak updates are applied automatically.
        </p>
      </div>

      {/* What will be synced */}
      <div className="w-full bg-gray-700/40 border border-gray-700 rounded-xl p-4 text-left space-y-2">
        {[
          'Scans for recent accepted solves on linked platforms.',
          'Calculates difficulty-based points (10 / 30 / 50).',
          'Applies time bonuses, streaks, and Desperation Mode if active.',
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 text-xs text-gray-400">
            <CheckCircle2 size={11} className="text-cyan-500 shrink-0" />
            {item}
          </div>
        ))}
      </div>

      {/* Sync button — fixed dimensions so it never causes layout shift */}
      <button
        id="sync-leetcode-btn"
        type="button"
        onClick={handleSync}
        disabled={syncing}
        className="w-full h-12 flex-shrink-0 inline-flex items-center justify-center gap-2.5 px-6
                   bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400
                   text-white font-bold rounded-xl transition-all duration-200
                   shadow-lg shadow-cyan-500/20 active:scale-95
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {syncing
          ? <><Loader2 size={16} className="animate-spin" /> Syncing…</>
          : <><RefreshCw size={16} /> 🔄 Run Auto-Sync</>
        }
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ManualForm — shown for Manual_Problem and Theory_Video tabs
// ---------------------------------------------------------------------------
function ManualForm({
  isTheoryVideo, platform, setPlatform, problemTitle, setProblemTitle,
  difficulty, setDifficulty, topic, setTopic, airdropTopic, loading, handleSubmit,
}) {
  const isAirdropMatch = !isTheoryVideo && airdropTopic && topic === airdropTopic;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Platform — hidden for Theory_Video */}
      {!isTheoryVideo ? (
        <div className="animate-fade-in">
          <label htmlFor="platform-select"
            className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
            Platform
          </label>
          <select
            id="platform-select"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="input-field"
          >
            {CODING_PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      ) : (
        /* Theory Video — read-only platform indicator */
        <div className="animate-fade-in flex items-center gap-2 bg-blue-500/10 border
                        border-blue-500/20 rounded-lg px-3 py-2.5">
          <PlayCircle size={14} className="text-blue-400 shrink-0" />
          <span className="text-xs text-blue-300 font-medium">
            Platform auto-set to <strong>YouTube</strong> · Flat <strong>15 pts</strong> awarded
          </span>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="problem-title"
          className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
          {isTheoryVideo ? 'Video / Topic Title' : 'Problem Title'}
        </label>
        <input
          id="problem-title"
          type="text"
          value={problemTitle}
          onChange={(e) => setProblemTitle(e.target.value)}
          placeholder={isTheoryVideo ? 'e.g. Dynamic Programming Intro…' : 'e.g. Two Sum, LRU Cache…'}
          className="input-field"
          required
          autoComplete="off"
        />
      </div>

      {/* Topic dropdown — only for coding problems */}
      {!isTheoryVideo && (
        <div className="animate-fade-in">
          <label htmlFor="topic-select"
            className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
            Topic
          </label>
          <select
            id="topic-select"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input-field"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {/* Airdrop match indicator */}
          {isAirdropMatch && (
            <p className="mt-1.5 text-xs font-bold text-amber-400 animate-pulse">
              🎯 Vault Airdrop match! +50 bonus pts will be awarded.
            </p>
          )}
        </div>
      )}

      {/* Difficulty — hidden for Theory_Video */}
      {!isTheoryVideo && (
        <div className="animate-fade-in">
          <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Difficulty selection">
            {DIFFICULTY_OPTIONS.map((opt) => {
              const { active, points } = DIFFICULTY_STYLES[opt];
              return (
                <button
                  key={opt}
                  type="button"
                  id={`difficulty-${opt.toLowerCase()}`}
                  onClick={() => setDifficulty(opt)}
                  className={`py-2 rounded-lg text-sm font-bold border transition-all
                              duration-150 active:scale-95 flex flex-col items-center gap-0.5
                    ${difficulty === opt
                      ? active
                      : 'text-gray-500 border-gray-600 hover:border-gray-500 hover:text-gray-300'
                    }`}
                >
                  <span>{opt}</span>
                  <span className="text-[10px] font-normal opacity-70">{points}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit — fixed height prevents layout shift between tab states */}
      <button
        id="submit-solve-btn"
        type="submit"
        disabled={loading || !problemTitle.trim()}
        className="btn-primary justify-center mt-1 w-full h-12 flex-shrink-0"
      >
        {loading
          ? <><Loader2 size={16} className="animate-spin" /> Logging…</>
          : <><Send size={16} /> {isTheoryVideo ? 'Log Video' : 'Submit Solve'}</>
        }
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// SolveSubmissionForm — root component
// ---------------------------------------------------------------------------
export default function SolveSubmissionForm({ activeUserId, activeP1, opponent = null, isDesperationMode = false, airdropTopic = null, fetchPlayers, fetchLedger, solves = [] }) {
  const [submissionType, setSubmissionType] = useState('Automated_Sync');
  const [platform, setPlatform] = useState('LeetCode');
  const [problemTitle, setProblemTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [topic, setTopic] = useState('(No Topic)');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  const isTheoryVideo = submissionType === 'Theory_Video';
  const isAutoSync = submissionType === 'Automated_Sync';
  const isManualEntry = !isAutoSync;              // Manual_Problem or Theory_Video

  const handleTypeChange = (type) => {
    setSubmissionType(type);
    // Auto-manage platform when switching in/out of Theory_Video
    if (type === 'Theory_Video') setPlatform('YouTube');
    else if (platform === 'YouTube') setPlatform('LeetCode');
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 4500);
  };

  const triggerVisceralFeedback = () => {
    try {
      new Audio('/sounds/bass-drop.mp3').play().catch(() => {});
    } catch (e) {
      // Ignore audio errors
    }
    document.body.classList.add('arena-shake');
    setTimeout(() => {
      document.body.classList.remove('arena-shake');
    }, 500);
  };


  // Called after a successful manual form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problemTitle.trim()) return;

    setLoading(true);
    setToast({ type: '', message: '' });

    const isAirdrop = !isTheoryVideo && airdropTopic && topic === airdropTopic;

    const payload = {
      userId: activeUserId,
      problemTitle: problemTitle.trim(),
      submissionType,
      platform: isTheoryVideo ? 'YouTube' : platform,
      isDesperationMode: isDesperationMode && !isTheoryVideo,
      isAirdrop: !!isAirdrop,
      ...(isTheoryVideo ? {} : { difficulty }),
    };

    try {
      const { data } = await axios.post(`${API_BASE}/api/solves`, payload);
      showToast('success', data.message);

      const hasActivePowerplay = activeP1?.powerplayUntil && new Date(activeP1.powerplayUntil) > new Date();
      // Only fire locally if it's NOT a Hard problem, since Hard problems trigger the global Socket event!
      if (!isTheoryVideo && hasActivePowerplay && difficulty !== 'Hard') {
        triggerVisceralFeedback();
      }

      setProblemTitle('');
      if (fetchPlayers) fetchPlayers();
      if (fetchLedger) fetchLedger();
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Failed to submit. Is the backend running?';
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSuccess = () => {
    if (fetchPlayers) fetchPlayers();
    if (fetchLedger) fetchLedger();
  };

  return (
    <div className="card flex flex-col gap-5">
      {/* ── Battle Coach — always visible above the header ── */}
      <BattleCoach
        activeScore={activeP1?.dailyScore ?? 0}
        opponentScore={opponent?.dailyScore ?? 0}
      />

      {/* ── Header ── */}
      <div className="flex items-center gap-2 border-b border-gray-700 pb-4">
        <Send size={18} className="text-violet-400" />
        <h2 className="font-bold text-gray-100 tracking-wide text-sm uppercase">
          Log Activity
        </h2>
      </div>

      {/* ── Bonus Arsenal (always visible, all 4 pills) ── */}
      <BonusBar activeP1={activeP1} opponent={opponent} solves={solves} />

      {/* ── Type toggle (always visible) ── */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          Submission Type
        </label>
        <SegmentedToggle value={submissionType} onChange={handleTypeChange} />
      </div>

      {/* ── Conditional body — fixed min-height so switching tabs never shifts the layout ── */}
      <div className="min-h-[380px] w-full flex flex-col justify-center">
        {isAutoSync ? (
          /* AUTO SYNC: no manual inputs — show dedicated sync panel */
          <AutoSyncPanel
            activeUserId={activeUserId}
            onSyncSuccess={handleSyncSuccess}
            showToast={showToast}
          />
        ) : (
          /* MANUAL ENTRY: Manual_Problem or Theory_Video */
          <div className="flex flex-col gap-4 w-full">
            <ManualForm
              isTheoryVideo={isTheoryVideo}
              platform={platform}
              setPlatform={setPlatform}
              problemTitle={problemTitle}
              setProblemTitle={setProblemTitle}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              topic={topic}
              setTopic={setTopic}
              airdropTopic={airdropTopic}
              loading={loading}
              handleSubmit={handleSubmit}
            />
          </div>
        )}
      </div>

      {/* ── Toast (always visible) ── */}
      <div className="mt-4">
        <Toast type={toast.type} message={toast.message} />
      </div>
    </div>
  );
}
