import { useId } from 'react';

/**
 * "Blueprint to Reality": the home hero drawing, in 3D like the logo — three
 * extruded towers (front face, darker side face, lit top) and the copper S ribbon
 * with a dark underside, in the logo's charcoal-steel and copper.
 *
 * On load (pure CSS, so it draws from first paint without JS): steel construction
 * hairlines and the 3D wireframe of the towers and ribbon draw themselves, then the
 * discipline callouts pop in on copper leader lines, like notes on a CAD sheet.
 *
 * Then, still pure CSS on a timer (the build-* classes in index.css): the drawing swings
 * square in 3D while it fills with the logo colours — each tower fills from the ground
 * up, the copper ribbon sweeps in along the S, the render plate and services appear, and
 * the wireframe fades back. Being CSS, it never waits on JS or the scroll position.
 * With reduced motion the animations collapse to their end state: the finished drawing.
 *
 * Hand-written geometry, decorative.
 */

const GROUND = 420;
// Oblique depth: faces recede up and to the right, as in the logo.
const DX = 22;
const DY = -12;

// Front-face, side-face and top-face colours, lit from the left like the logo.
const towers = [
  {
    x: 250,
    y: 80,
    w: 64,
    front: ['steel.600', 'steel.800'],
    side: 'fill-ink',
    top: 'fill-steel-400',
    mullion: 'stroke-steel-400',
    outline: '[--d:0.35s]',
    rise: '[--d:1.3s]',
  },
  {
    x: 322,
    y: 140,
    w: 52,
    front: ['steel.400', 'steel.600'],
    side: 'fill-steel-800',
    top: 'fill-steel-200',
    mullion: 'stroke-steel-300',
    outline: '[--d:0.45s]',
    rise: '[--d:1.48s]',
  },
  {
    x: 382,
    y: 200,
    w: 44,
    front: ['copper.300', 'copper.500'],
    side: 'fill-copper-700',
    top: 'fill-copper-100',
    mullion: 'stroke-copper-200',
    outline: '[--d:0.55s]',
    rise: '[--d:1.66s]',
  },
] as const;

// Gradient stops need literal class names so Tailwind can see them.
const stop: Record<string, string> = {
  'steel.400': '[stop-color:theme(colors.steel.400)]',
  'steel.600': '[stop-color:theme(colors.steel.600)]',
  'steel.800': '[stop-color:theme(colors.steel.800)]',
  'copper.300': '[stop-color:theme(colors.copper.300)]',
  'copper.500': '[stop-color:theme(colors.copper.500)]',
};

const callouts = [
  { label: 'Fire Protection', dot: [300, 118], path: 'M300 118 V40 H330', text: [336, 45], d: '[--d:1.1s]' },
  { label: 'HVAC', dot: [366, 196], path: 'M366 196 H462', text: [468, 201], d: '[--d:1.2s]' },
  { label: 'Wet Services', dot: [348, 262], path: 'M348 262 H462', text: [468, 267], d: '[--d:1.3s]' },
  { label: 'Electrical', dot: [416, 330], path: 'M416 330 H462', text: [468, 335], d: '[--d:1.4s]' },
] as const;

const RIBBON = 'M30 440 C 150 436 236 404 214 336 C 194 272 96 280 104 212 C 112 146 214 128 296 72';
// The S-curve the render plate is revealed along (a wide stroke inside a mask).
const PLATE_SWEEP = 'M120 470 C 250 470 270 330 330 250 C 390 170 410 50 560 30';
// Cable-tray rungs.
const rungs = Array.from({ length: 15 }, (_, i) => `M${252 + i * 12} 324 V330`).join(' ');

/** Front, side and top faces of an extruded tower. */
function faces(x: number, y: number, w: number) {
  return {
    front: `M${x} ${GROUND} V${y} H${x + w} V${GROUND}Z`,
    side: `M${x + w} ${y} L${x + w + DX} ${y + DY} V${GROUND + DY} L${x + w} ${GROUND}Z`,
    top: `M${x} ${y} L${x + DX} ${y + DY} H${x + w + DX} L${x + w} ${y}Z`,
    // Visible wireframe edges: front outline, top/side outline, and the near top-right edge.
    wire: `M${x} ${GROUND} V${y} H${x + w} V${GROUND} M${x} ${y} L${x + DX} ${y + DY} H${x + w + DX} V${GROUND + DY} M${x + w} ${y} L${x + w + DX} ${y + DY}`,
  };
}

