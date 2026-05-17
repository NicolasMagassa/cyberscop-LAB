tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                orbitron: ['"Orbitron"', 'sans-serif'],
                pixel: ['"Press Start 2P"', 'cursive'],
                mono: ['"Share Tech Mono"', 'monospace'],
                body: ['"Rajdhani"', 'sans-serif'],
            },
            colors: {
                cyber: {
                    black: '#050505',
                    dark: '#0a0f14',     /* Fond principal Dark Mode */
                    panel: '#111827',    /* Fond des cartes Dark Mode */
                    green: '#00aa2c',
                    neonGreen: '#00ff41',
                    pink: '#d600d6',
                    neonPink: '#ff00ff',
                    blue: '#00b8c2',
                    darkerBlue: '#0096a0', /* Nouvelle couleur demandée */
                    neonBlue: '#00ffff',
                    purple: '#8a00bd',
                    red: '#ff003c'
                }
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
                'grid-pattern-dark': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
            },
            animation: {
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glitch': 'glitch 1s linear infinite',
                'scan': 'scan 4s linear infinite',
                'typing': 'typing 3.5s steps(40, end)',
                'blink-caret': 'blink-caret .75s step-end infinite',
            },
            keyframes: {
                glitch: {
                    '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                    '62%': { transform: 'translate(0,0) skew(5deg)' },
                },
                scan: {
                    '0%': { backgroundPosition: '0% 0%' },
                    '100%': { backgroundPosition: '0% 100%' },
                },
                typing: {
                    'from': { width: '0' },
                    'to': { width: '100%' }
                },
                'blink-caret': {
                    'from, to': { borderColor: 'transparent' },
                    '50%': { borderColor: '#00ff41' },
                }
            }
        }
    }
}
