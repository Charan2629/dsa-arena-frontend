import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Sword, Shield, Heart, Flame, Trophy, Target, Activity, Megaphone, Loader2, Send, LogOut, Gift, Crown, Skull, TrendingUp, Settings, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SolveSubmissionForm from './SolveSubmissionForm';
import CombatFeed from './CombatFeed';
import SettingsModal from './SettingsModal';
import ArenaGuideModal from './ArenaGuideModal';
import UnlockCinematic from './UnlockCinematic';
import MemoryCoreButton from './MemoryCoreButton';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const socket = io(import.meta.env.VITE_API_URL);



// ---------------------------------------------------------------------------
// HP Bar
// ---------------------------------------------------------------------------
function HpBar({ hp, maxHp = 100 }) {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const gradient =
    pct > 50 ? 'from-emerald-500 to-emerald-400' :
      pct >= 20 ? 'from-yellow-500 to-amber-400' :
        'from-red-600 to-rose-500';
  const critical = pct < 20;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className={`flex items-center gap-1 font-semibold
          ${critical ? 'text-rose-400' : 'text-gray-400'}`}>
          <Heart size={11} className={critical ? 'animate-pulse' : ''} />
          HP
        </span>
        <span className="font-mono font-bold text-gray-300 tabular-nums">{hp} / {maxHp}</span>
      </div>

      {/* Track */}
      <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}
                      transition-all duration-700 ease-out relative overflow-hidden`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScoreStat — numeric stat tile
// ---------------------------------------------------------------------------
function ScoreStat({ icon: Icon, label, value, accent = 'text-gray-100' }) {
  return (
    <div className="bg-gray-700/40 rounded-xl p-3 text-center border border-gray-700/60">
      <div className="flex items-center justify-center gap-1.5 text-gray-500 text-[11px] mb-1.5 uppercase tracking-wider">
        <Icon size={11} />
        {label}
      </div>
      <p className={`text-2xl font-black tabular-nums leading-none ${accent}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// getRank — maps totalScore to a competitive rank tier
// ---------------------------------------------------------------------------
const RANKS = [
  { min: 2500, name: 'Tier 1 Engineer', color: 'text-red-500', glow: 'drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]' },
  { min: 1500, name: 'System Architect', color: 'text-cyan-400', glow: 'drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]' },
  { min: 800, name: 'Logic Knight', color: 'text-yellow-400', glow: 'drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]' },
  { min: 300, name: 'Console Warrior', color: 'text-gray-400', glow: 'drop-shadow-[0_0_4px_rgba(156,163,175,0.5)]' },
  { min: 0, name: 'Scripter', color: 'text-amber-700', glow: '' },
];

function getRank(score) {
  return RANKS.find(r => score >= r.min) ?? RANKS[RANKS.length - 1];
}

