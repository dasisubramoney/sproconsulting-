import { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { ServiceSlug } from '@/config/routes';
import { services } from '@/content/services';
import { projects } from '@/content/projects';
import { useReducedMotion } from '@/motion/useReducedMotion';

/**
 * Services page hero: an isometric wireframe of a three-storey commercial building
 * with each discipline drawn where it lives, numbered like a drawing sheet, over a
 * title block whose rows link to the service pages and a caption for the lit one.
 *
 * On load (CSS, above the fold): the shell draws on, the services fade in, the tags pop.
 * Then one discipline at a time is lit in copper, with its title-block row and caption:
 * - held while its service card below, or its title-block row, is hovered or focused;
 * - otherwise cycling every 2.5 s while the sheet is on screen (never with reduced motion).
 * The lit discipline's runs flow and the lift car rides up (index.css "Services sheet").
 * Pre-rendered with nothing lit, so no-JS and reduced motion show the steel drawing at rest.
 *
 * Geometry is written in building coordinates (x along the right-hand face, y along
 * the left-hand face, z up) and projected isometrically. The drawing is decorative;
 * the title-block links are real and focusable.
 */

type Pt = readonly [number, number, number];

const K = Math.sqrt(3) / 2;
// Projection origin: the building's back corner at ground level, in viewBox units.
const OX = 150;
const OY = 172;

const r1 = (n: number) => Math.round(n * 10) / 10;
const sx = (x: number, y: number) => r1(OX + (x - y) * K);
const sy = (x: number, y: number, z: number) => r1(OY + (x + y) / 2 - z);
const at = ([x, y, z]: Pt) => `${sx(x, y)} ${sy(x, y, z)}`;

/** Open polyline through the points. */
const line = (...pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${at(p)}`).join(' ');

/** Edges of a box visible from the viewer (top face, and the +x and +y faces). */
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  return [
    line([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [x0, y0, z1]),
    line([x0, y1, z1], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x1, y0, z1]),
    line([x1, y1, z1], [x1, y1, z0]),
  ].join(' ');
}

/** Iso circle on a horizontal plane: an ellipse 1.22r wide, 0.71r tall. */
const isoEllipse = (x: number, y: number, z: number, rad: number) => ({
  cx: sx(x, y),
  cy: sy(x, y, z),
  rx: r1(rad * Math.SQRT2 * K),
  ry: r1(rad * Math.SQRT1_2),
});

// Building: 220 × 100 footprint, three storeys of 44.
const W = 220;
const D = 100;
const LEVELS = [0, 44, 88] as const;
const ROOF = 132;

const shell = box(0, W, 0, D, 0, ROOF);
// Hidden edges (dashed): the shell's back corner, and each slab's back edges.
const hidden = [
  line([0, D, 0], [0, 0, 0], [W, 0, 0]),
  line([0, 0, 0], [0, 0, ROOF]),
  ...[44, 88].map((z) => line([0, D, z], [0, 0, z], [W, 0, z])),
].join(' ');
// Slab edges on the two visible faces.
const slabs = [44, 88].map((z) => line([W, 0, z], [W, D, z], [0, D, z])).join(' ');
// Ground lines that overshoot the front corner, as in the logo's drawing.
const ground = line([-34, D, 0], [W + 34, D, 0]) + ' ' + line([W, -30, 0], [W, D + 34, 0]);

// Roof water tank (wet services), r 14.
const tank = { x: 192, y: 30, r: 14, z0: ROOF, z1: ROOF + 26 };
const tankTop = isoEllipse(tank.x, tank.y, tank.z1, tank.r);
const tankBase = isoEllipse(tank.x, tank.y, tank.z0, tank.r);
const tankBody = [
  `M${tankBase.cx - tankBase.rx} ${tankBase.cy} A${tankBase.rx} ${tankBase.ry} 0 0 0 ${tankBase.cx + tankBase.rx} ${tankBase.cy}`,
  `M${tankBase.cx - tankBase.rx} ${tankBase.cy} V${tankTop.cy}`,
  `M${tankBase.cx + tankBase.rx} ${tankBase.cy} V${tankTop.cy}`,
].join(' ');

// Rooftop air-handling unit (HVAC) with its fan.
const ahu = { x0: 36, x1: 96, y0: 12, y1: 42, z1: ROOF + 18 };
const fan = isoEllipse(60, 27, ahu.z1, 9);

interface Drawing {
  /** Fixed outlines: equipment, shafts. */
  outline: string;
  /** Runs that flow when lit (cable, pipe, duct), drawn in flow direction. */
  runs: string;
  /** Points (sprinkler heads, outlets) in screen coordinates. */
  dots?: ReadonlyArray<readonly [number, number]>;
  ellipses?: ReadonlyArray<ReturnType<typeof isoEllipse>>;
  /** Tag: anchor on the drawing and where the numbered tag sits (screen offset). */
  tag: { anchor: Pt; dx: number; dy: number };
}

const fireHeads = [36, 80, 124].flatMap((z) => [78, 94, 110, 126].map((x) => [x, 50, z - 5] as const));

const drawings: Record<ServiceSlug, Drawing> = {
  // LV kiosk outside, cable in under the slab, riser with a board on each floor.
  electrical: {
    outline: [
      box(30, 58, D + 24, D + 44, 0, 22),
      ...LEVELS.map((z) => box(38, 50, D - 15, D - 9, z + 14, z + 28)),
    ].join(' '),
    runs: line([44, D + 24, 0], [44, D - 12, 0], [44, D - 12, 120]),
    tag: { anchor: [30, D + 44, 22], dx: -34, dy: -18 },
  },
  // Lift shaft with its overrun above the roof.
  mechanical: {
    outline: box(150, 176, D - 34, D - 8, 0, ROOF + 14),
    runs: '',
    // Leader straight up from the overrun's front corner, between the AHU and the tank.
    tag: { anchor: [176, D - 8, ROOF + 14], dx: 0, dy: -50 },
  },
  // Fire riser with a sprinkler main and heads under each floor's ceiling.
  fire: {
    outline: '',
    runs: [line([135, 50, 0], [135, 50, 126]), ...LEVELS.map((z) => line([135, 50, z + 38], [70, 50, z + 38]))].join(' '),
    dots: fireHeads.map(([x, y, z]) => [sx(x, y), sy(x, y, z)] as const),
    tag: { anchor: [70, 50, LEVELS[2] + 38], dx: -96, dy: -6 },
  },
  // Rooftop AHU, duct down through the roof and along the top floor, two diffusers.
  hvac: {
    outline: [
      box(ahu.x0, ahu.x1, ahu.y0, ahu.y1, ROOF, ahu.z1),
      line([104, 27, 120], [101, 27, 114], [107, 27, 114], [104, 27, 120]),
      line([122, 27, 120], [119, 27, 114], [125, 27, 114], [122, 27, 120]),
    ].join(' '),
    runs: [
      line([84, 27, ROOF], [84, 27, 126], [134, 27, 126]),
      line([92, 27, ROOF], [92, 27, 120], [134, 27, 120]),
    ].join(' '),
    ellipses: [fan],
    tag: { anchor: [ahu.x0, ahu.y0, ahu.z1], dx: -30, dy: -26 },
  },
  // Roof tank, riser down with a branch on each floor, and the incoming main.
  'wet-services': {
    outline: tankBody,
    runs: [
      line([W + 28, 30, 0], [tank.x, 30, 0], [tank.x, 30, ROOF]),
      ...LEVELS.map((z) => line([tank.x, 30, z + 30], [tank.x, 62, z + 30])),
    ].join(' '),
    ellipses: [tankTop],
    tag: { anchor: [tank.x + tank.r, tank.y - tank.r, tank.z1], dx: 26, dy: -24 },
  },
};

function ServiceLayer({ d, overlay }: { d: Drawing; overlay: boolean }) {
  return (
    <>
      {d.outline && <path d={d.outline} />}
      {d.runs && <path d={d.runs} className={overlay ? 'svc-flow' : undefined} />}
      {d.ellipses?.map((e) => <ellipse key={`${e.cx}-${e.cy}`} {...e} />)}
      {d.dots && (
        <g className={`stroke-none ${overlay ? 'fill-copper-500' : 'fill-steel-500'}`}>
          {d.dots.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />
          ))}
        </g>
      )}
    </>
  );
}

// Lift car: at rest on the ground floor; the copper copy rides up two floors when lit.
const liftCar = box(153, 173, D - 31, D - 11, 2, 24);

const pad = (i: number) => String(i + 1).padStart(2, '0');
const projectCount = (slug: ServiceSlug) => projects.filter((p) => p.disciplines.includes(slug)).length;
const plural = (n: number) => `${n} project${n === 1 ? '' : 's'}`;

/** Time between disciplines while cycling, and the wait for the draw-on before the first. */
const CYCLE_MS = 2500;
const START_MS = 2400;
/** Matches html[data-intro] --intro-hold in index.css. */
const INTRO_HOLD_MS = 900;

interface ServicesSheetProps {
  /** A discipline to hold lit, e.g. while its service card is hovered or focused. */
  held?: ServiceSlug | null;
}

// Memoised: the page re-renders on every card hover, but only `held` matters here.
export const ServicesSheet = memo(function ServicesSheet({ held = null }: ServicesSheetProps) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [auto, setAuto] = useState(0);
  // Kept apart so leaving one row with the mouse never drops another row's focus hold.
  const [rowHover, setRowHover] = useState<number | null>(null);
  const [rowFocus, setRowFocus] = useState<number | null>(null);

  // Precedence: a card held from below, then the row under the pointer, then the focused row.
  const heldIndex = held ? services.findIndex((s) => s.slug === held) : -1;
  const holding = heldIndex >= 0 ? heldIndex : (rowHover ?? rowFocus);
  const cycling = holding === null && inView && drawn && !reduced;
  const active = holding ?? (cycling ? auto : null);

  // Cycling waits for the draw-on (and the first-visit intro, when it is playing).
  useEffect(() => {
    const hold = document.documentElement.hasAttribute('data-intro') ? INTRO_HOLD_MS : 0;
    const t = window.setTimeout(() => setDrawn(true), START_MS + hold);
    return () => window.clearTimeout(t);
  }, []);

  // Only cycles while on screen (the sheet is display:none below xl, so never there).
  useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!cycling) return;
    const id = window.setInterval(() => setAuto((a) => (a + 1) % services.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [cycling]);

  // When a hold ends, carry on cycling from the discipline that was held.
  useEffect(() => {
    if (holding !== null) setAuto(holding);
  }, [holding]);

  const on = (i: number) => (active === i ? '' : undefined);
  const lit = active === null ? null : services[active];

  return (
    <div ref={root} className="w-[25rem]">
      <svg
        aria-hidden="true"
        viewBox="0 0 400 356"
        className="pointer-events-none h-auto w-full fill-none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Construction: ground lines, hidden edges, slabs. */}
        <g className="stroke-steel-500" strokeWidth="1">
          <path pathLength={1} className="draw opacity-60 [--d:0s]" d={ground} />
          <path className="draw-fill opacity-50 [--d:0.5s]" strokeDasharray="3 4" d={hidden} />
          <path pathLength={1} className="draw opacity-40 [--d:0.4s] [--dur:1.4s]" d={slabs} />
          <path pathLength={1} className="draw [--d:0.15s] [--dur:1.4s]" strokeWidth="1.25" d={shell} />
        </g>

        {/* Services at rest, in steel. */}
        <g className="stroke-steel-500" strokeWidth="1">
          {services.map((s, i) => (
            <g key={s.slug} className={`draw-fill [--dur:0.6s] ${['[--d:1s]', '[--d:1.1s]', '[--d:1.2s]', '[--d:1.3s]', '[--d:1.4s]'][i]}`}>
              <ServiceLayer d={drawings[s.slug]} overlay={false} />
              {s.slug === 'mechanical' && <path d={liftCar} />}
            </g>
          ))}
        </g>

        {/* The same services in copper; the lit one shows. */}
        <g className="stroke-copper-500" strokeWidth="1.6">
          {services.map((s, i) => (
            <g key={s.slug} className="svc-hl" data-on={on(i)}>
              <ServiceLayer d={drawings[s.slug]} overlay />
              {s.slug === 'mechanical' && <path className="svc-lift" d={liftCar} />}
            </g>
          ))}
        </g>

        {/* Numbered tags on copper leaders, keyed to the title block. */}
        <g>
          {services.map((s, i) => {
            const { anchor, dx, dy } = drawings[s.slug].tag;
            const ax = sx(anchor[0], anchor[1]);
            const ay = sy(...anchor);
            const tx = ax + dx;
            const ty = ay + dy;
            return (
              <g key={s.slug} className={`draw-pop ${['[--d:1.5s]', '[--d:1.6s]', '[--d:1.7s]', '[--d:1.8s]', '[--d:1.9s]'][i]}`}>
                <path className="stroke-copper-500" strokeWidth="1" d={`M${ax} ${ay} L${tx} ${ty}`} />
                <circle className="fill-copper-500" cx={ax} cy={ay} r="2.2" />
                <circle className="fill-white stroke-copper-500" strokeWidth="1.25" cx={tx} cy={ty} r="10" />
                <text
                  x={tx}
                  y={ty}
                  dy="0.35em"
                  textAnchor="middle"
                  className="fill-copper-700 text-[9px] font-bold tabular-nums"
                >
                  {pad(i)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Title block: one link per discipline; hovering or focusing a row lights it. */}
      <nav aria-label="Service pages" className="mt-4">
        {/* role="list": Safari drops list semantics from list-style:none lists. */}
        <ul role="list" className="grid grid-cols-2 border-l border-t border-steel-200 text-[11px] font-semibold uppercase leading-none tracking-[0.12em]">
          {services.map((s, i) => (
            <li key={s.slug} className="border-b border-r border-steel-200">
              <Link
                to={`/services/${s.slug}`}
                className="relative flex items-center gap-3 px-3 py-2.5 text-steel-700"
                onMouseEnter={() => setRowHover(i)}
                onMouseLeave={() => setRowHover((h) => (h === i ? null : h))}
                onFocus={() => setRowFocus(i)}
                onBlur={() => setRowFocus((f) => (f === i ? null : f))}
              >
                <span aria-hidden="true" className="svc-hl absolute inset-0 border-l-2 border-copper-500 bg-copper-50" data-on={on(i)} />
                <span aria-hidden="true" className="relative tabular-nums text-copper-700">
                  {pad(i)}
                </span>
                <span className="relative">{s.title}</span>
              </Link>
            </li>
          ))}
          <li aria-hidden="true" className="flex items-center justify-between border-b border-r border-steel-200 px-3 py-2.5 text-steel-600">
            <span>Dwg S-00</span>
            <span>NTS</span>
          </li>
        </ul>
      </nav>

      {/* Caption for the lit discipline. Fixed height, so changing text never moves the
          layout. Hidden from assistive tech: it repeats the cards, and it changes on a timer. */}
      <div aria-hidden="true" className="h-[6rem] overflow-hidden border-x border-b border-steel-200 px-3 py-2.5">
        <div key={lit?.slug ?? 'all'} className="svc-caption">
          <p className="flex items-baseline justify-between text-[11px] font-semibold uppercase leading-none tracking-[0.12em]">
            <span className="text-steel-700">
              {lit ? (
                <>
                  <span className="tabular-nums text-copper-700">{pad(services.indexOf(lit))}</span>&ensp;{lit.title}
                </>
              ) : (
                'Building services'
              )}
            </span>
            <span className="tabular-nums text-steel-600">{plural(lit ? projectCount(lit.slug) : projects.length)}</span>
          </p>
          <p className="mt-2 line-clamp-3 text-xs leading-[1.125rem] text-steel-600">
            {lit ? lit.summary : 'Each discipline drawn where it sits in the building. Select one for its full scope.'}
          </p>
        </div>
      </div>
    </div>
  );
});