export function HeroBlueprint({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    // Outer wrapper: mouse depth (HeroMotion). Inner: scroll drift (useParallax).
    // Kept separate from each other and from the CSS animations inside. The <svg>
    // itself takes the 3D swing and tilt (HeroMotion).
    <div aria-hidden="true" className={`pointer-events-none ${className}`} data-depth="12">
      <div data-parallax="8">
        <svg viewBox="0 0 600 480" className="build-swing h-auto w-full fill-none" strokeLinecap="butt" data-blueprint>
          <defs>
            <linearGradient id={`plate-${id}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" className="[stop-color:theme(colors.steel.200)]" />
              <stop offset="1" className="[stop-color:theme(colors.copper.100)]" />
            </linearGradient>
            <mask id={`plate-mask-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="480">
              <path d={PLATE_SWEEP} className="stroke-white" strokeWidth="420" data-bp="plate-sweep" />
            </mask>
            {towers.map((t, i) => (
              <linearGradient key={t.x} id={`front-${i}-${id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" className={stop[t.front[0]]} />
                <stop offset="1" className={stop[t.front[1]]} />
              </linearGradient>
            ))}
            {/* Copper ribbon face: dark copper at the base to light at the top, like the logo. */}
            <linearGradient id={`ribbon-${id}`} gradientUnits="userSpaceOnUse" x1="30" y1="440" x2="296" y2="72">
              <stop offset="0" className="[stop-color:theme(colors.copper.700)]" />
              <stop offset="0.55" className="[stop-color:theme(colors.copper.500)]" />
              <stop offset="1" className="[stop-color:theme(colors.copper.300)]" />
            </linearGradient>
          </defs>

          {/* Built layer 0: the render plate behind the building, revealed through an S-curve.
              TODO: client project render/photo — replace this tinted plate with an <image>. */}
          <g className="build-fade [--d:2s] [--dur:1s]" data-bp="plate">
            <rect
              x="232"
              y="48"
              width="236"
              height="372"
              fill={`url(#plate-${id})`}
              opacity="0.5"
              mask={`url(#plate-mask-${id})`}
            />
          </g>

          {/* Built layer 1: the 3D towers, back to front so nearer fronts cover the sides behind.
              Each fills with colour from the ground line up. */}
          <g data-bp="planes">
            {/* Ground shadow, cast to the right. */}
            <path
              className="build-fade fill-ink opacity-10 [--d:1.4s]"
              d={`M250 ${GROUND} L${250 + DX} ${GROUND + DY} H520 L498 ${GROUND}Z`}
            />
            {towers.map((t, i) => {
              const f = faces(t.x, t.y, t.w);
              const third = t.w / 3;
              return (
                <g key={t.x} className={`build-rise ${t.rise}`} data-bp-tower>
                  <path d={f.side} className={t.side} />
                  <path d={f.top} className={t.top} />
                  <path d={f.front} fill={`url(#front-${i}-${id})`} />
                  {/* Panel divisions on the front face, as in the logo. */}
                  <path
                    className={`${t.mullion} opacity-50`}
                    strokeWidth="1.5"
                    d={`M${t.x + third} ${t.y + 6} V${GROUND} M${t.x + 2 * third} ${t.y + 6} V${GROUND}`}
                  />
                </g>
              );
            })}
          </g>

          {/* Built layer 2: building services on the tower fronts. */}
          <g className="build-fade [--d:2.4s] [--dur:0.6s]" data-bp="services" strokeWidth="1.5">
            {/* Fire: sprinkler branch with heads. */}
            <path className="stroke-copper-100" d="M256 112 H308" />
            <g className="fill-copper-100">
              {[264, 282, 300].map((x) => (
                <circle key={x} cx={x} cy="118" r="2.5" />
              ))}
            </g>
            {/* HVAC: duct run with a diffuser. */}
            <path className="stroke-steel-100" d="M256 190 H374 M256 202 H374 M366 202 l-6 8 M366 202 l6 8" />
            {/* Wet services: riser and branch. */}
            <path className="stroke-water-300" strokeWidth="2.5" d="M348 412 V150 M348 262 H392" />
            {/* Electrical: cable tray. */}
            <path className="stroke-steel-100" strokeWidth="1" d={`M256 324 H426 M256 330 H426 ${rungs}`} />
          </g>

          {/* Built layer 3: the copper S ribbon, a solid band with a dark underside, as in the logo. */}
          <g className="[--dur:1.3s]" data-bp="ribbon">
            <path
              pathLength={1}
              className="build-draw stroke-steel-800 [--d:1.7s]"
              strokeWidth="22"
              transform="translate(5 9)"
              d={RIBBON}
            />
            <path pathLength={1} className="build-draw [--d:1.7s]" stroke={`url(#ribbon-${id})`} strokeWidth="22" d={RIBBON} />
            <path
              pathLength={1}
              className="build-draw stroke-copper-200 [--d:1.85s]"
              strokeWidth="3"
              d="M30 434 C 150 430 230 400 208 336 C 188 276 90 282 98 212 C 106 142 210 122 292 66"
            />
          </g>

          {/* Linework (drawn on load; fades back once the building is built). */}
          <g className="build-fadeback [--d:3s]" data-bp="lines">
            <g className="stroke-steel-500 opacity-60" strokeWidth="1">
              <path pathLength={1} className="draw [--d:0s]" d="M161 347 A170 170 0 1 1 455 320" />
              <path pathLength={1} className="draw [--d:0.1s]" d="M10 420 H590" />
              <path pathLength={1} className="draw [--d:0.2s]" d="M240 24 V444" />
              <path pathLength={1} className="draw [--d:0.25s]" d="M458 110 V444" />
              <path pathLength={1} className="draw [--d:0.4s]" d="M250 458 H448 M250 450 V466 M448 450 V466" />
              <path pathLength={1} className="draw [--d:0.5s]" d="M104 150 H136 M120 134 V166" />
              <path pathLength={1} className="draw [--d:0.55s]" d="M528 380 H556 M542 366 V394" />
              <circle pathLength={1} className="draw [--d:0.6s]" cx="120" cy="150" r="5" />
            </g>
            <g className="draw-fill fill-steel-500 [--d:0.7s]">
              <circle cx="180" cy="135" r="3" />
              <circle cx="418" cy="128" r="3" />
              <circle cx="455" cy="320" r="3" />
            </g>
            {/* 3D wireframe of the towers. */}
            {towers.map((t) => (
              <path
                key={t.x}
                pathLength={1}
                className={`draw stroke-steel-500 ${t.outline}`}
                strokeWidth="1.25"
                strokeLinejoin="round"
                d={faces(t.x, t.y, t.w).wire}
              />
            ))}
            {/* Hairline outlines of the ribbon band (face and underside edge), set out before it is built. */}
            <path pathLength={1} className="draw stroke-copper-500 [--d:0.6s]" strokeWidth="1.25" d={RIBBON} />
            <path
              pathLength={1}
              className="draw stroke-steel-400 [--d:0.7s]"
              strokeWidth="1"
              transform="translate(5 9)"
              d={RIBBON}
            />
          </g>

          {/* Callouts with copper leader lines. Hidden on small screens, where they'd be too small to read. */}
          <g className="max-sm:hidden">
            {callouts.map((c) => (
              <g key={c.label} className={`draw-pop ${c.d}`}>
                <path className="stroke-copper-500" strokeWidth="1" d={c.path} />
                <circle className="fill-copper-500" cx={c.dot[0]} cy={c.dot[1]} r="3" />
                <text
                  x={c.text[0]}
                  y={c.text[1]}
                  className="fill-steel-700 text-[14px] font-semibold uppercase tracking-[0.12em]"
                >
                  {c.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
