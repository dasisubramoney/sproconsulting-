import { leadership, staff, type TeamMember } from '@/content/team';

/**
 * Team page hero drawing: the team as an electrical single-line diagram.
 *
 * Leadership is the incoming supply at the top (a transformer symbol), fed through a main
 * breaker onto a copper busbar. One branch drops off the busbar per discipline, each through
 * its own breaker, and every person in that discipline is a load node on the branch. A steel
 * dimension line along the bottom ticks off the branches. Built from `team.ts`, so adding a
 * person adds a node, and a new discipline adds a branch.
 *
 * Disciplines come from the role text (DISCIPLINES below, first match wins, which is also
 * the left-to-right order). A role that matches none still gets drawn, on an extra branch
 * at the end.
 *
 * Colour: symbols and construction in steel; the network (feeder, busbar, branches) and
 * the energised dot in each node in copper. No text on the drawing (DESIGN.md "Motif").
 *
 * Motion: above the fold, so it draws on with CSS on load (index.css `.draw`, `.draw-fill`,
 * `.draw-pop`): the supply and main breaker, the busbar out from the centre, then one branch
 * at a time, left to right, each dropping with its breaker and nodes before the next starts.
 * Then the dimension line, and last the supply is traced over in copper. Every animation
 * ends on the finished drawing, so no-JS and reduced motion show it complete. Decorative:
 * the page copy and the grid carry the content.
 */

/** Branch order, left to right. Matched against the role in this order; first match wins. */
const DISCIPLINES: ReadonlyArray<RegExp> = [
  /hvac/i,
  /mechanical|civil/i,
  /project manager/i,
  /\bcad\b/i,
  /\badmin/i,
];

const branches: TeamMember[][] = DISCIPLINES.map(() => []);
const other: TeamMember[] = [];
for (const member of staff) {
  const i = DISCIPLINES.findIndex((re) => re.test(member.role));
  (i === -1 ? other : branches[i]).push(member);
}
if (other.length) branches.push(other);
const groups = branches.filter((g) => g.length > 0);

// Geometry, in viewBox units (360 wide, like AboutLifecycle).
const WIDTH = 360;
const CX = WIDTH / 2;
const SPREAD = 300; // the span the branches may use
const MAX_PITCH = 75;
const pitch = groups.length > 1 ? Math.min(MAX_PITCH, SPREAD / (groups.length - 1)) : 0;
const branchX = (i: number) => CX + (i - (groups.length - 1) / 2) * pitch;
const firstX = branchX(0);
const lastX = branchX(Math.max(groups.length - 1, 0));

const SOURCE = { r: 10, upper: 40, lower: 54 }; // two overlapping circles: a transformer
const MAIN_BREAKER_Y = 84; // centre of the main breaker
const BUS = 108;
const BUS_OVERHANG = groups.length > 1 ? 14 : 30;
const BRANCH_BREAKER_Y = 124; // centre of each branch breaker
const FIRST_NODE = 154;

// Nodes sit 28 apart; a long branch closes them up so the run never exceeds RUN, which keeps
// the drawing's height bounded however large one discipline grows. Nodes shrink to suit.
const RUN = 112;
const deepest = Math.max(1, ...groups.map((g) => g.length));
const NODE_GAP = deepest > 1 ? Math.min(28, RUN / (deepest - 1)) : 28;
const NODE_R = Math.min(6, NODE_GAP * 0.4);
const DOT_R = NODE_R * 0.42;

const DIM_Y = FIRST_NODE + (deepest - 1) * NODE_GAP + 30;
const HEIGHT = DIM_Y + 14;

const nodeY = (j: number) => FIRST_NODE + j * NODE_GAP;
/** A breaker: a small square centred on (x, y). */
const breaker = (x: number, y: number, s: number) => `M${x - s / 2} ${y - s / 2} h${s} v${s} h${-s} Z`;

const hasSupply = leadership.length > 0;
const incoming = `M${CX} 10 V${SOURCE.upper - SOURCE.r}`;
// Without a supply symbol the feeder runs from the top edge instead.
const feeder = `M${CX} ${hasSupply ? SOURCE.lower + SOURCE.r : 10} V${BUS}`;
const busLeft = `M${CX} ${BUS} H${firstX - BUS_OVERHANG}`;
const busRight = `M${CX} ${BUS} H${lastX + BUS_OVERHANG}`;
const crosshair = 'M28 30 H48 M38 20 V40';
const dimension = [
  `M${firstX} ${DIM_Y} H${lastX}`,
  ...groups.map((_, i) => `M${branchX(i)} ${DIM_Y - 4} V${DIM_Y + 4}`),
].join(' ');

/*
 * Branch timing, in steps, one branch after another: a branch drops at step s, its breaker
 * pops at s + 1 and node j at s + 2 + j; the next branch drops one step after its last node.
 * Steps map onto DELAYS (0.05s apart from 1.30s, once the busbar is out). If the team grows
 * past the table, steps are scaled down to fit it, so the order holds (some neighbours may
 * share a delay) and the last node always lands by 3.15s (2.70s plus the 0.45s pop), before
 * the copper trace on the supply starts at 3.2s.
 *
 * The CSP forbids style attributes (scripts/prerender.mjs), so each delay is a class written
 * out in full for Tailwind to find.
 */
