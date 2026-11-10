import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

/**
 * Design tokens — see DESIGN.md for usage rules (especially colour contrast).
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Sampled from the approved logo (public/images/brand/SPRO_logo_clean.png).
      // Contrast rules: DESIGN.md "Colour". copper-500 is for large text and graphics only.
      colors: {
        ink: '#2B3238',
        paper: '#F7F5F2',
        steel: {
          50: '#F3F3F4',
          100: '#E6E8EA',
          200: '#D5DADF',
          300: '#A9B0B6',
          400: '#828C95',
          500: '#636F7B',
          600: '#586572',
          700: '#4D5B68',
          800: '#3C4750',
          900: '#2B3238',
        },
        copper: {
          50: '#F7F2ED',
          100: '#D8B492',
          200: '#D2A881',
          300: '#CB9C70',
          400: '#BF8C5C',
          500: '#B37B48',
          600: '#9E683C',
          700: '#88542F',
          800: '#674832',
          900: '#4C3E35',
        },
        // Desaturated steel-blue, derived from steel-500: only for graphics that must read as water.
        // 300 is the lighter highlight: the leading edge of flowing water and droplets.
        water: {
          DEFAULT: '#7E97A9',
          300: '#B4C4D0',
        },
        error: {
          DEFAULT: '#A33A2B',
          50: '#F9ECEA',
        },
      },
      fontFamily: {
        sans: ['"Montserrat Variable"', '"Montserrat Fallback"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        // Display and h1 at 800 to match the heavy "PRO" of the logo.
        display: ['clamp(2.5rem, 6vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1: ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '800' }],
        h2: ['clamp(1.625rem, 3.2vw, 2.375rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        // Widely tracked capitals, like "CONSULTING ENGINEERS" in the logo.
        eyebrow: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.3em', fontWeight: '600' }],
      },
      maxWidth: {
        content: '76rem',
        prose: '42rem',
      },
      boxShadow: {
        card: '0 1px 2px rgb(43 50 56 / 0.06), 0 8px 24px -12px rgb(43 50 56 / 0.18)',
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
