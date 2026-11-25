/**
 * About page hero drawing: one two-storey building in section, cut into four bays that show
 * the stages from the intro copy, left to right. "From detail to commissioning":
 *
 *   1. Detailing: the outline in hidden (dashed) line, with dimensions and a crosshair.
 *   2. Design: the shell drawn solid, the services as dashed copper (design intent):
 *      a duct under the roof, a cable tray under the slab, lamp symbols (circle and cross).
 *   3. Supervision: under construction. The slab and cable tray are in, a scaffold stands on
 *      the upper floor, the roof is still open, and a tower crane lowers a roof beam.
 *   4. Commissioning: finished. Solid copper services, a rooftop unit fed by the duct,
 *      a distribution board, and the lamps lit.
 *
 * A copper dimension line along the bottom marks the four bays and ends in a check.
 *
 * Colour: the building, crane and construction lines in steel; the services and the
 * dimension line in copper. No text on the drawing (DESIGN.md "Motif").
 *
 * Motion: above the fold, so it draws on with CSS on load (index.css `.draw`, `.draw-fill`,
 * `.draw-pop`), one stage after the other, each finishing before the next starts, with the
 * dimension line drawing under each stage as it is drawn, then the check. Then it rests.
 * Every animation ends on the finished drawing, so no-JS and reduced motion show it complete.
 * Decorative: the page copy carries the content.
 */

// Section coordinates (viewBox 0 32 360 244): ground at y 230, roof at y 110, slab at y 170.
// Building x 30–330, four bays of 75 wide.
const BAYS = [30, 105, 180, 255, 330] as const;
const ROOF = 110;
const SLAB = 170;
const GROUND = 230;
const DUCT = [120, 127] as const;
const TRAY = 178;
const RULE = 258;

const ground = `M4 ${GROUND} H356`;
// Stage divisions: faint lines between the bays, overshooting the building.
const divisions = BAYS.slice(1, -1)
  .map((x) => `M${x} 96 V244`)
  .join(' ');

// 1. Detailing.
const hiddenOutline = `M30 ${GROUND} V${ROOF} H105 M30 ${SLAB} H105`;
const crosshair = 'M58 50 H78 M68 40 V60';
const widthDim = `M30 98 H105 M30 93 V103 M105 93 V103`;
const heightDim = `M16 ${ROOF} V${GROUND} M11 ${ROOF} H21 M11 ${SLAB} H21 M11 ${GROUND} H21`;

// 2. Design.
const shell2 = `M105 ${ROOF} H180`;
const slab2 = `M105 ${SLAB} H180`;
const duct2 = `M105 ${DUCT[0]} H180 M105 ${DUCT[1]} H180`;
const tray2 = `M105 ${TRAY} H180`;

/** Electrical drawing lamp symbol: a circle with a cross through it. */
const lamp = (cx: number, cy: number, r = 5) => {
  const d = Math.round(r * Math.SQRT1_2 * 10) / 10;
  return `M${cx - d} ${cy - d} L${cx + d} ${cy + d} M${cx + d} ${cy - d} L${cx - d} ${cy + d}`;
};
const LAMPS2 = [
  { cx: 142, cy: 146 },
  { cx: 142, cy: 198 },
];

// 3. Supervision.
const slab3 = `M180 ${SLAB} H255`;
const openRoof = `M180 ${ROOF} H255`;
const tray3 = `M180 ${TRAY} H255`;
// Scaffold tower on the upper floor: two standards, three ledgers, one brace.
const scaffold = `M194 ${SLAB} V122 M214 ${SLAB} V122 M190 152 H218 M190 136 H218 M190 122 H218 M194 ${SLAB} L214 152`;