// ---------------------------------------------------------------------------
// Dominance Meter — The 1v1 Tug-of-War (Daily Score Edition)
// ---------------------------------------------------------------------------
function DominanceMeter({ p1, p2 }) {
  const score1 = p1?.dailyScore || 0;
  const score2 = p2?.dailyScore || 0;
  const total = score1 + score2 || 1;

  const p1Pct = Math.round((score1 / total) * 100);
  const p2Pct = 100 - p1Pct;

  const gap = Math.abs(score1 - score2);
  const leader = score1 > score2 ? p1.username : score2 > score1 ? p2.username : 'TIE';

  return (
    <div className="bg-gray-800/80 border border-gray-700/60 rounded-xl p-4 mb-4 shadow-lg relative overflow-hidden">
      <div className={`absolute inset-0 opacity-10 blur-xl transition-all duration-1000
        ${score1 > score2 ? 'bg-violet-500 left-0 right-1/2' : score2 > score1 ? 'bg-cyan-500 left-1/2 right-0' : 'bg-gray-500'}
      `} />

      <div className="relative z-10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Today's Battle</span>
          {gap > 0 ? (
            <span className="text-xs font-bold text-yellow-400 animate-pulse flex items-center gap-1">
              <TrendingUp size={12} />
              {leader} leads today by {gap} pts
            </span>
          ) : (
            <span className="text-xs font-bold text-gray-400">DEADLOCKED</span>
          )}
        </div>

        <div className="h-4 w-full bg-gray-900 rounded-full flex overflow-hidden border border-gray-700 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-700 relative"
            style={{ width: `${p1Pct}%` }}
          >
            {score1 > score2 && <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent" />}
          </div>
          <div
            className="h-full bg-gradient-to-l from-cyan-600 to-cyan-400 transition-all duration-700 relative"
            style={{ width: `${p2Pct}%` }}
          >
            {score2 > score1 && <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/30 to-transparent" />}
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1.5">
          <span>{score1} pts today</span>
          <span>{score2} pts today</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BattleCard — Now equipped with the Powerplay Steal Badge
// ---------------------------------------------------------------------------
function StreakBadge({ streak = 0 }) {
  const isBuffed = streak >= 7;
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition-all duration-300
        ${isBuffed
          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]'
          : 'bg-gray-700/50 border-gray-600/60 text-gray-400'
        }`}
    >
      <span className={isBuffed ? 'animate-pulse' : ''}>🔥</span>
      <span>Streak: {streak}</span>
      {isBuffed && (
        <span className="ml-0.5 text-[10px] font-black text-amber-400 tracking-wide">×1.1</span>
      )}
    </div>
  );
}

function BattleCard({ player, side, isLeader, isTrailing, isPowerplay, activeUserId }) {
  const isLeft = side === 'left';
  const isKO = player.hp === 0;

  // 👑 Leader gets gold aesthetics. Trailer gets dimmed out.
  // 🔥 Powerplay overrides the border with aggressive orange/red.
  const baseBorder = isLeader ? 'border-t-yellow-400 ring-1 ring-yellow-400/30' : isLeft ? 'border-t-violet-500/50' : 'border-t-cyan-500/50';
  const accentBorder = isPowerplay ? 'border-t-2 border-t-orange-500 ring-2 ring-orange-500/50' : baseBorder;

  const baseGlow = isLeader ? 'shadow-[0_0_30px_rgba(250,204,21,0.15)]' : '';
  const glow = isPowerplay ? 'shadow-[0_0_40px_rgba(249,115,22,0.4)]' : baseGlow;

  const opacity = isTrailing && !isPowerplay ? 'opacity-85 grayscale-[15%]' : 'opacity-100';

  const avatarGrad = isLeft
    ? 'from-violet-600 to-violet-900 shadow-[0_0_20px_rgba(139,92,246,0.35)]'
    : 'from-cyan-600   to-cyan-900   shadow-[0_0_20px_rgba(6,182,212,0.35)]';

  const scoreAccent = isLeader ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : isLeft ? 'text-violet-300' : 'text-cyan-300';

  return (
    <div className={`relative bg-gray-800/80 border border-gray-700/60 rounded-2xl p-5
                     border-t-2 flex flex-col gap-5 transition-all duration-500
                     ${accentBorder} ${glow} ${opacity}
                     ${isKO ? 'opacity-50 grayscale' : ''}`}>

      {/* 🔥 The Steal Active Badge - 100% Solid Opaque */}
      {isPowerplay && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30
                        bg-gradient-to-r from-orange-600 to-red-600 text-white
                        text-[10px] font-black tracking-widest px-4 py-1 rounded-full
                        border-2 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,1)]
                        whitespace-nowrap">
          🔥 STEAL ACTIVE
        </div>
      )}

      {/* K.O. Watermark */}
      {isKO && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 rounded-2xl overflow-hidden backdrop-blur-[2px]">
          <span className="text-6xl font-black text-red-600 opacity-90 rotate-[-20deg] tracking-tighter"
            style={{ textShadow: '0 0 40px rgba(239,68,68,1)' }}>
            K.O.
          </span>
        </div>
      )}

      {/* 👑 The Crown */}
      {isLeader && !isPowerplay && (
        <div className="absolute -top-4 -right-2 transform rotate-[15deg] z-20 animate-bounce" style={{ animationDuration: '2s' }}>
          <Crown size={32} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] fill-yellow-400/20" />
        </div>
      )}

      {/* 💀 Danger Indicator if trailing heavily */}
      {isTrailing && player.hp <= 40 && !isKO && (
        <div className="absolute -top-3 -right-2 transform rotate-[15deg] z-20">
          <Skull size={24} className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
        </div>
      )}

      {/* Player identity */}
      <div className={`flex items-center gap-3 ${isLeft ? '' : 'flex-row-reverse'}`}>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                         text-lg font-black shrink-0 bg-gradient-to-br ${avatarGrad}
                         ${isLeader ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-800' : ''}`}>
          {player.username.charAt(0).toUpperCase()}
        </div>
        <div className={isLeft ? '' : 'text-right'}>
          <h3 className={`font-black leading-tight ${isLeader ? 'text-yellow-400' : 'text-gray-100'} ${isPowerplay ? 'text-orange-400' : ''}`}>
            {player.username}
          </h3>
          {/* Rank and Streak logic remains unchanged inside... */}
          {(() => {
            const rank = getRank(player.totalScore);
            return <span className={`text-[11px] font-bold ${rank.color} ${rank.glow}`}>⬡ {rank.name}</span>;
          })()}
        </div>
      </div>

      {/* ── Daily Score Hero — the dominant number ── */}
      <div className={`rounded-2xl p-4 text-center border-2 relative overflow-hidden
        ${isLeader
          ? 'border-yellow-400/60 bg-yellow-400/5 shadow-[0_0_24px_rgba(250,204,21,0.25)]'
          : isPowerplay
            ? 'border-orange-500/60 bg-orange-500/5 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
            : isLeft
              ? 'border-violet-500/30 bg-violet-500/5'
              : 'border-cyan-500/30 bg-cyan-500/5'
        }`}>
        {isLeader && (
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400 flex items-center gap-1">
            <span className="animate-pulse">▲</span> WINNING TODAY <span className="animate-pulse">▲</span>
          </div>
        )}
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-3 mb-1">Today's Score</p>
        <p className={`text-5xl font-black tabular-nums leading-none transition-all duration-500
          ${isLeader
            ? 'text-yellow-300 drop-shadow-[0_0_16px_rgba(250,204,21,0.7)]'
            : isPowerplay
              ? 'text-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]'
              : isLeft ? 'text-violet-300' : 'text-cyan-300'
          }`}>
          {player.dailyScore ?? 0}
        </p>
        <p className="text-[10px] text-gray-600 mt-1">pts earned today</p>
      </div>

      {/* ── Secondary Stats Row: Vault + Crowns ── */}
      <div className="grid grid-cols-2 gap-2">
        {/* Lifetime Vault */}
        <div className="bg-gray-700/30 rounded-xl px-3 py-2 flex items-center gap-2 border border-gray-700/50">
          <Trophy size={13} className="text-gray-500 shrink-0" />
          <div>
            <p className="text-[9px] uppercase tracking-wider text-gray-500 leading-none mb-0.5">Vault</p>
            <p className="text-sm font-black text-gray-300 tabular-nums">{(player.totalScore ?? 0).toLocaleString()}</p>
          </div>
        </div>
        {/* Daily Crowns */}
        <div className="bg-gray-700/30 rounded-xl px-3 py-2 flex items-center gap-2 border border-yellow-500/20">
          <Crown size={13} className="text-yellow-500 shrink-0" />
          <div>
            <p className="text-[9px] uppercase tracking-wider text-yellow-600 leading-none mb-0.5">Crowns</p>
            <p className="text-sm font-black text-yellow-400 tabular-nums">{player.dailyCrowns ?? 0}</p>
          </div>
        </div>
      </div>

      {/* HP bar */}
      <HpBar hp={player.hp} maxHp={100} />

      {/* Streak Badge */}
      <div className="flex justify-center">
        <StreakBadge streak={player.currentStreak ?? 0} />
      </div>

      {/* TAUNT Button */}
      {isPowerplay && player?._id?.toString() === activeUserId?.toString() && (
        <button
          onClick={() => socket.emit('send_taunt', {
            username: player.username,
            problemTitle: 'POWERPLAY STEAL ACTIVATED!',
            type: 'powerplay'
          })}
          className="w-full mt-2 bg-red-600 hover:bg-red-500 text-white font-black py-2 rounded-xl border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse active:scale-95 transition-all"
        >
          ⚡ POWERPLAY TAUNT
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VsBanner — Now a compact, horizontal-friendly fighting game badge
// ---------------------------------------------------------------------------
function VsBanner() {
  return (
    <div className="hidden md:flex flex-col items-center justify-center px-2 z-10 shrink-0">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 border-2 border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
        <span className="text-[11px] font-black text-gray-400 tracking-wider italic">VS</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TauntForm — send a trash-talk message, POSTs as submissionType: 'Taunt'
// ---------------------------------------------------------------------------
function TauntForm({ activeUserId, fetchLedger, activeUsername }) {
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [flash, setFlash] = useState('');

  const sendTaunt = async () => {
    const text = msg.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/solves`, {
        userId: activeUserId,
        problemTitle: text,
        submissionType: 'Taunt',
      });
      setMsg('');
      setFlash('Taunt fired! 💥');
      // Emit the socket event so ALL clients (including opponent) receive it in real-time
      socket.emit('send_taunt', {
        username: activeUsername,
        problemTitle: text,
        type: 'normal',
      });
    } catch {
      setFlash('Failed to send taunt.');
    } finally {
      setSending(false);
      setTimeout(() => setFlash(''), 3000);
    }
  };

  return (
    <div className="mt-4 bg-gray-800/60 border border-red-500/20 rounded-2xl p-4
                    shadow-[0_0_12px_rgba(239,68,68,0.08)]">
      <div className="flex items-center gap-2 mb-3">
        <Megaphone size={14} className="text-red-400" />
        <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Send Taunt</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendTaunt()}
          placeholder="Type your trash talk…"
          maxLength={80}
          className="flex-1 bg-gray-700/60 border border-gray-600/60 rounded-xl
                     px-3 py-2 text-sm text-gray-100 placeholder-gray-500
                     focus:outline-none focus:border-red-500/60 focus:ring-1
                     focus:ring-red-500/30 transition-all"
        />
        <button
          onClick={sendTaunt}
          disabled={sending || !msg.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                     bg-red-600 hover:bg-red-500 text-white text-sm font-bold
                     transition-all active:scale-95 shadow-lg shadow-red-500/20
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending
            ? <Loader2 size={14} className="animate-spin" />
            : <Send size={14} />}
          Fire!
        </button>
      </div>
      {flash && (
        <p className="mt-2 text-xs text-red-400 font-semibold animate-pulse">{flash}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BattleZone — Dynamic Warning Banner
// ---------------------------------------------------------------------------
function BattleZone({ p1, p2, activeUserId }) {
  const p1DailyScore = p1?.dailyScore || 0;
  const p2DailyScore = p2?.dailyScore || 0;

  const p1IsLeader = p1DailyScore > p2DailyScore;
  const p2IsLeader = p2DailyScore > p1DailyScore;

  // ── POWERPLAY IDENTIFICATION ──
  const now = new Date();
  const p1Powerplay = p1?.powerplayUntil && new Date(p1.powerplayUntil) > now;
  const p2Powerplay = p2?.powerplayUntil && new Date(p2.powerplayUntil) > now;
  const anyPowerplayActive = p1Powerplay || p2Powerplay;

  // Determine the exact warning message
  let powerplayMessage = "";
  if (p1Powerplay && p2Powerplay) {
    powerplayMessage = "⚠️ DOUBLE INFERNO: BOTH PLAYERS ARE ACTIVELY STEALING ⚠️";
  } else if (p1Powerplay) {
    powerplayMessage = `⚠️ ${p1.username.toUpperCase()} HAS THE POWERPLAY • POINT STEAL ENABLED ⚠️`;
  } else if (p2Powerplay) {
    powerplayMessage = `⚠️ ${p2.username.toUpperCase()} HAS THE POWERPLAY • POINT STEAL ENABLED ⚠️`;
  }
  // ──────────────────────────────

  return (
    <div className="flex flex-col gap-4 h-full w-full relative">
      <DominanceMeter p1={p1} p2={p2} />

      <div className={`transition-all duration-500 rounded-2xl p-1
        ${anyPowerplayActive ? 'powerplay-inferno bg-gray-950/90' : ''}
      `}>
        {anyPowerplayActive && <div className="absolute inset-0 powerplay-bg-fire pointer-events-none rounded-2xl z-0" />}

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-0 relative z-10 p-2">
          <div className="flex-1 min-w-0">
            <BattleCard
              player={p1}
              side="left"
              isLeader={p1IsLeader}
              isTrailing={p2IsLeader}
              isPowerplay={p1Powerplay}
              activeUserId={activeUserId}
            />
          </div>

          <VsBanner />

          <div className="flex-1 min-w-0">
            <BattleCard
              player={p2}
              side="right"
              isLeader={p2IsLeader}
              isTrailing={p1IsLeader}
              isPowerplay={p2Powerplay}
              activeUserId={activeUserId}
            />
          </div>
        </div>
      </div>

      {/* The Dynamic Target Banner */}
      {anyPowerplayActive && (
        <div className="text-center text-xs font-black text-red-400 tracking-widest uppercase animate-pulse mt-1">
          {powerplayMessage}
        </div>
      )}
    </div>
  );
}
// ---------------------------------------------------------------------------
// ArenaDashboard — 3-column layout: Form | Battle | Feed
// ---------------------------------------------------------------------------
export default function ArenaDashboard({ players, fetchPlayers, triggerReplay }) {
  const { user: authUser, logout } = useAuth();

  // p1 = the logged-in user, p2 = the opponent
  const p1 = players?.find(p => p._id?.toString() === authUser?._id?.toString());
  const p2 = players?.find(p => p._id?.toString() !== authUser?._id?.toString());

  // The active driver is always the logged-in user
  const activeUserId = authUser?._id || '';

  const [ledgerLogs, setLedgerLogs] = useState([]);
  const [airdrop, setAirdrop] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  // Cinematic state: null | { rankName, quote, themeKey, scoreKey, scoreValue }
  const [cinematic, setCinematic] = useState(null);
  const [isUnderAttack, setIsUnderAttack] = useState(false);

  // ── THE DEVELOPER CONSOLE EASTER EGG ──
  useEffect(() => {
    if (authUser && authUser.username && authUser.username.toLowerCase() === 'dani') {
      const consoleStyle = "color: #fbbf24; font-size: 16px; font-weight: bold; font-family: monospace; padding: 12px; border: 1px dashed #fbbf24; background: rgba(10, 10, 10, 0.9); text-shadow: 0 0 8px rgba(245, 158, 11, 0.4); border-radius: 8px;";

      console.log("%c[ SYSTEM DIAGNOSTICS: ZERO ERRORS FOUND ]", consoleStyle);
      console.log("%cNice try looking for bugs, my architect. There are no errors here—just like my decision to build this life with you. Keep grinding. I will see you in the UK in 2028. Now close this console and come back to the video call so I can look at you.", consoleStyle);
    }
  }, [authUser]);

  const fetchLedger = useCallback(async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/solves`);
      if (data.success) {
        setLedgerLogs(data.data);
      }
    } catch (err) {
      // Ignore
    }
  }, []);

  // ── Rank-unlock cinematic detection ──
  useEffect(() => {
    if (!p1) return; // CHANGED to p1

    // ── THE DANI EASTER EGG (FIRES ONCE EVER) ──
    const isDani = p1?.username?.toLowerCase().includes('dani');
    const daniFirstLogin = localStorage.getItem('arena_dani_first_blood') === '1';

    if (isDani && !daniFirstLogin) {
      // Immediately lock it so it never fires again if she refreshes
      localStorage.setItem('arena_dani_first_blood', '1');

      setCinematic({
        isNewUnlock: false,
        rankName: 'PLAYER 2 SECURED',
        quote: "I built this arena for us. Let's build our future together, Dani.",
        themeKey: null,
        scoreValue: null
      });
      return; // Stop execution here so it overrides all other daily boot logic!
    }

    const score = p1.totalScore ?? 0; // CHANGED to p1
    const streak = p1.currentStreak ?? 0; // CHANGED to p1
    const seen = parseInt(localStorage.getItem('arena_highest_seen_score') ?? '0', 10);
    const neonSeen = localStorage.getItem('arena_neon_seen') === '1';

    // Arena Day check (resets at 4:00 AM)
    const today = new Date();
    const arenaDay = new Date(today.getTime() - 4 * 60 * 60 * 1000).toDateString();
    const lastBootDate = localStorage.getItem('arena_last_boot_date');

    let hasNewUnlock = false;

    // Evaluate milestones highest-first
    if (score >= 2500 && seen < 2500) {
      setCinematic({ isNewUnlock: true, rankName: 'TIER 1 ELITE', quote: 'I am no longer playing games. I am a Tier 1 Engineer.', themeKey: 'TIER_1', scoreValue: 2500 });
    }
    else if (score >= 800 && seen < 800) {
      setCinematic({ isNewUnlock: true, rankName: 'THE DARK KNIGHT', quote: 'The grind begins.', themeKey: 'DARK_KNIGHT', scoreValue: 800 });
    }
    else if (streak >= 30 && !neonSeen) {
      setCinematic({ isNewUnlock: true, rankName: 'MYTHIC NEON', quote: 'Consistency is absolute.', themeKey: 'NEON', scoreValue: null });
    }
    // ── THE DAILY BOOT (NO NEW UNLOCKS, JUST HYPE) ──
    else if (localStorage.getItem('arena_last_boot_date') !== arenaDay) {
      // Determine their current rank for the morning hype
      if (score >= 2500) {
        setCinematic({ isNewUnlock: false, rankName: 'TIER 1 ELITE', quote: 'Welcome back, Architect.' });
      } else if (score >= 1500) {
        setCinematic({ isNewUnlock: false, rankName: 'SYSTEM ARCHITECT', quote: 'Build the foundation. Break the limits.' });
      } else if (score >= 800) {
        setCinematic({ isNewUnlock: false, rankName: 'LOGIC KNIGHT', quote: 'Sharpen your mind.' });
      } else if (score >= 300) {
        setCinematic({ isNewUnlock: false, rankName: 'CONSOLE WARRIOR', quote: 'The syntax is becoming muscle memory.' });
      } else {
        setCinematic({ isNewUnlock: false, rankName: 'SCRIPTER', quote: 'The arena awaits. Draw first blood.' });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p1?._id]);   // CHANGED to p1

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  // Fetch today's daily airdrop bounty once on mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/solves/airdrop`)
      .then(({ data }) => { if (data.success) setAirdrop(data.data); })
      .catch(() => { });
  }, []);

  // ── Socket.io Kill Feed ──
  useEffect(() => {
    // Clean up existing listeners to avoid duplicates on re-render
    socket.off('combatFeed');
    socket.off('receive_taunt');

    socket.on('combatFeed', (data) => {
      const { username, points, isFirst, isBlitz } = data;

      let msg = `⚔️ ${username} scored ${points} pts!`;
      if (isFirst) {
        msg = `🔥 FIRST BLOOD! ${username} claimed the +20 First Code Bounty!`;
      } else if (isBlitz) {
        msg = `⚡ BLITZ ACTIVATED! ${username} scored ${points} points!`;
      }

      toast.error(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Auto-refresh the ledger when an event fires
      fetchLedger();
      fetchPlayers();
    });

    socket.on('receive_taunt', (data) => {
      // Powerplay-only alarm: only fire for the RECEIVER, not the sender
      if (data.type === 'powerplay' && data.username !== authUser?.username) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const context = new AudioContext();
          const osc = context.createOscillator();
          const gain = context.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(400, context.currentTime);
          osc.frequency.linearRampToValueAtTime(800, context.currentTime + 0.2);
          osc.frequency.linearRampToValueAtTime(400, context.currentTime + 0.4);
          osc.frequency.linearRampToValueAtTime(800, context.currentTime + 0.6);
          osc.frequency.linearRampToValueAtTime(400, context.currentTime + 0.8);
          gain.gain.setValueAtTime(0.5, context.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1.0);
          osc.connect(gain);
          gain.connect(context.destination);
          osc.start();
          osc.stop(context.currentTime + 1.0);
        } catch (e) {
          // Ignore audio errors
        }

        toast.error(`⚡ ${data.username.toUpperCase()} IS STEALING YOUR POINTS!`, {
          position: "top-center",
          autoClose: 4000,
          theme: 'dark',
          style: { border: '2px solid red', backgroundColor: '#450a0a', fontWeight: 'black', color: 'white' }
        });
      }

      // Always append to the feed (both normal and powerplay)
      const newTaunt = {
        _id: `taunt-${Date.now()}`,
        problemTitle: data.problemTitle || (data.type === 'powerplay' ? 'POWERPLAY STEAL ACTIVATED!' : 'Trash talk 💬'),
        submissionType: 'Taunt',
        platform: 'Other',
        difficulty: 'N/A',
        pointsEarned: 0,
        bonuses: [],
        submittedAt: new Date().toISOString(),
        username: data.username,
      };

      setLedgerLogs(prevFeed => [newTaunt, ...prevFeed]);
    });
    socket.on('HARD_PROBLEM_CONQUERED', (data) => {

      // Trigger the screen shake
      setIsUnderAttack(true);
      setTimeout(() => setIsUnderAttack(false), 800);

      // Trigger the synchronized audio
      if (data.solver === authUser?.username) {
        new Audio('/sounds/bass-drop.mp3').play().catch(() => { });
      } else {
        new Audio('/sounds/warning-siren.mp3').play().catch(() => { });
      }
    });

    return () => {
      socket.off('combatFeed');
      socket.off('receive_taunt');
      socket.off('HARD_PROBLEM_CONQUERED');
    };
  }, [fetchLedger, fetchPlayers, authUser]);

  // ── Dynamic HP Calculation ──
  // We can remove the baseBotScore now that she is a real player!
  const p1Score = p1?.totalScore || 0;
  const p2Score = p2?.totalScore || 0;

  // V2 ENGINE: Read real HP directly from MongoDB (default to 100 if undefined)
  const p1DynamicHp = p1?.hp ?? 100;
  const p2DynamicHp = p2?.hp ?? 100;

  const activeP2 = p2 ? { ...p2, hp: p2DynamicHp } : null;

  const [activeP1, setActiveP1] = useState(p1 ? { ...p1, hp: p1DynamicHp } : null);
  useEffect(() => {
    setActiveP1(p1 ? { ...p1, hp: p1DynamicHp } : null);
  }, [p1, p1DynamicHp]);

  // ── VISUAL PRESTIGE ENGINE — respects player's equipped theme choice ──
  useEffect(() => {
    const ALL_THEMES = ['theme-dark-knight', 'theme-neon', 'theme-tier-1'];

    // Clear all theme classes from every target node
    const targets = [
      document.body,
      document.documentElement,
      document.getElementById('root'),
    ].filter(Boolean);

    targets.forEach((el) => el.classList.remove(...ALL_THEMES));
    localStorage.removeItem('arena-theme');

    if (!activeP1) return;

    // Strictly read the player's saved preference
    const equipped = activeP1.activePerks?.equippedTheme;

    let themeClass = '';
    if (equipped === 'NEON') themeClass = 'theme-neon';
    else if (equipped === 'DARK_KNIGHT') themeClass = 'theme-dark-knight';
    else if (equipped === 'TIER_1') themeClass = 'theme-tier-1';
    // STANDARD or null/undefined → no custom theme

    if (themeClass) {
      targets.forEach((el) => el.classList.add(themeClass));
      localStorage.setItem('arena-theme', themeClass);
    }
  }, [activeP1?.activePerks?.equippedTheme]);

  // ── Desperation Mode: auto-fires when the active driver's HP ≤ 20 ──
  const activePlayerHp = activeUserId === (p1?._id?.toString()) ? p1DynamicHp : p2DynamicHp;
  const isDesperationMode = activePlayerHp <= 20;

  return (
    <>
      {/* ── Main wrapper ── */}
      <div className={`max-w-[1600px] mx-auto px-4 xl:px-6 py-8 flex flex-col gap-8 min-h-screen ${isUnderAttack ? 'animate-shake' : ''}`}>

        {/* ── Page Header + Logout ── */}
        <div className="text-center relative">
          <div className="absolute right-0 top-0 flex items-center gap-4">
            <button
              id="arena-guide-btn"
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 font-semibold transition-colors"
            >
              <Info size={13} />
              Arena Guide
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-400 font-semibold transition-colors"
            >
              <Settings size={13} />
              Settings
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-rose-400 font-semibold transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>

          <div className="inline-flex items-center gap-2 text-violet-400 text-xs font-bold
                        uppercase tracking-widest mb-4 bg-violet-500/10 border border-violet-500/20
                        rounded-full px-4 py-1.5">
            <Sword size={12} />
            Live Arena
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight
                       bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400
                       bg-clip-text text-transparent">
            DSA Morning Sprint Arena
          </h1>
          <p className="text-gray-500 mt-3 text-sm md:text-base max-w-md mx-auto">
            Solve fast · Earn points · Dominate the leaderboard
          </p>
        </div>

        {/* ── Thin accent rule ── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-2" />

        {/* ── The 12-Column Command Center Grid ──
          Left 25% (Span 3): Inputs
          Center 50% (Span 6): Battle Stage
          Right 25% (Span 3): Kill Feed
      ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch w-full">

          {/* 🛡️ Column 1 — Control Panel (Log Activity) */}
          <div className="xl:col-span-3 order-2 xl:order-1 flex flex-col">
            <div className="sticky top-6 flex-1 h-full">
              <SolveSubmissionForm
                activeUserId={activeUserId}
                activeP1={activeP1}
                opponent={activeP2}
                isDesperationMode={isDesperationMode}
                airdropTopic={airdrop?.topic || null}
                fetchPlayers={fetchPlayers}
                fetchLedger={fetchLedger}
                solves={ledgerLogs}
              />
            </div>
          </div>

          {/* ⚔️ Column 2 — THE BATTLE STAGE (Center, Double Width) */}
          <div className="xl:col-span-6 order-1 xl:order-2 flex flex-col gap-4">
            {activeP1 && activeP2 && (
              <>
                {/* Vault Bounty Banner */}
                {airdrop && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5
                                shadow-[0_0_18px_rgba(245,158,11,0.15)] p-4 flex items-center gap-3">
                    <Gift size={18} className="text-amber-400 shrink-0 animate-pulse" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/70 mb-0.5">
                        Today’s Vault Bounty
                      </p>
                      <p className="text-sm font-black text-amber-300">
                        🎯 Solve a <span className="text-white">{airdrop.topic}</span> problem for{' '}
                        <span className="text-amber-400">+{airdrop.bonus} bonus pts!</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Side-by-Side Combat */}
                <BattleZone p1={activeP1} p2={activeP2} activeUserId={activeUserId} />

                {/* Taunt Bar locked directly under the combat cards */}
                <div className="w-full">
                  <TauntForm activeUserId={activeUserId} fetchLedger={fetchLedger} activeUsername={p1?.username || ''} />
                </div>
              </>
            )}
          </div>

          {/* 📜 Column 3 — Kill Feed */}
          <div className="xl:col-span-3 order-3 xl:order-3 flex flex-col">
            <div className="sticky top-6 flex-1 h-full">
              <CombatFeed solves={ledgerLogs} />
            </div>
          </div>

        </div>

        {isSettingsOpen && (
          <SettingsModal
            activeP1={p1}
            onClose={() => setIsSettingsOpen(false)}
            onSuccess={fetchPlayers}
            setCinematic={setCinematic}
          />
        )}

        {isGuideOpen && (
          <ArenaGuideModal onClose={() => setIsGuideOpen(false)} />
        )}

        {/* ── Rank Unlock Cinematic ── */}
        {cinematic && (
          <UnlockCinematic
            rankName={cinematic.rankName}
            quote={cinematic.quote}
            isNewUnlock={cinematic.isNewUnlock}
            onComplete={async () => {
              const today = new Date();
              const arenaDay = new Date(today.getTime() - 4 * 60 * 60 * 1000).toDateString();
              localStorage.setItem('arena_last_boot_date', arenaDay);

              if (cinematic.isNewUnlock && cinematic.themeKey) {
                // 1. Persist seen-state so cinematic never repeats
                if (cinematic.scoreValue !== null) {
                  const prev = parseInt(localStorage.getItem('arena_highest_seen_score') ?? '0', 10);
                  if (cinematic.scoreValue > prev) {
                    localStorage.setItem('arena_highest_seen_score', String(cinematic.scoreValue));
                  }
                } else {
                  // Neon streak unlock
                  localStorage.setItem('arena_neon_seen', '1');
                }

                const newTheme = cinematic.themeKey;

                // 0. DIRECT DOM OVERRIDE: Eliminate state race-conditions by forcing CSS instantly
                const ALL_THEMES = ['theme-dark-knight', 'theme-neon', 'theme-tier-1'];
                const targets = [document.body, document.documentElement, document.getElementById('root')].filter(Boolean);
                targets.forEach((el) => el.classList.remove(...ALL_THEMES));

                let themeClass = '';
                if (newTheme === 'NEON') themeClass = 'theme-neon';
                else if (newTheme === 'DARK_KNIGHT') themeClass = 'theme-dark-knight';
                else if (newTheme === 'TIER_1') themeClass = 'theme-tier-1';

                if (themeClass) {
                  targets.forEach((el) => el.classList.add(themeClass));
                  localStorage.setItem('arena-theme', themeClass);
                }

                // 1. Optimistic Update: Sync local React state
                setActiveP1(prev => ({
                  ...prev,
                  activePerks: {
                    ...prev?.activePerks,
                    equippedTheme: newTheme,
                    unlockedTheme: newTheme
                  }
                }));

                // 2. Dismiss the cinematic overlay
                setCinematic(null);

                // 3. Patch the backend silently in the background
                if (activeP1?._id) {
                  try {
                    await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${activeP1._id}/perks`, {
                      equippedTheme: newTheme,
                      unlockedTheme: newTheme
                    });
                    if (fetchPlayers) fetchPlayers();
                  } catch (error) {
                    // Ignore sync errors
                  }
                }
              } else {
                setCinematic(null);
              }
            }}
          />
        )}



        {/* ── Memory Core ── */}
        {authUser?.username?.toLowerCase().includes('dani') && (
          <MemoryCoreButton activeP1={p1} triggerReplay={triggerReplay} />
        )}

      </div>
    </>
  );
}
