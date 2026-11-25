/**
 * Contact page hero drawing: a location plan of the office, like the key plan on a drawing.
 *
 * A schematic, not a survey: a main road across the top, a side road down from it, and
 * Heron Crescent looping off the side road, with building footprints in the blocks and a
 * canal down the right (Century City is built around canals). A copper route runs in from
 * the left edge along the roads and round the crescent to the office, which is shaded
 * copper with a pin on it and a ring round it. A north arrow and a scale bar finish the
 * sheet. It is not drawn to the real street layout or to the map pin in `company.ts`, so
 * it needs no updating if either changes; the live map further down is the real one.
 *
 * Colour: roads, buildings, north arrow and scale bar in steel; the canal in `water`; the
 * route, the office, the pin and its ring in copper. No text on the drawing (DESIGN.md
 * "Motif"): the address sits in the card below.
 *
 * Motion: above the fold, so it draws on with CSS on load (index.css `.draw`, `.draw-fill`,
 * `.draw-pop`): the grid fades in, the roads draw, the blocks, canal, north arrow and scale
 * bar fade in, then the route draws to the door, the office and its pin pop in, and last
 * the ring draws round it. Every animation ends on the finished drawing, so no-JS and
 * reduced motion show it complete. Decorative: the page copy and the card carry the content.
 *
 * `.draw-pop` animates a CSS transform, which would override an SVG `transform` attribute
 * on the same element, so the pin pops on an inner group.
 */

const WIDTH = 360;
const HEIGHT = 320;

// Faint construction grid, every 40 units.
const grid = [
  ...Array.from({ length: 8 }, (_, i) => `M${(i + 1) * 40} 0 V${HEIGHT}`),
  ...Array.from({ length: 7 }, (_, i) => `M0 ${(i + 1) * 40} H${WIDTH}`),
].join(' ');

// Main road (y 60–72) across the top; side road (x 96–108) down from it. Kerbs break where
// another road joins. Heron Crescent leaves the side road at y 120–132 and rejoins at 238–250.
// Its inner kerb (the ellipse rx 118, ry 53 about (108, 185)) breaks at x 182–190 for the
// office's entrance, where the route turns off.
const mainRoad = 'M0 60 H360 M0 72 H96 M108 72 H360';
const sideRoad = 'M96 72 V300 M108 72 V120 M108 132 V238 M108 250 V300';
const crescent =
  'M108 120 A130 65 0 0 1 108 250 M108 132 A118 53 0 0 1 182 143.7 M190 146.9 A118 53 0 0 1 108 238';

// Canal: two banks, gently curving down the right of the plan.
const canal = 'M314 72 C304 140 328 200 320 300 M326 72 C316 140 340 200 332 300';

/** Building footprints: [x, y, width, height]. */
const BUILDINGS: ReadonlyArray<readonly [number, number, number, number]> = [
  // North of the main road.
  [20, 22, 40, 26], [72, 22, 52, 26], [136, 22, 36, 26], [184, 22, 60, 26], [256, 22, 40, 26],
  // West of the side road.
  [20, 90, 56, 34], [20, 136, 56, 46], [20, 194, 56, 30], [20, 236, 56, 40],
  // Inside the crescent, beside the office.
  [120, 146, 24, 16], [120, 170, 18, 30], [120, 208, 24, 16], [152, 214, 24, 12],
  // East of the crescent, before the canal.
  [250, 92, 36, 30], [256, 170, 30, 40], [250, 262, 40, 24],
];
const buildings = BUILDINGS.map(([x, y, w, h]) => `M${x} ${y} h${w} v${h} h${-w} Z`).join(' ');

// The office, inside the crescent, centred on (174, 181); the pin stands on its centre. The
// ring clears the office's corners (26.1 out) and the blocks beside it (32 or more out).
const OFFICE = { x: 152, y: 167, width: 44, height: 28 };
const PIN = { x: OFFICE.x + OFFICE.width / 2, y: OFFICE.y + OFFICE.height / 2 + 3 };
const RING = { cx: PIN.x, cy: OFFICE.y + OFFICE.height / 2, r: 30 };

// Route along the road centrelines: in from the left on the main road, down the side road,
// round the crescent (its centreline is the ellipse rx 124, ry 59 about (108, 185)) to a
// point above the office, then down through the kerb's entrance gap to its door.
const route = `M0 66 H102 V126 A124 59 0 0 1 186 139.1 V${OFFICE.y}`;

