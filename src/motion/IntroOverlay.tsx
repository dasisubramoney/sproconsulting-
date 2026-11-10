import { useEffect } from 'react';

/** Matches the CSS: the intro is fully gone after 0.85s + 0.35s (see .intro in index.css). */
const INTRO_MS = 1250;

// Fast versions of the shared draw classes (index.css) for the ~1.2 s intro.
const line = 'draw [--dur:0.45s]';

/**
 * First-visit intro, drawn from the elements of the approved logo: the construction
 * circle, crosshair, dimension ticks and ground line draw on, the copper S ribbon
 * traces in, the steel towers rise from the ground line, then the panel lifts away.
 * An interpretation of the logo's parts, not a redraw of the logo itself.
 *
 * Pure CSS so it starts at first paint, before any JS: public/motion-gate.js sets
 * html[data-intro] once per session (never with reduced motion), and the CSS
 * only shows the overlay while that attribute is present. The page renders
 * underneath the whole time, so it never delays Largest Contentful Paint, and
 * the overlay hides itself even if the main bundle fails to load.
 *
 * Any key or tap skips it. Decorative, so hidden from assistive technology.
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
      <svg viewBox="0 0 200 200" className="h-40 w-40 fill-none sm:h-56 sm:w-56" focusable="false">
        {/* Construction lines. */}
        <g className="stroke-steel-500" strokeWidth="0.6">
          <path pathLength={1} className={`${line} [--d:0s]`} d="M42 140 A70 70 0 1 1 168 118" />
          <path pathLength={1} className={`${line} [--d:0.05s]`} d="M8 160 H192" />
          <path pathLength={1} className={`${line} [--d:0.1s]`} d="M128 14 V172" />
          <path pathLength={1} className={`${line} [--d:0.15s]`} d="M34 58 H50 M42 50 V66" />
          <path pathLength={1} className={`${line} [--d:0.2s]`} d="M104 176 H166 M104 172 V180 M166 172 V180" />
        </g>
        {/* Steel towers rise from the ground line, the last one copper, as in the logo. */}
        <rect
          className="draw-rise fill-steel-700 [--d:0.5s] [--dur:0.35s]"
          x="104"
          y="50"
          width="22"
          height="110"
        />
        <rect
          className="draw-rise fill-steel-500 [--d:0.56s] [--dur:0.35s]"
          x="130"
          y="72"
          width="18"
          height="88"
        />
        <rect
          className="draw-rise fill-copper-400 [--d:0.62s] [--dur:0.35s]"
          x="152"
          y="96"
          width="14"
          height="64"
        />
        {/* The copper S ribbon. */}
        <path
          pathLength={1}
          className="draw stroke-copper-500 [--d:0.3s] [--dur:0.5s]"
          strokeWidth="12"
          d="M20 172 C 66 170 96 150 88 124 C 80 100 44 104 48 80 C 52 56 90 46 118 30"
        />
        <path
          pathLength={1}
          className="draw stroke-copper-300 [--d:0.38s] [--dur:0.5s]"
          strokeWidth="2"
          d="M20 168 C 64 166 92 148 84 124 C 80 100 40 104 44 80 C 48 56 86 44 116 27"
        />
      </svg>
      <p className="intro-hint text-xs font-medium uppercase tracking-[0.3em] text-steel-600">
        Press any key or tap to skip
      </p>
    </div>
  );
}
