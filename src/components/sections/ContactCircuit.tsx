/**
 * Contact page hero drawing: a single-line diagram from you to the office, as if sending
 * a message closed a circuit.
 *
 * The sender, a head-and-shoulders figure in a ring, sits top left. A feeder runs right from
 * it, then down through an isolator switch and a two-winding transformer, then right to the
 * office, a building in a ring. A dimension line along the bottom ticks off the sender, the
 * feeder and the office, and a registration crosshair marks the top right corner.
 *
 * Colour: the figure, building, rings, switch, transformer and construction lines in steel;
 * the live line, the pulse and the ring round the office in copper. No text on the drawing
 * (DESIGN.md "Motif"): the page copy says who is who.
 *
 * Motion: above the fold, so it draws on with CSS on load (index.css `.draw`, `.draw-fill`,
 * `.draw-pop`, and the `.circuit-*` classes): the two rings and the feeder draw, the
 * transformer and the switch's contacts (white rings, drawn over the line so the switch
 * still reads once it is copper) appear with the blade standing open, the blade closes,
 * then the line turns copper from the sender to the office with a copper pulse riding its
 * leading edge. The pulse passes behind the transformer, comes to rest under the office
 * ring and fades out as it arrives, and last a copper ring draws round the office. Every animation ends on the
 * finished drawing (switch closed, line copper), so no-JS and reduced motion show it
 * complete. Decorative: the page copy and the card carry the content.
 *
 * The live line's path is also the pulse's motion path, which index.css (`.circuit-pulse`)
 * has to hold as a literal: keep LIVE and that path the same.
 */

// Geometry, in viewBox units.
const WIDTH = 340;
const HEIGHT = 266;
const NODE_R = 24;
const SENDER = { cx: 44, cy: 44 };
const OFFICE = { cx: 296, cy: 214 };
const DROP_X = 200; // where the feeder turns down
const SWITCH = { top: 84, bottom: 116 }; // the blade pivots at the top contact
const TRANSFORMER = { upper: 154, lower: 174, r: 14 };
const DIM_Y = 256;

// The whole live path, from the sender's centre to the office's centre. Its ends sit under
// the two rings, which are filled white and drawn on top.
const LIVE = `M${SENDER.cx} ${SENDER.cy} H${DROP_X} V${OFFICE.cy} H${OFFICE.cx}`;
// The steel feeder: the same path, open across the switch.
const feeder = `M${SENDER.cx} ${SENDER.cy} H${DROP_X} V${SWITCH.top} M${DROP_X} ${SWITCH.bottom} V${OFFICE.cy} H${OFFICE.cx}`;
const blade = `M${DROP_X} ${SWITCH.top} V${SWITCH.bottom}`;

const crosshair = 'M300 20 H320 M310 10 V30';
const dimension = [
  `M${SENDER.cx} ${DIM_Y} H${OFFICE.cx}`,
  ...[SENDER.cx, DROP_X, OFFICE.cx].map((x) => `M${x} ${DIM_Y - 4} V${DIM_Y + 4}`),
].join(' ');

// The sender: a head-and-shoulders figure inside the ring.
const head = { cx: SENDER.cx, cy: SENDER.cy - 8, r: 6 };
const bust = `M${SENDER.cx - 12} ${SENDER.cy + 18} C${SENDER.cx - 12} ${SENDER.cy + 7} ${SENDER.cx - 7} ${SENDER.cy + 3} ${SENDER.cx} ${SENDER.cy + 3} C${SENDER.cx + 7} ${SENDER.cy + 3} ${SENDER.cx + 12} ${SENDER.cy + 7} ${SENDER.cx + 12} ${SENDER.cy + 18} Z`;