const DELAYS = [
  '[--d:1.30s]', '[--d:1.35s]', '[--d:1.40s]', '[--d:1.45s]', '[--d:1.50s]', '[--d:1.55s]', '[--d:1.60s]',
  '[--d:1.65s]', '[--d:1.70s]', '[--d:1.75s]', '[--d:1.80s]', '[--d:1.85s]', '[--d:1.90s]', '[--d:1.95s]',
  '[--d:2.00s]', '[--d:2.05s]', '[--d:2.10s]', '[--d:2.15s]', '[--d:2.20s]', '[--d:2.25s]', '[--d:2.30s]',
  '[--d:2.35s]', '[--d:2.40s]', '[--d:2.45s]', '[--d:2.50s]', '[--d:2.55s]', '[--d:2.60s]', '[--d:2.65s]',
  '[--d:2.70s]',
] as const;
const branchStart: number[] = [];
let nextStep = 0;
for (const group of groups) {
  branchStart.push(nextStep);
  nextStep += group.length + 2;
}
const lastStep = Math.max(nextStep - 1, 1); // the last node's step
const scale = Math.min(1, (DELAYS.length - 1) / lastStep);
const delay = (step: number) => DELAYS[Math.round(step * scale)];
// With today's team (5 branches, 10 people) the last node is step 19: 2.25s, landing by 2.70s.

export function TeamNetwork({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={`h-auto fill-none ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Construction, in steel. */}
      <path pathLength={1} className="draw stroke-steel-500 opacity-60 [--d:0s] [--dur:0.6s]" strokeWidth="1" d={crosshair} />

      {/* Supply: incoming line and transformer, in steel. One per drawing, standing for leadership. */}
      {hasSupply && (
        <g className="stroke-steel-500" strokeWidth="1.25">
          <path pathLength={1} className="draw [--d:0.1s] [--dur:0.5s]" d={incoming} />
          <circle pathLength={1} className="draw [--d:0.3s] [--dur:0.7s]" cx={CX} cy={SOURCE.upper} r={SOURCE.r} />
          <circle pathLength={1} className="draw [--d:0.4s] [--dur:0.7s]" cx={CX} cy={SOURCE.lower} r={SOURCE.r} />
        </g>
      )}

      {/* Feeder and busbar, in copper. The busbar draws out both ways from the centre. */}
      <g className="stroke-copper-500">
        <path pathLength={1} className="draw [--d:0.7s] [--dur:0.4s]" strokeWidth="1.25" d={feeder} />
        <path pathLength={1} className="draw [--d:1s] [--dur:0.5s]" strokeWidth="2.5" d={busLeft} />
        <path pathLength={1} className="draw [--d:1s] [--dur:0.5s]" strokeWidth="2.5" d={busRight} />
      </g>
      <path
        className="draw-pop fill-white stroke-steel-500 [--d:0.85s]"
        strokeWidth="1.25"
        d={breaker(CX, MAIN_BREAKER_Y, 10)}
      />

      {/* Branches: one per discipline, a breaker, then one load node per person. */}
      {groups.map((group, i) => {
        const x = branchX(i);
        const s = branchStart[i];
        return (
          <g key={group[0].id}>
            <path
              pathLength={1}
              className={`draw stroke-copper-500 [--dur:0.3s] ${delay(s)}`}
              strokeWidth="1.25"
              d={`M${x} ${BUS} V${nodeY(group.length - 1)}`}
            />
            <path
              className={`draw-pop fill-white stroke-steel-500 ${delay(s + 1)}`}
              strokeWidth="1.25"
              d={breaker(x, BRANCH_BREAKER_Y, 8)}
            />
            {group.map((member, j) => (
              <g key={member.id} className={`draw-pop ${delay(s + 2 + j)}`}>
                <circle cx={x} cy={nodeY(j)} r={NODE_R} className="fill-white stroke-steel-500" strokeWidth="1.25" />
                <circle cx={x} cy={nodeY(j)} r={DOT_R} className="fill-copper-500" />
              </g>
            ))}
          </g>
        );
      })}

      {/* Dimension line under the branches, a tick at each. */}
      <g className="opacity-60">
        <path className="draw-fill stroke-steel-500 [--d:3s]" strokeWidth="1" d={dimension} />
      </g>

      {/* Last, the supply is traced over in copper: the network is live. */}
      {hasSupply && (
        <g className="stroke-copper-500" strokeWidth="1.25">
          <circle pathLength={1} className="draw [--d:3.2s] [--dur:0.6s]" cx={CX} cy={SOURCE.upper} r={SOURCE.r} />
          <circle pathLength={1} className="draw [--d:3.3s] [--dur:0.6s]" cx={CX} cy={SOURCE.lower} r={SOURCE.r} />
        </g>
      )}
    </svg>
  );
}
