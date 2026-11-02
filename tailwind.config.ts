import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

/**
 * Design tokens — see DESIGN.md for usage rules (especially colour contrast).
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#252B72',
          50: '#EEF0FA',
          100: '#D9DCF2',
          200: '#B3B9E4',
          300: '#8189CF',
          400: '#535CB4',
          500: '#383F95',
          600: '#2D3482',
          700: '#252B72',
          800: '#1C2158',
          900: '#141840',
          950: '#0C0E28',
        },
        crimson: {
          DEFAULT: '#D92B25',
          50: '#FDEEED',
          100: '#FAD4D2',
          600: '#D92B25',
          700: '#B5221D',
        },
        maroon: {
          DEFAULT: '#8B2323',
        },
        ink: {
          DEFAULT: '#141840',
          muted: '#4A4F6A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F4F5F8',
          muted: '#E8EAF0',
        },
      },
      fontFamily: {
        sans: ['"Montserrat Variable"', '"Montserrat Fallback"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        display: ['clamp(2.5rem, 6vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '700' }],
        h2: ['clamp(1.625rem, 3.2vw, 2.375rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        eyebrow: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.18em', fontWeight: '600' }],
      },
      maxWidth: {
        content: '76rem',
        prose: '42rem',
      },
      boxShadow: {
        card: '0 1px 2px rgb(20 24 64 / 0.06), 0 8px 24px -12px rgb(20 24 64 / 0.18)',
      },
      keyframes: {
        'card-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'card-in': 'card-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
