import { Clock, Flame, Zap, Star, Code2, PlayCircle, Monitor, BookOpen, Megaphone } from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_SOLVES = [
  {
    _id: 'mock-1',
    problemTitle: 'Two Sum',
    submissionType: 'Manual_Problem',
    platform: 'LeetCode',
    difficulty: 'Easy',
    pointsEarned: 35,
    bonuses: ['Morning Blitz (×1.5)', 'First Code Bounty (+20)'],
    submittedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    username: 'Player1',
  },
  {
    _id: 'mock-2',
    problemTitle: 'Dynamic Programming — Full Course',
    submissionType: 'Theory_Video',
    platform: 'YouTube',
    difficulty: 'N/A',
    pointsEarned: 15,
    bonuses: [],
    submittedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    username: 'Player2',
  },
  {
    _id: 'mock-3',
    problemTitle: 'Median of Two Sorted Arrays',
    submissionType: 'Automated_Sync',
    platform: 'LeetCode',
    difficulty: 'Hard',
    pointsEarned: 75,
    bonuses: ['Morning Blitz (×1.5)'],
    submittedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    username: 'Player1',
  },
  {
    _id: 'mock-4',
    problemTitle: 'Stacks and Queues Explained',
    submissionType: 'Theory_Video',
    platform: 'YouTube',
    difficulty: 'N/A',
    pointsEarned: 15,
    bonuses: [],
    submittedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    username: 'Player2',
  },
  {
    _id: 'mock-5',
    problemTitle: 'Jump Game II',
    submissionType: 'Manual_Problem',
    platform: 'GeeksforGeeks',
    difficulty: 'Medium',
    pointsEarned: 45,
    bonuses: ['Morning Blitz (×1.5)'],
    submittedAt: new Date(Date.now() - 94 * 60 * 1000).toISOString(),
    username: 'Player1',
  },
];

// ---------------------------------------------------------------------------
// Card theme: border + bg based on submission type & platform
// ---------------------------------------------------------------------------
const getCardTheme = (solve) => {
  const { submissionType, platform, pointsEarned } = solve;

  if (submissionType === 'Taunt') {
    return {
      border: 'border-red-500/50',
      bg: 'bg-red-950/20',
      glow: 'shadow-[0_0_14px_rgba(239,68,68,0.25)]',
      label: '📣 TAUNT FIRED',
      labelColor: 'text-red-400',
      labelBg: 'bg-red-500/10 border-red-500/30',
    };
  }

  if (submissionType === 'Automated_Sync') {
    return {
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-950/20',
      glow: 'shadow-[0_0_12px_rgba(6,182,212,0.2)]',
      label: `🤖 AUTO-SYNC (+${pointsEarned} pts)`,
      labelColor: 'text-cyan-400',
      labelBg: 'bg-cyan-500/10 border-cyan-500/30',
    };
  }

  if (submissionType === 'Theory_Video') {
    return {
      border: 'border-blue-500/40',
      bg: 'bg-blue-950/20',
      glow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]',
      label: `📺 Theory Completed (+${pointsEarned} pts)`,
      labelColor: 'text-blue-400',
      labelBg: 'bg-blue-500/10 border-blue-500/30',
    };
  }

  // Manual_Problem
  if (platform === 'LeetCode') {
    return {
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/20',
      glow: '',
      label: `Manual LC (+${pointsEarned} pts)`,
      labelColor: 'text-amber-400',
      labelBg: 'bg-amber-500/10 border-amber-500/30',
    };
  }

  if (platform === 'GeeksforGeeks') {
    return {
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/20',
      glow: '',
      label: `Manual GFG (+${pointsEarned} pts)`,
      labelColor: 'text-emerald-400',
      labelBg: 'bg-emerald-500/10 border-emerald-500/30',
    };
  }

  return {
    border: 'border-violet-500/40',
    bg: 'bg-violet-950/20',
    glow: '',
    label: `Manual Log (+${pointsEarned} pts)`,
    labelColor: 'text-violet-400',
    labelBg: 'bg-violet-500/10 border-violet-500/30',
  };
};

