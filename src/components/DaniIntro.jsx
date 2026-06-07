import React, { useState, useEffect, useRef } from 'react';

// The 4-Minute Master Plan Script
const SCRIPT = [
    // ── [0:00] Intro: Acoustic guitar starts, cold terminal text ──
    "System initializing...",
    "Biometric signature recognized.",
    "Hello, wifey.",

    // ── [0:30] Acknowledging the Burnout ──
    "I know how heavy the pressure has felt lately.",
    "The endless algorithms, the late-night debugging, the weight of our goals...",
    "It is so easy to lose the spark when you are carrying the weight of the future.",
    "But babe, I built this arena so you never have to carry it alone.",

    // ── [1:10] The Distance & The Promises ──
    "Soon, I'll be boarding a flight to the UK.",
    "There will be oceans and time zones between us.",
    "But distance means absolutely nothing to a bond like ours.",
    "I am here for you, anytime, no matter the hour.",
    "Every time you log into this system, I am right beside you.",

    // ── [1:45] CHORUS SWELLS: "Baby, I'm dancing in the dark..." ──
    // ── VISUAL CUE 1: Portrait 1 (The Past/Present) slowly fades in at 15% opacity ──
    "We aren't just writing lines of code.",
    "Every problem we solve is a brick in the foundation of our empire.",
    "We are husband and wife. We fight as one.",
    "So promise me something.",
    "Promise me you will never quit. Never skip a day of the grind.",

    // ── [2:30] The Master Plan ──
    // ── VISUAL CUE 2: Portrait 1 fades out, Portrait 2 (The Future) fades in ──
    "When it gets hard, promise me you won't lose confidence.",
    "Trust the process. Trust our master plan.",
    "You secure that Big Tech role. I secure mine.",
    "We prove to our parents exactly what we are capable of.",
    "And then... the timeline converges.",

    // ── [3:10] The 2028 Vision ──
    "September 2028.",
    "You pack your bags. You board that flight.",
    "No more screens. No more waiting.",
    "Just you, me, and the life we fought so incredibly hard to build.",

    // ── [3:40] The Climax & Final Words ──
    "I am so incredibly proud of the woman you are.",
    "You are my partner, my soulmate, my everything.",
    "I love you, Dani, My Babe. More than words or code could ever express.",
    "Welcome to the Arena. Let's conquer the world together."
];

export default function DaniIntro({ onComplete, isReplay = false }) {
    const [hasStarted, setHasStarted] = useState(false);
    const [step, setStep] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [showPortrait1, setShowPortrait1] = useState(false);
    const [showPortrait2, setShowPortrait2] = useState(false);

    // Audio setup - replace 'your-music.mp3' with a real file in your public folder!
    const audioRef = useRef(new Audio('/Perfect.flac'));

    const beginCinematic = () => {
        setHasStarted(true);
        audioRef.current.volume = 0.5; // Set a nice cinematic volume
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    };

    // ESC to skip on replay
    useEffect(() => {
        if (!isReplay) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && hasStarted) {
                audioRef.current.pause();
                onComplete();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isReplay, hasStarted, onComplete]);

    // Cinematic timer logic
    useEffect(() => {
        if (!hasStarted) return;

        if (step < SCRIPT.length) {
            setIsFading(false);

            // Dual portrait crossfade triggers
            if (step === 11) setShowPortrait1(true);
            if (step === 18) {
                setShowPortrait1(false);
                setShowPortrait2(true);
            }

            // Hold each line for 7s to pace the 4:20 song
            const holdTimer = setTimeout(() => {
                setIsFading(true);
            }, 7000);

            // Advance to next line after 8.2s
            const nextStepTimer = setTimeout(() => {
                setStep(prev => prev + 1);
            }, 8200);

            return () => {
                clearTimeout(holdTimer);
                clearTimeout(nextStepTimer);
            };
        } else {
            let vol = audioRef.current.volume;
            const fadeAudio = setInterval(() => {
                if (vol > 0.05) {
                    vol -= 0.05;
                    audioRef.current.volume = vol;
                } else {
                    clearInterval(fadeAudio);
                    audioRef.current.pause();
                    onComplete();
                }
            }, 200);
        }
    }, [step, hasStarted, onComplete]);

    return (
        <div style={{ backgroundColor: '#000', fontFamily: 'sans-serif' }} className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">

            {/* Subtle Romantic Glow */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.05) 0%, transparent 60%)',
                pointerEvents: 'none'
            }} />

            {/* Portrait Layer 1 — The Past/Present */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: "url('/portrait-1.jpeg')",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center 25%',
                    opacity: showPortrait1 ? 0.15 : 0,
                    transition: 'opacity 8s ease-in-out',
                    pointerEvents: 'none'
                }}
            />

            {/* Portrait Layer 2 — The Future */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: "url('/portrait-2.jpeg')",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center 25%',
                    opacity: showPortrait2 ? 0.15 : 0,
                    transition: 'opacity 8s ease-in-out',
                    pointerEvents: 'none'
                }}
            />
            {!hasStarted ? (
                <button
                    onClick={beginCinematic}
                    style={{
                        padding: '1rem 3rem',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#fbbf24',
                        fontSize: '0.85rem',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.5s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.3)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.color = '#fbbf24'; }}
                >
                    [ Click to Initialize System ]
                </button>
            ) : (
                step < SCRIPT.length && (
                    <p
                        style={{
                            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                            fontWeight: 300,
                            color: '#fef3c7',
                            letterSpacing: '0.05em',
                            textAlign: 'center',
                            maxWidth: '800px',
                            lineHeight: 1.6,
                            opacity: isFading ? 0 : 1,
                            transform: isFading ? 'translateY(-10px)' : 'translateY(0)',
                            transition: 'opacity 1.5s ease, transform 1.5s ease',
                            textShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
                        }}
                    >
                        {SCRIPT[step]}
                    </p>
                )
            )}

            {/* ESC to Skip hint — only visible on replay */}
            {isReplay && hasStarted && (
                <div style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.5rem',
                    fontSize: '0.7rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(251, 191, 36, 0.35)',
                    pointerEvents: 'none',
                    userSelect: 'none'
                }}>
                    Press [ESC] to skip
                </div>
            )}
        </div>
    );
}