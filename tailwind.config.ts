import type { Config } from 'tailwindcss';

/**
 * Colours resolve to the CSS custom properties defined in app/globals.css, so
 * a single token override switches the whole site between paper and night.
 * Add new colours there first, then surface them here.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
          raised: 'rgb(var(--paper-raised) / <alpha-value>)',
          sunk: 'rgb(var(--paper-sunk) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          on: 'rgb(var(--accent-on) / <alpha-value>)',
        },
        state: {
          open: 'rgb(var(--state-open) / <alpha-value>)',
          warn: 'rgb(var(--state-warn) / <alpha-value>)',
          closed: 'rgb(var(--state-closed) / <alpha-value>)',
        },
        tone: {
          women: 'rgb(var(--tone-women) / <alpha-value>)',
          medical: 'rgb(var(--tone-medical) / <alpha-value>)',
          holding: 'rgb(var(--tone-holding) / <alpha-value>)',
          rdap: 'rgb(var(--tone-rdap) / <alpha-value>)',
        },
        rule: {
          DEFAULT: 'rgb(var(--rule-rgb) / var(--rule-a))',
          strong: 'rgb(var(--rule-rgb) / var(--rule-strong-a))',
        },
      },
      borderColor: {
        DEFAULT: 'var(--rule)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': 'var(--step--2)',
        xs: 'var(--step--1)',
        base: 'var(--step-0)',
        lg: 'var(--step-1)',
        xl: 'var(--step-2)',
        '2xl': 'var(--step-3)',
        '3xl': 'var(--step-4)',
        '4xl': 'var(--step-5)',
      },
      boxShadow: {
        raise: 'var(--shadow-raise)',
        lift: 'var(--shadow-lift)',
      },
      maxWidth: {
        prose: '66ch',
      },
      borderRadius: {
        // Squared-off by comparison with the old fully-pill language: the
        // logotype supplies the curves, the layout stays quiet.
        DEFAULT: '3px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