// ---------------------------------------------------------------------------
// Platform pill
// ---------------------------------------------------------------------------
const PLATFORM_META = {
  LeetCode:      { label: 'LC',  bg: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  GeeksforGeeks: { label: 'GFG', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  YouTube:       { label: 'YT',  bg: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  Other:         { label: '?',   bg: 'bg-gray-500/15 text-gray-400 border-gray-500/25' },
};

function PlatformPill({ platform }) {
  const meta = PLATFORM_META[platform] ?? PLATFORM_META.Other;
  return (
    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px]
                      font-bold border tracking-wider ${meta.bg}`}>
      {meta.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Type icon
// ---------------------------------------------------------------------------
const TYPE_META = {
  Manual_Problem: { icon: Code2,      color: 'text-violet-400' },
  Theory_Video:   { icon: BookOpen,   color: 'text-blue-400'   },
  Automated_Sync: { icon: Monitor,    color: 'text-cyan-400'   },
  Taunt:          { icon: Megaphone,  color: 'text-red-400'    },
};

// ---------------------------------------------------------------------------
// Bonus chips
// ---------------------------------------------------------------------------
const BONUS_ICONS = {
  'Morning Blitz (×1.5)':    { icon: Zap,   color: 'text-orange-400', label: 'Blitz'       },
  'First Code Bounty (+20)': { icon: Star,  color: 'text-violet-400', label: 'Bounty'      },
  'Desperation Mode (×2.0)': { icon: Flame, color: 'text-red-400',    label: 'Desperation' },
};

// ---------------------------------------------------------------------------
// Timestamp
// ---------------------------------------------------------------------------
const timeAgo = (isoString) => {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
};

// ---------------------------------------------------------------------------
// LedgerCard — individual activity entry
// ---------------------------------------------------------------------------
function LedgerCard({ solve, idx }) {
  const theme   = getCardTheme(solve);
  const typeMeta = TYPE_META[solve.submissionType] ?? TYPE_META.Manual_Problem;
  const TypeIcon = typeMeta.icon;

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all duration-200
                  hover:brightness-110 animate-fade-in ${theme.border} ${theme.bg} ${theme.glow}`}
      style={{ animationDelay: `${idx * 45}ms` }}
    >
      {/* Top row: type icon + title + platform pill */}
      <div className="flex items-start gap-2 mb-2.5">
        <TypeIcon size={14} className={`${typeMeta.color} shrink-0 mt-0.5`} />
        <span className="font-semibold text-gray-100 text-sm leading-snug line-clamp-1 flex-1">
          {solve.problemTitle}
        </span>
        <PlatformPill platform={solve.platform} />
      </div>

      {/* Middle row: difficulty label + points */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase
                          tracking-widest border rounded-md px-2 py-0.5
                          ${theme.labelBg} ${theme.labelColor}`}>
          {theme.label}
        </span>
        <span className={`text-emerald-400 font-black text-base tabular-nums
          ${solve.pointsEarned === 0 ? 'opacity-0' : ''}`}>
          +{solve.pointsEarned}
          <span className="text-emerald-600 text-xs font-normal ml-0.5">pts</span>
        </span>
      </div>

      {/* Bottom row: bonus chips + player + timestamp */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Bonus chips */}
        {solve.bonuses?.map((bonus) => {
          const meta = BONUS_ICONS[bonus];
          if (!meta) return null;
          const BonusIcon = meta.icon;
          return (
            <span
              key={bonus}
              className={`inline-flex items-center gap-1 text-[10px] font-semibold ${meta.color}
                          bg-gray-900/60 border border-gray-700 rounded-full px-2 py-0.5`}
            >
              <BonusIcon size={9} />
              {meta.label}
            </span>
          );
        })}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Player name */}
        <span className="text-xs text-gray-400 font-medium">{solve.username}</span>

        {/* Timestamp */}
        <span className="flex items-center gap-1 text-[11px] text-gray-600">
          <Clock size={10} />
          {timeAgo(solve.submittedAt)}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CombatFeed
// ---------------------------------------------------------------------------
export default function CombatFeed({ solves = MOCK_SOLVES }) {
  return (
    <div className="card flex flex-col gap-0 h-full flex-1">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500/15
                        border border-orange-500/25">
          <Flame size={14} className="text-orange-400" />
        </div>
        <h2 className="font-bold text-gray-100 tracking-wide text-sm uppercase">
          Activity Ledger
        </h2>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-emerald-500
                         bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* Scrollable list */}
      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[620px] pr-0.5">
        {!solves?.length && (
          <div className="text-center py-12">
            <PlayCircle size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No activity yet.</p>
            <p className="text-gray-600 text-xs mt-1">Submit your first solve to start the ledger!</p>
          </div>
        )}
        {solves?.map((solve, idx) => (
          <LedgerCard key={solve._id} solve={solve} idx={idx} />
        ))}
      </div>

      {/* Last Strike Indicator */}
      <div className="mt-6 mb-auto pb-2 text-center text-xs uppercase tracking-widest text-slate-500/50 font-semibold">
        {!solves?.length 
          ? '[ ⚡ THE ARENA IS QUIET. FIRST BLOOD UP FOR GRABS. ]' 
          : `[ ⚡ ${solves[0]?.username?.toUpperCase() || 'UNKNOWN'} HOLDS THE MOMENTUM ]`
        }
      </div>
    </div>
  );
}
