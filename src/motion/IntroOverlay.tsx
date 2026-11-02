import { useEffect } from 'react';

/** Matches the CSS: the intro is fully gone after 0.8s + 0.4s (see .intro in index.css). */
const INTRO_MS = 1250;

/**
 * First-visit intro: the tower mark draws itself as blueprint line art, fills
 * with brand colour, then the panel slides away on the diagonal (~1.2 s).
 *
 * Pure CSS so it starts at first paint, before any JS: public/motion-gate.js sets
 * html[data-intro] once per session (never with reduced motion), and the CSS
 * only shows the overlay while that attribute is present. The page renders
 * underneath the whole time, so it never delays Largest Contentful Paint, and
 * the overlay hides itself even if the main bundle fails to load.
 *
 * Any key or tap skips it. Decorative, so hidden from assistive technology.
 * TODO: redraw from the official logo artwork once supplied (same as ui/Logo.tsx).
 */
export function IntroOverlay() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute('data-intro')) return;

    const end = () => {
      root.removeAttribute('data-intro');
      cleanup();
    };
    const timer = window.setTimeout(end, INTRO_MS);
    window.addEventListener('keydown', end);
    window.addEventListener('pointerdown', end);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', end);
      window.removeEventListener('pointerdown', end);
    }
    return cleanup;
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="intro-mark h-24 w-24 sm:h-32 sm:w-32" focusable="false">
        <g className="intro-fill">
          <rect x="9" y="4" width="10" height="30" className="fill-white" />
          <rect x="22" y="12" width="8" height="22" className="fill-navy-200" />
          <path d="M2 38 L38 18 L38 24 L8 40 Z" className="fill-crimson" />
        </g>
        <g className="intro-lines" fill="none" strokeWidth="0.35" strokeLinejoin="miter">
          <path pathLength={1} d="M9 34 V4 H19 V34 Z" className="stroke-white" />
          <path pathLength={1} d="M22 34 V12 H30 V34 Z" className="stroke-white" />
          <path pathLength={1} d="M2 38 L38 18 L38 24 L8 40 Z" className="stroke-white" />
        </g>
      </svg>
      <p className="intro-hint text-xs font-medium uppercase tracking-[0.18em] text-navy-100">
        Press any key or tap to skip
      </p>
    </div>
  );
}
