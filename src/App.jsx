import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { Login, Register } from './components/AuthPages';
import ArenaDashboard from './components/ArenaDashboard';
import Landing from './components/Landing';
import DaniIntro from './components/DaniIntro';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_API_URL;

export default function App() {
  const { isAuthenticated, user, token, updateUser } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  // isPlayingDaniIntro: auto-plays only on first login (DB-gated)
  const [isPlayingDaniIntro, setIsPlayingDaniIntro] = useState(false);
  // isReplayingDani: toggled locally for the manual Memory Core replay
  const [isReplayingDani, setIsReplayingDani] = useState(false);

  const [players, setPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(true);
  const [playersError, setPlayersError] = useState(null);

  const fetchPlayers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/users`);
      setPlayers(data.data);
      setPlayersError(null);
    } catch (err) {
      console.error('fetchPlayers error:', err.message);
      setPlayersError('Could not reach the backend. Is it running on port 5000?');
    } finally {
      setPlayersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlayers();

      // ── INTRO CINEMATIC — DB-gated, one-time only ──
      // Auto-play if the user is Dani AND the DB says she hasn't seen it yet.
      const isDani = user?.username?.toLowerCase().includes('dani');
      if (isDani && user?.hasSeenIntro === false) {
        setIsPlayingDaniIntro(true);
      }
    }
  }, [isAuthenticated, fetchPlayers, user]);

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-gray-900 overflow-hidden">
        {/* The underlying Login/Register form */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${hasEntered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
          {showRegister
            ? <Register onSwitch={() => setShowRegister(false)} />
            : <Login onSwitch={() => setShowRegister(true)} />}
        </div>

        {/* The Landing gateway rendered on top until it fades out */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 z-50 ${hasEntered ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
            }`}
        >
          <Landing onEnter={() => setHasEntered(true)} />
        </div>
      </div>
    );
  }

  // ── Loading / error states ─────────────────────────────────────────────────
  if (playersLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Connecting to arena…</p>
        </div>
      </div>
    );
  }

  if (playersError) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <p className="text-rose-400 font-semibold mb-2">⚠️ Connection Error</p>
          <p className="text-gray-400 text-sm mb-4">{playersError}</p>
          <button onClick={fetchPlayers} className="btn-primary mx-auto">Retry</button>
        </div>
      </div>
    );
  }

  if (isPlayingDaniIntro) {
    return (
      <DaniIntro
        onComplete={async () => {
          // 1. Hide the cinematic immediately
          setIsPlayingDaniIntro(false);

          // 2. Instantly update local state + localStorage so refresh doesn't replay it
          if (updateUser) updateUser({ hasSeenIntro: true });

          // 3. Persist to the DB so it never auto-plays again on any device
          try {
            await axios.post(
              `${API_BASE}/api/users/intro-watched`,
              {},
              { headers: { Authorization: token ? `Bearer ${token}` : '' } }
            );
            console.log('🎬 [Intro] hasSeenIntro saved to DB.');
          } catch (err) {
            // Non-critical — the DB write failed, but don't block the user.
            // On next login hasSeenIntro will still be false and they'll see it once more.
            console.warn('⚠️ [Intro] Could not save hasSeenIntro to DB:', err.message);
          }
        }}
      />
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-inter">
      <ToastContainer theme="dark" position="bottom-right" />
      <ArenaDashboard
        players={players}
        fetchPlayers={fetchPlayers}
        triggerReplay={() => setIsReplayingDani(true)}
      />
      {/* ── Memory Core Replay Overlay ── */}
      {isReplayingDani && (
        <DaniIntro
          isReplay={true} onComplete={() => setIsReplayingDani(false)}
        />
      )}
    </div>
  );
}