// Teardrop pin with its tip at the origin and its head centred 16 above.
const pinShape = 'M0 0 C-3 -6 -8 -10 -8 -16 A8 8 0 1 1 8 -16 C8 -10 3 -6 0 0 Z';

// North arrow, top right: a ring with a half-filled arrowhead pointing up.
const NORTH = { cx: 336, cy: 32, r: 13 };
const northOutline = `M${NORTH.cx} ${NORTH.cy - 11} L${NORTH.cx + 6} ${NORTH.cy + 9} L${NORTH.cx} ${NORTH.cy + 4} L${NORTH.cx - 6} ${NORTH.cy + 9} Z`;
const northHalf = `M${NORTH.cx} ${NORTH.cy - 11} L${NORTH.cx} ${NORTH.cy + 4} L${NORTH.cx - 6} ${NORTH.cy + 9} Z`;

// Scale bar, bottom left: four segments, alternately filled, with end and mid ticks. It ends
// at x 84, clear of the side road's mouth (x 96–108).
const SCALE = { x: 20, y: 306, seg: 16, h: 4 };
const scaleOutline = `M${SCALE.x} ${SCALE.y} h${SCALE.seg * 4} v${SCALE.h} h${-SCALE.seg * 4} Z`;
const scaleFilled = [0, 2]
  .map((i) => `M${SCALE.x + i * SCALE.seg} ${SCALE.y} h${SCALE.seg} v${SCALE.h} h${-SCALE.seg} Z`)
  .join(' ');
const scaleTicks = [0, 2, 4].map((i) => `M${SCALE.x + i * SCALE.seg} ${SCALE.y - 4} V${SCALE.y}`).join(' ');

export function ContactLocation({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={`h-auto fill-none ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Construction grid. Opacity on wrappers: draw-fill animates opacity. */}
      <g className="opacity-25">
        <path className="draw-fill stroke-steel-500 [--d:0s] [--dur:0.8s]" strokeWidth="0.75" strokeDasharray="1 3" d={grid} />
      </g>

      {/* Roads, in steel. */}
      <g className="stroke-steel-500" strokeWidth="1.25">
        <path pathLength={1} className="draw [--d:0.1s] [--dur:0.9s]" d={mainRoad} />
        <path pathLength={1} className="draw [--d:0.3s] [--dur:0.9s]" d={sideRoad} />
        <path pathLength={1} className="draw [--d:0.5s] [--dur:1s]" d={crescent} />
      </g>

      {/* Blocks and the canal. */}
      <g className="opacity-60">
        <path className="draw-fill stroke-steel-500 [--d:0.9s] [--dur:0.7s]" strokeWidth="1" d={buildings} />
      </g>
      <g className="opacity-70">
        <path className="draw-fill stroke-water [--d:1s] [--dur:0.7s]" strokeWidth="1" d={canal} />
      </g>

      {/* North arrow and scale bar. */}
      <g className="draw-fill stroke-steel-500 [--d:1.1s] [--dur:0.6s]" strokeWidth="1">
        <circle {...NORTH} className="opacity-60" />
        <path d={northHalf} className="fill-steel-500" />
        <path d={northOutline} />
        <path d={scaleFilled} className="fill-steel-500" />
        <path d={scaleOutline} />
        <path d={scaleTicks} />
      </g>

      {/* The route to the door, in copper. */}
      <path pathLength={1} className="draw stroke-copper-500 [--d:1.4s] [--dur:1.1s]" strokeWidth="2" d={route} />

      {/* The office, then its pin. */}
      <rect
        {...OFFICE}
        className="draw-pop fill-copper-50 stroke-copper-500 [--d:2.3s]"
        strokeWidth="1.25"
      />
      <g transform={`translate(${PIN.x} ${PIN.y})`}>
        <g className="draw-pop [--d:2.45s]">
          <path d={pinShape} className="fill-copper-500 stroke-white" strokeWidth="1" />
          <circle cy={-16} r={3} className="fill-white" />
        </g>
      </g>

      {/* Last, a copper ring draws round the office. */}
      <g className="opacity-60">
        <circle pathLength={1} className="draw stroke-copper-500 [--d:2.8s] [--dur:0.8s]" strokeWidth="1" {...RING} />
      </g>
    </svg>
  );
}
