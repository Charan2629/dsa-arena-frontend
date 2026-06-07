import { useState } from 'react';
import { toast } from 'react-toastify';

const PWD_KEY = 'dani_vault_pwd';

export default function MemoryCoreButton({ activeP1, triggerReplay }) {
  // Only visible for Dani
  if (!activeP1?.username?.toLowerCase().includes('dani')) return null;

  const [mode, setMode] = useState(null); // null | 'set' | 'enter'
  const [input, setInput] = useState('');

  const openVault = () => {
    const existing = localStorage.getItem(PWD_KEY);
    setInput('');
    setMode(existing ? 'enter' : 'set');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = localStorage.getItem(PWD_KEY);

    if (mode === 'set') {
      if (!input.trim()) return;
      localStorage.setItem(PWD_KEY, input.trim());
      setMode(null);
      toast.success('Vault secured. Welcome to the Memory Core.', { theme: 'dark' });
      triggerReplay();
    } else {
      if (input === existing) {
        setMode(null);
        triggerReplay();
      } else {
        toast.error('Access Denied.', { theme: 'dark' });
        setInput('');
      }
    }
  };

  return (
    <>
      {/* ── The Vault Button ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0 0.5rem' }}>
        <button
          onClick={openVault}
          style={{
            background: 'transparent',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            color: 'rgba(245, 158, 11, 0.5)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            padding: '0.5rem 1.5rem',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            borderRadius: '2px',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.7)';
            e.currentTarget.style.color = '#fbbf24';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)';
            e.currentTarget.style.color = 'rgba(245, 158, 11, 0.5)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          [ Access Memory Core ]
        </button>
      </div>

      {/* ── Password Prompt Overlay ── */}
      {mode && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setMode(null); }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '4px',
              padding: '2rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              minWidth: '320px',
              boxShadow: '0 0 40px rgba(245, 158, 11, 0.08)',
            }}
          >
            <p style={{
              color: 'rgba(245,158,11,0.6)',
              fontSize: '0.65rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              textAlign: 'center',
              fontFamily: 'monospace',
            }}>
              {mode === 'set' ? '— Memory Core — Set Vault Password' : '— Memory Core — Enter Vault Password'}
            </p>

            <input
              type="password"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'set' ? 'Set your secure password...' : 'Enter vault password...'}
              style={{
                background: 'rgba(245,158,11,0.04)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '2px',
                color: '#fef3c7',
                padding: '0.6rem 1rem',
                fontSize: '0.875rem',
                outline: 'none',
                letterSpacing: '0.1em',
              }}
            />

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#fbbf24',
                  padding: '0.55rem',
                  fontSize: '0.7rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.3s',
                }}
              >
                {mode === 'set' ? 'Secure & Launch' : 'Authenticate'}
              </button>
              <button
                type="button"
                onClick={() => setMode(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)',
                  padding: '0.55rem 1rem',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: '2px',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