// Tower crane: lattice mast at x 236–244, jib out over the open roof, counter-jib with weight.
const MAST = { l: 236, r: 244, top: 60 };
const mastSides = `M${MAST.l} ${GROUND} V${MAST.top} M${MAST.r} ${GROUND} V${MAST.top}`;
const mastLattice = (() => {
  const steps = [];
  for (let y = GROUND, i = 0; y > MAST.top; y -= 10, i++) {
    steps.push(`L${i % 2 ? MAST.l : MAST.r} ${Math.max(y - 10, MAST.top)}`);
  }
  return `M${MAST.l} ${GROUND} ${steps.join(' ')}`;
})();
const jib = `M164 ${MAST.top} H282 M240 ${MAST.top} V46 L164 ${MAST.top} M240 46 L282 ${MAST.top}`;
const counterweight = `M270 ${MAST.top} V70 H282 V${MAST.top}`;
// Trolley at x 200, hook line, slings, and the roof beam it carries.
const hook = `M200 ${MAST.top} V86 M200 86 L188 94 M200 86 L212 94`;
const beam = 'M184 94 H216 V99 H184 Z';

// 4. Commissioning.
const shell4 = `M255 ${ROOF} H330 V${GROUND}`;
const slab4 = `M255 ${SLAB} H330`;
// Duct runs to x 304, then up through the roof to the rooftop unit.
const duct4 = `M255 ${DUCT[0]} H300 V${ROOF} M255 ${DUCT[1]} H308 V${ROOF}`;
const rooftopUnit = `M290 ${ROOF} V96 H322 V${ROOF}`;
const FAN = { cx: 314, cy: 103, r: 3.5 };
const tray4 = `M255 ${TRAY} H330`;
// Distribution board on the ground floor, fed down the wall from the tray.
const board = 'M314 196 H324 V216 H314 Z M319 201 V211';
const boardFeed = `M319 ${TRAY} V196`;
const LAMPS4 = [
  { cx: 280, cy: 146 },
  { cx: 280, cy: 198 },
];
/** Three short rays below a lit lamp. */
const rays = (cx: number, cy: number) => `M${cx} ${cy + 8} V${cy + 13} M${cx - 6} ${cy + 7} L${cx - 9} ${cy + 11} M${cx + 6} ${cy + 7} L${cx + 9} ${cy + 11}`;

// Dimension line along the bottom: one segment per bay, ticks at each division.
const ruleSegment = (i: number) =>
  `${i === 0 ? `M${BAYS[0]} ${RULE - 5} V${RULE + 5} ` : ''}M${BAYS[i]} ${RULE} H${BAYS[i + 1]} M${BAYS[i + 1]} ${RULE - 5} V${RULE + 5}`;
const RULE_DELAYS = ['[--d:0.6s]', '[--d:1.3s]', '[--d:2.1s]', '[--d:3.2s]'] as const;
const CHECK = { cx: 346, cy: RULE, r: 8 };
const check = `M${CHECK.cx - 3.5} ${RULE + 0.5} L${CHECK.cx - 1} ${RULE + 3} L${CHECK.cx + 4} ${RULE - 3}`;

