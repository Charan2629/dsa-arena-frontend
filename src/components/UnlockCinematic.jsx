import { useEffect } from 'react';

// ---------------------------------------------------------------------------
// Keyframe CSS injected once at module level
// ---------------------------------------------------------------------------
const KEYFRAMES = `
@keyframes uc-title-in {
  0%   { opacity: 0; letter-spacing: 0.35em; transform: translateY(10px); }
  100% { opacity: 1; letter-spacing: 0.22em; transform: translateY(0); }
}
@keyframes uc-title-out {
  0%   { opacity: 1; }
  100% { opacity: 0; transform: translateY(-8px); }
}
@keyframes uc-quote-in {
  0%   { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes uc-overlay-out {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected) return;
  const tag = document.createElement('style');
  tag.textContent = KEYFRAMES;
  document.head.appendChild(tag);
  styleInjected = true;
}

// ---------------------------------------------------------------------------
// UnlockCinematic
// ---------------------------------------------------------------------------
export default function UnlockCinematic({ rankName, quote, onComplete, isNewUnlock }) {
  injectStyles();

  let titleStyle, quoteStyle, overlayStyle, totalMs;

  if (isNewUnlock) {
    const T = {
      titleFadeIn: 0.3,
      titleHold: 2.2,
      titleFadeOut: 0.6,
      quoteDelay: 3.4,
      quoteFadeIn: 0.5,
      quoteHold: 1.8,
      overlayFadeOut: 0.7,
    };
    titleStyle = {
      animation: [
        `uc-title-in  ${T.titleFadeIn}s ease-out ${0}s both`,
        `uc-title-out ${T.titleFadeOut}s ease-in ${T.titleFadeIn + T.titleHold}s both`,
      ].join(', '),
    };
    quoteStyle = {
      animation: `uc-quote-in ${T.quoteFadeIn}s ease-out ${T.quoteDelay}s both`,
    };
    const overlayFadeDelay = T.quoteDelay + T.quoteFadeIn + T.quoteHold;
    overlayStyle = {
      animation: `uc-overlay-out ${T.overlayFadeOut}s ease-in ${overlayFadeDelay}s both`,
    };
    totalMs = (overlayFadeDelay + T.overlayFadeOut) * 1000 + 100;
  } else {
    // Snappy 2.5s sequence
    titleStyle = {
      animation: `uc-title-in 0.4s ease-out 0s both`,
    };
    quoteStyle = {
      animation: `uc-quote-in 0.4s ease-out 0.2s both`,
    };
    overlayStyle = {
      animation: `uc-overlay-out 0.5s ease-in 2s both`,
    };
    totalMs = 2500 + 100;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalMs);
    return () => clearTimeout(timer);
  }, [onComplete, totalMs]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        pointerEvents: 'all',
        ...overlayStyle,
      }}
    >
      {/* Subtle radial glow behind text */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Rank title ── */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', ...titleStyle }}>
        {isNewUnlock && (
          <p style={{
            fontSize: 'clamp(10px, 1.5vw, 13px)',
            fontWeight: 900,
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: 'rgba(139,92,246,0.7)',
            marginBottom: '1rem',
            fontFamily: 'monospace',
          }}>
            CONGRATULATIONS
          </p>
        )}

        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 72px)',
          fontWeight: 900,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          lineHeight: 1.05,
          background: 'linear-gradient(to right, #c4b5fd, #818cf8, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
          margin: 0,
        }}>
          {rankName}
        </h1>

        {isNewUnlock && (
          <p style={{
            fontSize: 'clamp(9px, 1.2vw, 11px)',
            fontWeight: 700,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'rgba(139,92,246,0.5)',
            marginTop: '1rem',
            fontFamily: 'monospace',
          }}>
            UNLOCKED
          </p>
        )}

        {/* Thin accent line */}
        <div style={{
          width: '60px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.6), transparent)',
          margin: '1.5rem auto 0',
        }} />
      </div>

      {/* ── Quote ── */}
      <div style={{
        position: 'relative',   /* CHANGED from absolute */
        marginTop: '3rem',      /* ADDED to push it below the title */
        zIndex: 1,
        textAlign: 'center',
        maxWidth: '500px',
        padding: '0 2rem',
        ...quoteStyle,
      }}>
        <p style={{
          fontSize: 'clamp(14px, 2.2vw, 22px)',
          fontStyle: 'italic',
          fontWeight: 600,
          color: 'rgba(196,181,253,0.85)',
          lineHeight: 1.5,
          letterSpacing: '0.02em',
        }}>
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* Corner accent — top-left */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        width: '40px',
        height: '40px',
        borderTop: '1px solid rgba(139,92,246,0.3)',
        borderLeft: '1px solid rgba(139,92,246,0.3)',
      }} />
      {/* Corner accent — bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        right: '2rem',
        width: '40px',
        height: '40px',
        borderBottom: '1px solid rgba(139,92,246,0.3)',
        borderRight: '1px solid rgba(139,92,246,0.3)',
      }} />
    </div>
  );
}
