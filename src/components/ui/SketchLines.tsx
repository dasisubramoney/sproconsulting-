interface SketchLinesProps {
  /**
   * Tailwind classes for the area the drawing occupies, e.g. "inset-y-0 right-0 w-[30%]".
   * It must not overlap any text (DESIGN.md "Motif").
   */
  region: string;
  /** Above the fold: draws with CSS on load. Otherwise GSAP DrawSVG draws it on scroll. */
  intro?: boolean;
}

// Hand-written construction geometry in the style of the logo's drawing.
const lines: Array<{ d: string; delay: string }> = [
  // Partial construction circle, left open at the bottom left.
  { d: 'M88 318 A132 132 0 1 1 330 250', delay: '[--d:0.1s]' },
  // Ground line that overshoots both edges.
  { d: 'M8 352 H392', delay: '[--d:0.2s]' },
  // Vertical construction line overshooting the circle.
  { d: 'M236 40 V372', delay: '[--d:0.3s]' },
  // Dimension line with end ticks.
  { d: 'M96 382 H332 M96 374 V390 M332 374 V390', delay: '[--d:0.45s]' },
  // Registration crosshairs.
  { d: 'M54 110 H86 M70 94 V126', delay: '[--d:0.55s]' },
  { d: 'M322 66 H350 M336 52 V80', delay: '[--d:0.6s]' },
];

/** Thin steel construction lines (circle, crosshairs, ticks, ground line). Decorative. */
export function SketchLines({ region, intro = false }: SketchLinesProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${region}`}>
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full fill-none stroke-steel-500 opacity-60"
        strokeWidth="1"
        data-sketch={intro ? undefined : ''}
      >
        {lines.map((line) => (
          <path
            key={line.d}
            d={line.d}
            pathLength={intro ? 1 : undefined}
            className={intro ? `draw ${line.delay}` : undefined}
          />
        ))}
        {/* Construction points on the circle. */}
        <g className={`fill-steel-500 stroke-none ${intro ? 'draw-fill [--d:0.9s]' : ''}`}>
          <circle cx="104" cy="122" r="2.5" />
          <circle cx="300" cy="104" r="2.5" />
          <circle cx="330" cy="250" r="2.5" />
        </g>
      </svg>
    </div>
  );
}