export function AboutLifecycle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 32 360 244" className={`h-auto fill-none ${className}`} strokeLinecap="round" strokeLinejoin="round">
      {/* Ground and stage divisions. */}
      <g className="stroke-steel-500" strokeWidth="1">
        <path pathLength={1} className="draw opacity-60 [--d:0s]" d={ground} />
        <g className="opacity-30">
          <path className="draw-fill [--d:0.1s]" strokeDasharray="2 4" d={divisions} />
        </g>
      </g>

      {/* 1. Detailing: hidden outline, dimensions, crosshair. */}
      <g className="stroke-steel-500" strokeWidth="1">
        <g className="opacity-70">
          <path className="draw-fill [--d:0.2s]" strokeWidth="1.25" strokeDasharray="4 4" d={hiddenOutline} />
        </g>
        <path pathLength={1} className="draw opacity-60 [--d:0.3s] [--dur:0.5s]" d={crosshair} />
        <path pathLength={1} className="draw opacity-60 [--d:0.35s] [--dur:0.4s]" d={widthDim} />
        <path pathLength={1} className="draw opacity-60 [--d:0.4s] [--dur:0.4s]" d={heightDim} />
      </g>

      {/* 2. Design: solid shell, services as dashed copper, lamp symbols. */}
      <g className="stroke-steel-500">
        <path pathLength={1} className="draw [--d:0.8s] [--dur:0.6s]" strokeWidth="1.25" d={shell2} />
        <path pathLength={1} className="draw opacity-50 [--d:0.85s] [--dur:0.6s]" strokeWidth="1" d={slab2} />
      </g>
      <g className="stroke-copper-500" strokeWidth="1">
        <path className="draw-fill [--d:1s]" strokeDasharray="3 3" d={duct2 + ' ' + tray2} />
        {LAMPS2.map((l) => (
          <g key={l.cy} className="draw-pop [--d:1.05s]">
            <circle cx={l.cx} cy={l.cy} r={5} />
            <path d={lamp(l.cx, l.cy)} />
          </g>
        ))}
      </g>

      {/* 3. Supervision: slab and tray in, roof open, scaffold, crane lowering a roof beam. */}
      <g className="stroke-steel-500">
        <path pathLength={1} className="draw opacity-50 [--d:1.5s] [--dur:0.6s]" strokeWidth="1" d={slab3} />
        <g className="opacity-30">
          <path className="draw-fill [--d:1.5s]" strokeWidth="1.25" strokeDasharray="4 4" d={openRoof} />
        </g>
        <path pathLength={1} className="draw opacity-70 [--d:1.65s] [--dur:0.7s]" strokeWidth="1" d={scaffold} />
        <path pathLength={1} className="draw [--d:1.6s] [--dur:0.8s]" strokeWidth="1" d={mastSides} />
        <path pathLength={1} className="draw opacity-60 [--d:1.7s] [--dur:0.8s]" strokeWidth="0.75" d={mastLattice} />
        <path pathLength={1} className="draw [--d:1.95s] [--dur:0.5s]" strokeWidth="1" d={jib} />
        <path className="draw-fill [--d:2.2s]" strokeWidth="1" d={counterweight} />
        <path pathLength={1} className="draw [--d:2.2s] [--dur:0.4s]" strokeWidth="1" d={hook} />
        <path className="draw-fill fill-white [--d:2.2s]" strokeWidth="1.25" d={beam} />
      </g>
      <path pathLength={1} className="draw stroke-copper-500 [--d:1.8s] [--dur:0.6s]" strokeWidth="1.25" d={tray3} />

      {/* 4. Commissioning: finished shell, live copper services, rooftop unit, board, lit lamps. */}
      <g className="stroke-steel-500">
        <path pathLength={1} className="draw [--d:2.7s] [--dur:0.8s]" strokeWidth="1.25" d={shell4} />
        <path pathLength={1} className="draw opacity-50 [--d:2.75s] [--dur:0.6s]" strokeWidth="1" d={slab4} />
        <path className="draw-fill [--d:3.1s]" strokeWidth="1.25" d={rooftopUnit} />
        <circle {...FAN} className="draw-fill [--d:3.1s]" strokeWidth="1" />
      </g>
      <g className="stroke-copper-500" strokeWidth="1.25">
        <path pathLength={1} className="draw [--d:2.9s] [--dur:0.6s]" d={duct4} />
        <path pathLength={1} className="draw [--d:2.9s] [--dur:0.6s]" d={tray4 + ' ' + boardFeed} />
        <path className="draw-fill [--d:3.2s]" strokeWidth="1" d={board} />
        {LAMPS4.map((l) => (
          <g key={l.cy} className="draw-pop [--d:3.3s]" strokeWidth="1">
            <circle cx={l.cx} cy={l.cy} r={5} />
            <path d={lamp(l.cx, l.cy)} />
          </g>
        ))}
        {LAMPS4.map((l) => (
          <path key={l.cy} className="draw-fill [--d:3.5s]" strokeWidth="1" d={rays(l.cx, l.cy)} />
        ))}
      </g>

      {/* Dimension line under the bays, each segment as its stage is drawn, then the check. */}
      <g className="stroke-copper-500" strokeWidth="1.25">
        {RULE_DELAYS.map((delay, i) => (
          <path key={delay} pathLength={1} className={`draw ${delay} [--dur:0.6s]`} d={ruleSegment(i)} />
        ))}
        <path pathLength={1} className="draw [--d:3.7s] [--dur:0.3s]" d={`M${BAYS[4]} ${RULE} H${CHECK.cx - CHECK.r}`} />
        <g className="draw-pop [--d:3.9s]">
          <circle {...CHECK} />
          <path d={check} />
        </g>
      </g>
    </svg>
  );
}
