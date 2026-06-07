import { X, Moon, Zap, Trophy, Flame, Clock, Shield, Star } from 'lucide-react';

// ---------------------------------------------------------------------------
// Data — mirrors RANKS in ArenaDashboard exactly
// ---------------------------------------------------------------------------
const RANK_TIERS = [
  { min: 2500, name: 'Tier 1 Engineer', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30',    badge: 'bg-red-500/20 text-red-300' },
  { min: 1500, name: 'System Architect', color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/30',   badge: 'bg-cyan-500/20 text-cyan-300' },
  { min: 800,  name: 'Logic Knight',     color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-300' },
  { min: 300,  name: 'Console Warrior',  color: 'text-gray-400',   bg: 'bg-gray-500/10 border-gray-500/30',   badge: 'bg-gray-500/20 text-gray-300' },
  { min: 0,    name: 'Scripter',         color: 'text-amber-700',  bg: 'bg-amber-900/20 border-amber-800/30', badge: 'bg-amber-900/30 text-amber-600' },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function SectionCard({ icon: Icon, iconColor, title, children }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-700/60 ${iconColor}`}>
          <Icon size={16} />
        </div>
        <h3 className="font-black text-sm text-gray-100 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ emoji, label, detail, highlight = false }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl px-3 py-2.5 border
      ${highlight
        ? 'bg-violet-500/10 border-violet-500/20'
        : 'bg-gray-700/30 border-gray-700/40'
      }`}
    >
      <span className="text-base shrink-0 mt-0.5">{emoji}</span>
      <div>
        <p className="text-xs font-bold text-gray-200 leading-snug">{label}</p>
        {detail && <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{detail}</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ArenaGuideModal
// ---------------------------------------------------------------------------
export default function ArenaGuideModal({ onClose }) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
                      bg-gray-900 border border-gray-700/80 rounded-3xl
                      shadow-[0_0_80px_rgba(139,92,246,0.15)]
                      flex flex-col">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between
                        px-6 py-4 bg-gray-900/95 backdrop-blur-md
                        border-b border-gray-700/60 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30
                            flex items-center justify-center">
              <Trophy size={15} className="text-violet-400" />
            </div>
            <div>
              <h2 className="font-black text-gray-100 text-sm uppercase tracking-widest">Arena Guide</h2>
              <p className="text-[10px] text-gray-500 font-medium">Rules · Ranks · Multipliers</p>
            </div>
          </div>
          <button
            id="arena-guide-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-800 border border-gray-700
                       flex items-center justify-center text-gray-400
                       hover:text-gray-100 hover:bg-gray-700 transition-all active:scale-95"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-6">

          {/* ── Section 1: The Daily Match ── */}
          <SectionCard icon={Clock} iconColor="text-cyan-400" title="The Daily Match">
            <div className="flex flex-col gap-2">
              <InfoRow
                emoji="⏰"
                label="4:00 AM Server Wipe"
                detail="All daily scores and daily crowns reset at 4:00 AM every day. The slate is wiped clean — yesterday's lead means nothing."
              />
              <InfoRow
                emoji="👑"
                label="Daily Crowns"
                detail="The player with the higher daily score at any snapshot earns a Daily Crown. Track them in the secondary stats row on your Battle Card."
              />
              <InfoRow
                emoji="🩸"
                label="Hourly HP Decay"
                detail="HP drains over time. Solve problems to regenerate HP. Let it flatline and you enter a dangerous, weakened state."
                highlight
              />
            </div>
          </SectionCard>

          {/* ── Section 2: Active Multipliers ── */}
          <SectionCard icon={Zap} iconColor="text-orange-400" title="Active Multipliers">
            <div className="flex flex-col gap-2">
              <InfoRow
                emoji="⚡"
                label="Morning Blitz ×1.5  —  07:00 to 09:00"
                detail="All points scored during the morning window are multiplied by 1.5x. Early birds get the crown."
              />
              <InfoRow
                emoji="🔥"
                label="7-Day Streak Buff ×1.1"
                detail="Maintain a solve streak for 7 consecutive days to unlock a permanent 1.1x multiplier on all earned points. The fire badge glows amber when active."
              />
              <InfoRow
                emoji="🚨"
                label="Desperation Mode ×2.5  —  Trailing 150+ pts after 18:00"
                detail="When you are down by 150 or more points after 6:00 PM, Desperation Mode fires. Every solve earns 2.5× points. High risk, high reward comeback window."
                highlight
              />
            </div>
          </SectionCard>

          {/* ── Section 3: Vault Ranks & Themes ── */}
          <SectionCard icon={Star} iconColor="text-yellow-400" title="Vault Ranks & Themes">
            <div className="flex flex-col gap-3">
              {/* Rank tiers */}
              <div className="flex flex-col gap-1.5">
                {RANK_TIERS.map(({ min, name, color, bg, badge }) => (
                  <div key={name} className={`flex items-center justify-between rounded-xl px-3 py-2 border ${bg}`}>
                    <span className={`text-xs font-black ${color}`}>⬡ {name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge}`}>
                      {min === 0 ? '0 – 299 pts' : `${min.toLocaleString()}+ pts`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Theme unlocks */}
              <div className="mt-1 flex flex-col gap-2 border-t border-gray-700/60 pt-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Unlockable Themes</p>
                <InfoRow
                  emoji="🦇"
                  label="The Dark Knight — unlocks at 800 pts"
                  detail="Reach Logic Knight rank to transform the arena into a pure black void with gold accents."
                  highlight
                />
                <InfoRow
                  emoji="🔴"
                  label="Tier 1 Elite — unlocks at 2,500 pts"
                  detail="Reach the pinnacle Tier 1 Engineer rank. A blood-red prestige skin for the relentless."
                />
                <InfoRow
                  emoji="⚡"
                  label="Mythic Neon — 30-Day consecutive solve streak"
                  detail="Cannot be earned through score alone. Maintain a flawless 30-day streak. The rarest cosmetic in the arena — only the obsessed will ever see it."
                  highlight
                />
                <div className="rounded-xl px-3 py-2.5 bg-amber-500/8 border border-amber-500/20 flex items-start gap-2.5 mt-1">
                  <span className="text-sm shrink-0">🎰</span>
                  <div>
                    <p className="text-xs font-bold text-amber-300">Lootbox Jackpot</p>
                    <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                      Mythic Neon can also drop from the 4:00 AM lootbox (Hard/Medium solve, 5% chance). Pure luck.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

        </div>

        {/* Footer */}
        <div className="px-6 pb-5 text-center">
          <p className="text-[10px] text-gray-600 font-medium">
            Compete daily · Climb the ranks · Defend the Daily Crown
          </p>
        </div>

      </div>
    </div>
  );
}