// The office: a tower with a lower wing, standing on a ground line, with floor lines.
const { cx: ox, cy: oy } = OFFICE;
const building = `M${ox - 10} ${oy + 18} V${oy - 14} H${ox + 4} V${oy + 18} M${ox + 4} ${oy - 4} H${ox + 12} V${oy + 18} M${ox - 12} ${oy + 18} H${ox + 12}`;
const floors = [-8, -2, 4, 10].map((dy) => `M${ox - 6} ${oy + dy} H${ox}`).join(' ');

export function ContactCircuit({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={`h-auto fill-none ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Construction, in steel. */}
      <path pathLength={1} className="draw stroke-steel-500 opacity-60 [--d:0s] [--dur:0.6s]" strokeWidth="1" d={crosshair} />
      <g className="opacity-60">
        <path className="draw-fill stroke-steel-500 [--d:2.2s]" strokeWidth="1" d={dimension} />
      </g>

      {/* The feeder, open across the switch. */}
      <path pathLength={1} className="draw stroke-steel-500 [--d:0.4s] [--dur:1s]" strokeWidth="1.25" d={feeder} />

      {/* The switch blade, which stands open, then closes. Its contacts are drawn over the
          live line further down, so the switch still reads once the line is copper. */}
      <g className="draw-fill [--d:0.9s]">
        <path
          className="circuit-close stroke-steel-500 [--d:1.4s] [transform-origin:200px_84px]"
          strokeWidth="1.5"
          d={blade}
        />
      </g>

      {/* Live: the line turns copper from the sender to the office, the pulse at its front. */}
      <path pathLength={1} className="circuit-run stroke-copper-500 [--d:1.8s]" strokeWidth="2" d={LIVE} />
      <g className="circuit-pulse [--d:1.8s]">
        <circle r={7} className="fill-copper-500 opacity-30" />
        <circle r={3.5} className="fill-copper-500 stroke-white" strokeWidth="1" />
      </g>

      {/* The switch's two contacts: white rings over the line. */}
      <g className="draw-pop fill-white stroke-steel-500 [--d:0.9s]" strokeWidth="1.25">
        <circle cx={DROP_X} cy={SWITCH.top} r={3.5} />
        <circle cx={DROP_X} cy={SWITCH.bottom} r={3.5} />
      </g>

      {/* Transformer: two overlapping windings, filled white so the line and the pulse pass
          behind them. */}
      <g className="fill-white">
        <circle cx={DROP_X} cy={TRANSFORMER.upper} r={TRANSFORMER.r} />
        <circle cx={DROP_X} cy={TRANSFORMER.lower} r={TRANSFORMER.r} />
      </g>
      <g className="stroke-steel-500" strokeWidth="1.25">
        <circle pathLength={1} className="draw [--d:0.8s] [--dur:0.6s]" cx={DROP_X} cy={TRANSFORMER.upper} r={TRANSFORMER.r} />
        <circle pathLength={1} className="draw [--d:0.9s] [--dur:0.6s]" cx={DROP_X} cy={TRANSFORMER.lower} r={TRANSFORMER.r} />
      </g>

      {/* The sender and the office, each in a white-filled ring over the line's ends. */}
      <g className="fill-white stroke-steel-500" strokeWidth="1.25">
        <circle pathLength={1} className="draw [--d:0.1s] [--dur:0.7s]" {...SENDER} r={NODE_R} />
        <circle pathLength={1} className="draw [--d:0.2s] [--dur:0.7s]" {...OFFICE} r={NODE_R} />
      </g>
      <g className="draw-fill stroke-steel-500 [--d:0.5s]" strokeWidth="1.25">
        <circle {...head} />
        <path d={bust} />
        <path d={building} />
        <path d={floors} strokeWidth="1" />
      </g>

      {/* Last, a copper ring draws round the office as the current arrives. */}
      <g className="opacity-60">
        <circle
          pathLength={1}
          className="draw stroke-copper-500 [--d:3.1s] [--dur:0.8s]"
          strokeWidth="1"
          {...OFFICE}
          r={NODE_R + 6}
        />
      </g>
    </svg>
  );
}
