import { useId } from 'react';

/**
 * "Blueprint to Reality": the home hero drawing.
 *
 * On load (pure CSS, so it draws from first paint without JS): steel construction
 * hairlines, tower outlines and a hairline copper ribbon draw themselves, then the
 * discipline callouts pop in on copper leader lines, like notes on a CAD sheet.
 *
 * On scroll (HeroMotion, GSAP scrub): the drawing is built — steel planes rise from
 * the ground line, the services runs appear, the solid copper ribbon sweeps in, a
 * render plate is revealed behind through an S-curve mask, and the linework fades
 * back. The "built" layers (.bp-solid) are written in their finished state, so
 * without JS or with reduced motion the completed drawing is shown.
 *
 * Hand-written paths, decorative.
 */

// Ground line y = 420. Towers stand on it, as in the logo.
const towers = [
  { x: 250, y: 80, w: 64, fill: 'fill-steel-700', outline: '[--d:0.35s]' },
  { x: 322, y: 140, w: 52, fill: 'fill-steel-500', outline: '[--d:0.45s]' },
  { x: 382, y: 200, w: 44, fill: 'fill-copper-400', outline: '[--d:0.55s]' },
];

const callouts = [
  { label: 'Fire Protection', dot: [300, 118], path: 'M300 118 V40 H330', text: [336, 45], d: '[--d:1.1s]' },
  { label: 'HVAC', dot: [366, 196], path: 'M366 196 H452', text: [458, 201], d: '[--d:1.2s]' },
  { label: 'Wet Services', dot: [348, 262], path: 'M348 262 H452', text: [458, 267], d: '[--d:1.3s]' },
  { label: 'Electrical', dot: [416, 330], path: 'M416 330 H452', text: [458, 335], d: '[--d:1.4s]' },
] as const;

const RIBBON = 'M30 440 C 150 436 236 404 214 336 C 194 272 96 280 104 212 C 112 146 214 128 296 72';
// The S-curve the render plate is revealed along (a wide stroke inside a mask).
const PLATE_SWEEP = 'M120 470 C 250 470 270 330 330 250 C 390 170 410 50 560 30';
// Cable-tray rungs.
const rungs = Array.from({ length: 15 }, (_, i) => `M${252 + i * 12} 324 V330`).join(' ');

export function HeroBlueprint({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    // Outer wrapper: mouse depth (HeroMotion). Inner: scroll drift (useParallax).
    // Kept separate from each other and from the CSS animations inside.
    <div aria-hidden="true" className={`pointer-events-none ${className}`} data-depth="12">
      <div data-parallax="8">
        <svg viewBox="0 0 600 480" className="h-auto w-full fill-none" strokeLinecap="butt" data-blueprint>
          <defs>
            <linearGradient id={`plate-${id}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" className="[stop-color:theme(colors.steel.200)]" />
              <stop offset="1" className="[stop-color:theme(colors.copper.100)]" />
            </linearGradient>
            <mask id={`plate-mask-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="480">
              <path d={PLATE_SWEEP} className="stroke-white" strokeWidth="420" data-bp="plate-sweep" />
            </mask>
          </defs>

          {/* Built layer 0: the render plate behind the building, revealed through an S-curve.
              TODO: client project render/photo — replace this tinted plate with an <image>. */}
          <g className="bp-solid" data-bp="plate">
            <rect
              x="232"
              y="48"
              width="216"
              height="372"
              fill={`url(#plate-${id})`}
              opacity="0.6"
              mask={`url(#plate-mask-${id})`}
            />
          </g>

          {/* Built layer 1: steel planes, rising from the ground line. */}
          <g className="bp-solid" data-bp="planes">
            {towers.map((t) => (
              <rect key={t.x} className={t.fill} x={t.x} y={t.y} width={t.w} height={420 - t.y} data-bp-tower />
            ))}
          </g>

          {/* Built layer 2: building services inside the towers. */}
          <g className="bp-solid" data-bp="services" strokeWidth="1.5">
            {/* Fire: sprinkler branch with heads. */}
            <path className="stroke-copper-100" d="M256 112 H308" />
            <g className="fill-copper-100">
              {[264, 282, 300].map((x) => (
                <circle key={x} cx={x} cy="118" r="2.5" />
              ))}
            </g>
            {/* HVAC: duct run with a diffuser. */}
            <path className="stroke-steel-100" d="M244 190 H380 M244 202 H380 M366 202 l-6 8 M366 202 l6 8" />
            {/* Wet services: riser and branch. */}
            <path className="stroke-water" strokeWidth="2.5" d="M348 412 V150 M348 262 H392" />
            {/* Electrical: cable tray. */}
            <path className="stroke-steel-100" strokeWidth="1" d={`M244 324 H432 M244 330 H432 ${rungs}`} />
          </g>

          {/* Built layer 3: the solid copper S ribbon sweeping past the towers, as in the logo. */}
          <g className="bp-solid" data-bp="ribbon">
            <path className="stroke-copper-700" strokeWidth="22" transform="translate(3 5)" d={RIBBON} />
            <path className="stroke-copper-500" strokeWidth="22" d={RIBBON} />
            <path
              className="stroke-copper-300"
              strokeWidth="3"
              d="M30 434 C 150 430 230 400 208 336 C 188 276 90 282 98 212 C 106 142 210 122 292 66"
            />
          </g>

          {/* Linework (drawn on load; fades back as the building is built). */}
          <g data-bp="lines">
            <g className="stroke-steel-500 opacity-60" strokeWidth="1">
              <path pathLength={1} className="draw [--d:0s]" d="M161 347 A170 170 0 1 1 455 320" />
              <path pathLength={1} className="draw [--d:0.1s]" d="M10 420 H590" />
              <path pathLength={1} className="draw [--d:0.2s]" d="M240 24 V444" />
              <path pathLength={1} className="draw [--d:0.25s]" d="M436 110 V444" />
              <path pathLength={1} className="draw [--d:0.4s]" d="M250 458 H426 M250 450 V466 M426 450 V466" />
              <path pathLength={1} className="draw [--d:0.5s]" d="M104 150 H136 M120 134 V166" />
              <path pathLength={1} className="draw [--d:0.55s]" d="M528 380 H556 M542 366 V394" />
              <circle pathLength={1} className="draw [--d:0.6s]" cx="120" cy="150" r="5" />
            </g>
            <g className="draw-fill fill-steel-500 [--d:0.7s]">
              <circle cx="180" cy="135" r="3" />
              <circle cx="418" cy="128" r="3" />
              <circle cx="455" cy="320" r="3" />
            </g>
            {towers.map((t) => (
              <path
                key={t.x}
                pathLength={1}
                className={`draw stroke-steel-500 ${t.outline}`}
                strokeWidth="1.25"
                d={`M${t.x} 420 V${t.y} H${t.x + t.w} V420`}
              />
            ))}
            {/* Hairline outline of the copper ribbon, set out before it is built. */}
            <path pathLength={1} className="draw stroke-copper-500 [--d:0.6s]" strokeWidth="1.25" d={RIBBON} />
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
