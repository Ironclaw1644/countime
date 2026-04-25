import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F2',
          50: '#FDFBF7',
          100: '#F5F0E6',
          200: '#EBE4D4',
        },
        ink: {
          DEFAULT: '#1B2A3A',
          soft: '#2E3D4F',
          muted: '#5A6878',
        },
        sage: {
          DEFAULT: '#7B8F7A',
          deep: '#5C7059',
          soft: '#A6B6A4',
        },
        clay: {
          DEFAULT: '#C97B5B',
          deep: '#A55E3F',
          soft: '#E0A98C',
        },
        teal: {
          DEFAULT: '#2F5D62',
          deep: '#1F4347',
        },
        gold: {
          DEFAULT: '#C8A24A',
          deep: '#A28236',
        },
        pink: {
          DEFAULT: '#D88BA1',
          deep: '#B86A82',
          soft: '#EFC2D0',
        },
        slate: {
          DEFAULT: '#5F6F84',
          deep: '#42526A',
          soft: '#A6B1BF',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-public-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 1px 2px rgba(27,42,58,.06), 0 8px 24px -12px rgba(27,42,58,.18)',
        lift: '0 2px 4px rgba(27,42,58,.08), 0 24px 48px -20px rgba(27,42,58,.22)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'warm-mesh':
          'radial-gradient(ellipse 80% 50% at 50% -10%, #F5F0E6 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, #EBE4D4 0%, transparent 50%)',
      },
      maxWidth: {
        prose: '68ch',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      animation: {
        'pulse-soft': 'pulseSoft 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.2', transform: 'scale(1.6)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
