/**
 * Sustainability page hero drawing: a cutaway section through a three-storey building
 * showing its water and energy cycle, the same stages as "Follow the Water" below
 * (WaterNetwork.tsx): rain on the roof runs down the gutter and downpipe, through a
 * buried filter into an underground storage tank, and a pump returns it up a riser to
 * the fixtures on each floor. Solar panels on the roof feed a battery on the ground floor.
 *
 * Colour: water in `water`; the equipment (solar panels, filter, tank) and the energy
 * run in copper; the building, ground and fixtures in steel. No text on the drawing
 * (DESIGN.md "Motif").
 *
 * Motion: above the fold, so it draws on with CSS on load (index.css `.draw`, `.draw-fill`,
 * `.draw-rise`, `.draw-pop`): the structure first, then the cycle in the order the water
 * travels, finishing as the tank level rises once. Then it rests.
 * Every animation ends on the finished drawing, so no-JS and reduced motion show it complete.
 * Decorative: the page copy carries the content.
 */

// Section coordinates (viewBox 320 × 360): ground at y 250, building x 50–200,
// three storeys of 50 from the roof at y 100.
const FLOORS = [250, 200, 150] as const;

const ground = 'M4 250 H316';
const crosshair = 'M14 30 H34 M24 20 V40';
const shell = 'M50 250 V100 H200 V250';
const slabs = 'M50 150 H200 M50 200 H200';
// Excavation around the tank, drawn as a hidden (dashed) edge.
const pit = 'M206 250 V348 H304 V250';

// Storage tank (x 214–300, y 284–340) and its access shaft with a cover on the ground.
const tank = 'M217 284 H297 Q300 284 300 287 V337 Q300 340 297 340 H217 Q214 340 214 337 V287 Q214 284 217 284 Z';
const shaft = 'M276 284 V250 M292 284 V250 M272 247 H296';
const LEVEL = 304;
// Dimension on the water level, ticks at the level and the tank floor.
const dimension = `M308 ${LEVEL} H316 M308 340 H316 M312 ${LEVEL} V340`;

// Catchment: gutter, downpipe to the buried filter, filter outlet into the tank.
const gutter = 'M196 100 H214 V94';
const downpipe = 'M210 100 V262 H228';
const filterOutlet = 'M237 270 V284';
const filterMesh = 'M231 258 H243 L238 265 H236 Z';

// Reuse: from the pump out through the tank wall, under the building and up the riser,
// with a branch to a cistern on each floor.
const PUMP = { cx: 228, cy: 330, r: 5 };
const riser = `M${PUMP.cx - PUMP.r} ${PUMP.cy} H186 V136`;
const branches = FLOORS.map((f) => `M186 ${f - 14} H170`).join(' ');
const fixtures = FLOORS.map((f) => `M160 ${f - 22} H170 V${f - 8} H160 Z M157 ${f - 6} H173 L170 ${f} H160 Z`).join(' ');

// Energy: two tilted panels on the roof, cable down the inside of the wall to a battery.
const panel = (x: number) =>
  `M${x} 94 L${x + 30} 80 L${x + 32} 84 L${x + 2} 98 Z M${x + 4} 97 V100 M${x + 28} 86 V100`;
const panels = panel(60) + ' ' + panel(100);
const cable = 'M74 100 V221';
const battery = 'M62 224 H78 V246 H62 Z M66 224 V221 M74 224 V221 M66 232 H74 M66 238 H74';

// Sun, top right: a small disc with eight short rays.
const SUN = { cx: 290, cy: 40, r: 9 };
const rays = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const p = (rad: number) => `${Math.round((SUN.cx + Math.cos(a) * rad) * 10) / 10} ${Math.round((SUN.cy + Math.sin(a) * rad) * 10) / 10}`;
  return `M${p(13)} L${p(18)}`;
}).join(' ');

