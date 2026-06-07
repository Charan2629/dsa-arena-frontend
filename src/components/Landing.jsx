import React, { useState, useEffect, useRef } from 'react';

// FIX 1: Move audio instances OUTSIDE the component so they are created exactly once.
// This prevents memory leaks and loading lag during re-renders.
const voiceAudio = typeof Audio !== 'undefined' ? new Audio('/system-online.mp3') : null;
const revealAudio = typeof Audio !== 'undefined' ? new Audio('/logo-loading.mp3') : null;
const enterAudio = typeof Audio !== 'undefined' ? new Audio('/enter-click.mp3') : null;

// Optimize loading settings
if (voiceAudio) voiceAudio.preload = 'auto';
if (revealAudio) revealAudio.preload = 'auto';
if (enterAudio) enterAudio.preload = 'auto';

export default function Landing({ onEnter }) {
    const [bootStage, setBootStage] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);

    // --- STAGE 0 to STAGE 1: The Unlock ---
    const handleUnlock = () => {
        if (voiceAudio && revealAudio && enterAudio) {
            // FIX 2: "Warm up" and authorize all audio tracks with the browser 
            // inside this valid user click handler. This bypasses asynchronous blocking.
            revealAudio.load();
            enterAudio.load();

            voiceAudio.volume = 0.8;
            voiceAudio.play().catch(e => console.log("Audio blocked", e));
        }
        setBootStage(1);
    };

    // --- STAGE 1 to STAGE 2: The 4-Second Loading Ticker ---
    useEffect(() => {
        if (bootStage === 1) {
            const duration = 4000;
            const startTime = Date.now();

            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const current = Math.min(Math.floor((elapsed / duration) * 100), 100);
                setProgress(current);

                if (current === 100) {
                    clearInterval(interval);

                    // FIX 3: Plays instantly because the file was pre-warmed during the initial click
                    if (revealAudio) {
                        revealAudio.volume = 0.6;
                        revealAudio.play().catch(e => console.log("Audio blocked", e));
                    }

                    setBootStage(2);
                }
            }, 30);
            return () => clearInterval(interval);
        }
    }, [bootStage]);

    // --- STAGE 2: Cinematic Button Fade ---
    useEffect(() => {
        if (bootStage === 2) {
            const timer = setTimeout(() => setShowButton(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [bootStage]);

    // --- FINAL TRIGGER: Enter The Arena ---
    const handleEnterClick = () => {
        if (enterAudio) {
            enterAudio.volume = 0.7;
            // FIX 4: Immediate playback hook
            enterAudio.play().catch(e => console.log("Audio blocked", e));
        }

        // Wait 600ms for the punchy impact sound before switching views
        setTimeout(() => {
            onEnter();
        }, 600);
    };

    // ==========================================
    // RENDER LOGIC (Keeps your flawless custom styles)
    // ==========================================

    if (bootStage === 0) {
        return (
            <div onClick={handleUnlock} style={{ backgroundColor: '#000000' }} className="min-h-screen flex items-center justify-center cursor-pointer">
                <p style={{ color: '#f59e0b', letterSpacing: '0.2em' }} className="font-mono animate-pulse text-sm md:text-base px-4 text-center">
                    [ INCOMING SYSTEM OVERRIDE... CLICK ANYWHERE TO ACCEPT ]
                </p>
            </div>
        );
    }

    if (bootStage === 1) {
        return (
            <div style={{ backgroundColor: '#000000' }} className="min-h-screen flex flex-col items-center justify-center">
                <div style={{ borderColor: '#1f2937', borderTopColor: '#f59e0b' }} className="w-16 h-16 border-4 rounded-full animate-spin mb-6"></div>
                <p style={{ color: '#f59e0b', letterSpacing: '0.2em' }} className="font-mono text-xl">
                    INITIALIZING... [ {progress}% ]
                </p>
            </div>
        );
    }

    return (
        <div
            style={{ backgroundColor: '#050505', fontFamily: 'sans-serif' }}
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden animate-fade-in"
        >
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% -20%, rgba(60, 45, 0, 0.4) 0%, transparent 60%)',
                pointerEvents: 'none'
            }} />

            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                pointerEvents: 'none'
            }} />

            <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
                <p
                    style={{ color: 'rgba(245,158,11,0.6)', letterSpacing: '0.4em' }}
                    className="text-[10px] md:text-xs font-bold uppercase mb-6 animate-pulse"
                >
                    Secure System Initialization
                </p>

                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(to right, #fef3c7, #f59e0b, #b45309)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 40px rgba(245, 158, 11, 0.15)',
                    margin: '0 0 1.5rem 0',
                    lineHeight: 1.1
                }}>
                    The DSA Arena
                </h1>

                <p
                    style={{ color: '#a3a3a3', letterSpacing: '0.05em' }}
                    className="text-sm md:text-base max-w-lg mb-16 font-light leading-relaxed"
                >
                    Master the algorithms. Break the limits. <br />
                    Two architects. One vault.
                </p>

                <div
                    className="transition-all duration-1000 ease-out transform"
                    style={{
                        opacity: showButton ? 1 : 0,
                        transform: showButton ? 'translateY(0)' : 'translateY(20px)'
                    }}
                >
                    <button
                        onClick={handleEnterClick}
                        style={{
                            padding: '1rem 3rem',
                            backgroundColor: 'rgba(20, 15, 0, 0.4)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#fbbf24',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.4s ease',
                            backdropFilter: 'blur(8px)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                            e.currentTarget.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.8)';
                            e.currentTarget.style.color = '#fef3c7';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(20, 15, 0, 0.4)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                            e.currentTarget.style.color = '#fbbf24';
                        }}
                    >
                        Enter The Arena
                    </button>
                </div>
            </div>
        </div>
    );
}