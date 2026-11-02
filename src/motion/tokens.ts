/**
 * Motion tokens: the single source of timing for GSAP, Framer Motion and CSS.
 * See DESIGN.md "Motion". The CSS keyframes in src/styles/index.css mirror these values.
 */

/** Seconds. */
export const duration = {
  ui: 0.2,
  /** One slash band crossing the screen in a route transition. */
  wipe: 0.24,
  reveal: 0.7,
  heading: 0.9,
  draw: 1.1,
  count: 1.6,
} as const;

/** GSAP eases: crisp and engineered, never bouncy. */
export const ease = {
  out: 'power3.out',
  expo: 'expo.out',
  inOut: 'power3.inOut',
} as const;

type Bezier = [number, number, number, number];

/** Cubic-bezier equivalents for Framer Motion and CSS. */
export const bezier: Record<'out' | 'inOut', Bezier> = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
};

/** Seconds between staggered elements. */
export const stagger = {
  items: 0.08,
  lines: 0.08,
  bands: 0.05,
} as const;

/** Pixels content travels when it reveals. */
export const distance = {
  reveal: 32,
} as const;

/** ScrollTrigger start position for scroll reveals. */
export const revealStart = 'top 88%';

/** The brand slash angle in degrees, rising left to right (DESIGN.md "Motif"). */
export const slashAngle = 20;

/** Route transition: the screen is fully covered after this many seconds. */
export const coverTime = duration.wipe + stagger.bands;
