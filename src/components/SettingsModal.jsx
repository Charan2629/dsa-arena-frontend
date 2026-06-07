import React, { useState } from 'react';
import axios from 'axios';
import { X, Save, Loader2, Link as LinkIcon, Palette, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_API_URL;

// Validate what the user is allowed to equip based on their account state
function canEquipTheme(themeValue, activeP1) {
  if (themeValue === 'STANDARD') return true;
  if (themeValue === 'DARK_KNIGHT') return (activeP1?.totalScore ?? 0) >= 800;
  if (themeValue === 'NEON')        return activeP1?.activePerks?.unlockedTheme === 'NEON';
  if (themeValue === 'TIER_1')      return (activeP1?.totalScore ?? 0) >= 2500;
  return false;
}

const THEMES = [
  {
    value: 'STANDARD',
    label: 'Standard (Violet & Cyan)',
    desc: 'Always unlocked.',
    color: 'text-violet-400',
  },
  {
    value: 'DARK_KNIGHT',
    label: '🦇 The Dark Knight',
    desc: 'Unlocks at 800 pts (Logic Knight rank).',
    color: 'text-yellow-400',
  },
  {
    value: 'NEON',
    label: '⚡ Mythic Neon',
    desc: 'Requires a 30-day consecutive solve streak.',
    color: 'text-cyan-400',
  },
  {
    value: 'TIER_1',
    label: '🔴 Tier 1 Elite',
    desc: 'Unlocks at 2,500 pts (Tier 1 Engineer rank).',
    color: 'text-red-400',
  },
];

export default function SettingsModal({ activeP1, onClose, onSuccess, setCinematic }) {
  const [leetcodeUsername, setLeetcodeUsername] = useState(activeP1?.leetcodeUsername || '');
  const [gfgUsername, setGfgUsername]           = useState(activeP1?.gfgUsername || '');
  const [equippedTheme, setEquippedTheme]        = useState(
    activeP1?.activePerks?.equippedTheme || 'STANDARD'
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!activeP1?._id) return;

    setSaving(true);
    try {
      // 1. Save linked accounts
      const accountRes = await axios.patch(`${API}/api/users/${activeP1._id}/accounts`, {
        leetcodeUsername: leetcodeUsername.trim(),
        gfgUsername:      gfgUsername.trim(),
      });

      // 2. Save equipped theme
      const perkRes = await axios.patch(`${API}/api/users/${activeP1._id}/perks`, {
        equippedTheme,
      });

      if (accountRes.data.success && perkRes.data.success) {
        toast.success('Settings saved!');
        if (onSuccess) onSuccess();
        
        // Map each theme to its real cinematic rank title and motivational quote
        const THEME_CINEMATICS = {
          STANDARD:   { rankName: 'CONSOLE WARRIOR',  quote: 'Back to basics. The foundation of every legend.' },
          DARK_KNIGHT: { rankName: 'THE DARK KNIGHT',  quote: 'The grind begins. Welcome to the darkness.' },
          NEON:        { rankName: 'MYTHIC NEON',       quote: 'Consistency is absolute. You earned this.' },
          TIER_1:      { rankName: 'TIER 1 ELITE',      quote: 'I am no longer playing games. I am a Tier 1 Engineer.' },
        };
        const meta = THEME_CINEMATICS[equippedTheme] ?? THEME_CINEMATICS.STANDARD;

        setCinematic({ 
          isNewUnlock: false, 
          rankName: meta.rankName, 
          quote: meta.quote, 
          themeKey: equippedTheme, 
          scoreValue: null 
        });

        onClose(); // Close the settings modal instantly
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 border border-gray-700/60 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">

        {/* Glow accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
              <LinkIcon size={16} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">Account Settings</h2>
              <p className="text-[11px] text-gray-500">Linked profiles · Cosmetic loadout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center
                       text-gray-400 hover:text-gray-100 hover:bg-gray-700 transition-all active:scale-95"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5 p-6">

          {/* ── Section 1: Linked Accounts ── */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Linked Platforms</p>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                LeetCode Username
              </label>
              <input
                type="text"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                placeholder="e.g. neetcode"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-100
                           focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                GeeksforGeeks Username
              </label>
              <input
                type="text"
                value={gfgUsername}
                onChange={(e) => setGfgUsername(e.target.value)}
                placeholder="e.g. coder123"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-100
                           focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

          {/* ── Section 2: Cosmetic Loadout ── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Palette size={13} className="text-amber-400" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cosmetic Loadout</p>
            </div>

            <div className="flex flex-col gap-2">
              {THEMES.map(({ value, label, desc, color }) => {
                const unlocked  = canEquipTheme(value, activeP1);
                const isActive  = equippedTheme === value;

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && setEquippedTheme(value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left
                                transition-all duration-200 active:scale-[0.98]
                      ${isActive
                        ? 'border-violet-500/60 bg-violet-500/10 ring-1 ring-violet-500/30'
                        : unlocked
                        ? 'border-gray-700/60 bg-gray-800/60 hover:border-gray-600'
                        : 'border-gray-800/60 bg-gray-900/40 opacity-40 cursor-not-allowed'
                      }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-colors
                      ${isActive ? 'border-violet-400 bg-violet-400' : 'border-gray-600 bg-transparent'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${isActive ? color : unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                        {label}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${unlocked ? 'text-gray-500' : 'text-gray-700'}`}>
                        {desc}
                      </p>
                    </div>
                    {!unlocked && <Lock size={11} className="text-gray-700 shrink-0" />}
                    {isActive && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-violet-400 shrink-0">
                        Equipped
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Footer actions ── */}
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold
                         shadow-[0_0_15px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2 transition-all active:scale-95"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