// Rain over the roof, slanting slightly, staggered heights. Delays written out for Tailwind.
const rain: Array<{ x: number; y: number; delay: string }> = [
  { x: 80, y: 44, delay: '[--d:0.9s]' },
  { x: 100, y: 58, delay: '[--d:0.96s]' },
  { x: 120, y: 40, delay: '[--d:1.02s]' },
  { x: 140, y: 54, delay: '[--d:1.08s]' },
  { x: 160, y: 46, delay: '[--d:1.14s]' },
  { x: 180, y: 60, delay: '[--d:1.2s]' },
  { x: 200, y: 42, delay: '[--d:1.26s]' },
];

export function SustainabilityCutaway({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 360"
      className={`h-auto fill-none ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Construction, in steel: ground line, crosshair, building shell and slabs, excavation, access shaft. */}
      <g className="stroke-steel-500" strokeWidth="1">
        <path pathLength={1} className="draw opacity-60 [--d:0s]" d={ground} />
        <path pathLength={1} className="draw opacity-60 [--d:0.1s]" d={crosshair} />
        <path pathLength={1} className="draw [--d:0.15s] [--dur:1.4s]" strokeWidth="1.25" d={shell} />
        <path pathLength={1} className="draw opacity-40 [--d:0.4s]" d={slabs} />
        {/* Opacity on a wrapper: draw-fill animates opacity and would override it on the path. */}
        <g className="opacity-50">
          <path className="draw-fill [--d:0.5s]" strokeDasharray="3 4" d={pit} />
        </g>
        <path pathLength={1} className="draw [--d:0.75s] [--dur:0.8s]" d={shaft} />
      </g>

      {/* Tank, in copper. */}
      <path pathLength={1} className="draw stroke-copper-500 [--d:0.6s]" strokeWidth="1.25" d={tank} />

      {/* Energy, in copper: sun, panels, cable, battery. */}
      <g className="stroke-copper-500" strokeWidth="1.25">
        <g className="draw-pop [--d:0.9s]">
          <circle {...SUN} />
          <path d={rays} strokeWidth="1" />
        </g>
        <path className="draw-fill [--d:1s]" d={panels} />
        <path pathLength={1} className="draw [--d:1.1s] [--dur:0.7s]" strokeWidth="1" d={cable} />
        <path className="draw-fill [--d:1.6s]" d={battery} />
      </g>

      {/* Rain, then the water's path in the order it travels. */}
      <g className="stroke-water" strokeWidth="1.25">
        {rain.map((r) => (
          <path key={r.x} className={`draw-fill ${r.delay}`} d={`M${r.x} ${r.y} l-4 10`} />
        ))}
        <path pathLength={1} className="draw [--d:1.2s] [--dur:0.8s]" d={gutter + ' ' + downpipe} />
      </g>

      {/* Filter, in copper. */}
      <g className="draw-fill stroke-copper-500 [--d:1.7s]" strokeWidth="1">
        <rect x="228" y="254" width="18" height="16" rx="1" className="fill-white" />
        <path d={filterMesh} />
      </g>

      <g className="stroke-water" strokeWidth="1.25">
        <path pathLength={1} className="draw [--d:1.8s] [--dur:0.3s]" d={filterOutlet} />
        <path pathLength={1} className="draw [--d:2s] [--dur:1s]" d={riser} />
        <path pathLength={1} className="draw [--d:2.6s] [--dur:0.4s]" d={branches} />
      </g>

      {/* Fixtures, in steel. */}
      <path className="draw-fill stroke-steel-500 [--d:2.8s]" strokeWidth="1" d={fixtures} />

      {/* Stored water: rises once to its level once the filter outlet reaches the tank,
          finishing last, as the dimension on the level draws. */}
      <g className="draw-rise [--d:2.1s] [--dur:1.4s]">
        <rect x="215" y={LEVEL} width="84" height={339 - LEVEL} className="fill-water/25" />
        <path className="stroke-water" strokeWidth="1.25" d={`M215 ${LEVEL} H299`} />
      </g>
      <path pathLength={1} className="draw stroke-steel-500 opacity-60 [--d:2.9s] [--dur:0.6s]" strokeWidth="1" d={dimension} />

      {/* Pump on the tank floor, over the water, just before the riser leaves it. */}
      <circle {...PUMP} className="draw-fill fill-white stroke-steel-500 [--d:1.9s]" strokeWidth="1.25" />
    </svg>
  );
}
