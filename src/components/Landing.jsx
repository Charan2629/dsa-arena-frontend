import React, { useState, useEffect } from 'react';

export default function Landing({ onEnter }) {
    const [showButton, setShowButton] = useState(false);

    // Cinematic delay
    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            style={{ backgroundColor: '#050505', fontFamily: 'sans-serif' }}
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        >
            {/* Elegant Dark Gold Glow at Top */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% -20%, rgba(60, 45, 0, 0.4) 0%, transparent 60%)',
                pointerEvents: 'none'
            }} />

            {/* High-Tech Dotted Grid (Subtle & Professional, NOT harsh lines) */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                pointerEvents: 'none'
            }} />

            <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">

                {/* Subtitle */}
                <p
                    style={{ color: 'rgba(245,158,11,0.6)', letterSpacing: '0.4em' }}
                    className="text-[10px] md:text-xs font-bold uppercase mb-6 animate-pulse"
                >
                    Secure System Initialization
                </p>

                {/* Main Title - FORCED Gold Gradient & Shadow to kill the global cyan */}
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(to right, #fef3c7, #f59e0b, #b45309)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 40px rgba(245, 158, 11, 0.15)', /* Subtle, elegant gold glow */
                    margin: '0 0 1.5rem 0',
                    lineHeight: 1.1
                }}>
                    The DSA Arena
                </h1>

                {/* Philosophy */}
                <p
                    style={{ color: '#a3a3a3', letterSpacing: '0.05em' }}
                    className="text-sm md:text-base max-w-lg mb-16 font-light leading-relaxed"
                >
                    Master the algorithms. Break the limits. <br />
                    Two architects. One vault.
                </p>

                {/* Premium Gateway Button */}
                <div
                    className="transition-all duration-1000 ease-out transform"
                    style={{
                        opacity: showButton ? 1 : 0,
                        transform: showButton ? 'translateY(0)' : 'translateY(20px)'
                    }}
                >
                    <button
                        onClick={onEnter}
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