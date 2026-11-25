import type { ReactNode } from 'react';
import { leadership, staff, type TeamMember } from '@/content/team';

/**
 * Team page hero drawing: the team as an org board of people.
 *
 * Each leader is a larger head-and-shoulders figure at the top (side by side if there are
 * several). A copper line runs down from each to a copper rail, and one branch drops off the rail per discipline to a small trade
 * icon in a ring: a fan for HVAC, a gear for mechanical and civil, a hard hat for project
 * management, a set square for CAD, a folder for admin. Under each icon stands one figure
 * per person in that discipline. A steel dimension line along the bottom ticks off the
 * branches. Built from `team.ts`, so a new hire adds a figure and a new discipline a branch.
 *
 * Disciplines come from the role text (DISCIPLINES below, first match wins, which is also
 * the left-to-right order). A role that matches none still gets drawn, on an extra branch
 * at the end, under a ring holding a small copper circle.
 *
 * Colour: figures, icon rings and construction in steel; the lines, the trade icons and the
 * ring round each leader in copper. No text on the drawing (DESIGN.md "Motif").
 *
 * Motion: above the fold, so it draws on with CSS on load (index.css `.draw`, `.draw-fill`,
 * `.draw-pop`): the leaders' figures, the lines down and the rail out from the centre, then
 * one branch at a time, left to right: its line drops, its icon pops once the line arrives,
 * its people pop down the column, and the next branch starts as the last figure settles.
 * Then the dimension line, and last a copper ring draws round each leader.
 * Every animation ends on the finished drawing, so no-JS and reduced motion show it complete.
 * Decorative: the page copy and the grid carry the content.
 *
 * `.draw-pop` animates a CSS transform, which would override an SVG `transform` attribute on
 * the same element, so anything placed with `transform` pops on an inner group.
 */

type Icon = 'fan' | 'gear' | 'hat' | 'square' | 'folder' | 'ring';

/** Branch order, left to right. Matched against the role in this order; first match wins. */
const DISCIPLINES: ReadonlyArray<{ match: RegExp; icon: Icon }> = [
  { match: /hvac/i, icon: 'fan' },
  { match: /mechanical|civil/i, icon: 'gear' },
  { match: /project manager/i, icon: 'hat' },
  { match: /\bcad\b/i, icon: 'square' },
  { match: /\badmin/i, icon: 'folder' },
];

const branches = DISCIPLINES.map(({ icon }) => ({ icon, people: [] as TeamMember[] }));
const other = { icon: 'ring' as Icon, people: [] as TeamMember[] };
for (const member of staff) {
  const i = DISCIPLINES.findIndex(({ match }) => match.test(member.role));
  (i === -1 ? other : branches[i]).people.push(member);
}
const groups = [...branches, other].filter((g) => g.people.length > 0);

const n = (v: number) => Math.round(v * 100) / 100;

// Geometry, in viewBox units (360 wide, like AboutLifecycle).
const WIDTH = 360;
const CX = WIDTH / 2;
const SPREAD = 300; // the span the branches may use
const MAX_PITCH = 75;
const pitch = groups.length > 1 ? Math.min(MAX_PITCH, SPREAD / (groups.length - 1)) : 0;
const branchX = (i: number) => CX + (i - (groups.length - 1) / 2) * pitch;
const firstX = branchX(0);
const lastX = branchX(Math.max(groups.length - 1, 0));

/** A head-and-shoulders figure, `s` times the staff size, its head's top at `top`. */
function person(cx: number, top: number, s: number) {
  const r = 5 * s;
  const neck = top + 2 * r + 2 * s;
  const base = top + 24 * s;
  const w = 10 * s;
  return {
    head: { cx: n(cx), cy: n(top + r), r: n(r) },
    bust: `M${n(cx - w)} ${n(base)} C${n(cx - w)} ${n(neck + 3 * s)} ${n(cx - w * 0.6)} ${n(neck)} ${n(cx)} ${n(neck)} C${n(cx + w * 0.6)} ${n(neck)} ${n(cx + w)} ${n(neck + 3 * s)} ${n(cx + w)} ${n(base)} Z`,
    base,
  };
}

// Leaders: one larger figure each, 60 apart, centred, each inside a copper ring.
const LEAD_SCALE = 1.4;
const LEAD_PITCH = 60;
const leaders = leadership.map((member, k) => {
  const cx = CX + (k - (leadership.length - 1) / 2) * LEAD_PITCH;
  return { id: member.id, cx, fig: person(cx, 14, LEAD_SCALE), ring: { cx: n(cx), cy: 31, r: 24 } };
});
const RAIL = 80;
const RAIL_OVERHANG = groups.length > 1 ? 14 : 30;
const ICON_Y = 104;
const ICON_R = 11;
const FIRST_PERSON = 124; // top of the first figure's head under each icon

// Figures stand 32 apart; a long column closes them up so it never exceeds RUN, which keeps
// the drawing's height bounded however large one discipline grows. Close-packed figures
// overlap like a crowd, each lower one in front.
const RUN = 96;
const deepest = Math.max(1, ...groups.map((g) => g.people.length));
const GAP = deepest > 1 ? Math.min(32, RUN / (deepest - 1)) : 32;
const personTop = (j: number) => FIRST_PERSON + j * GAP;

const DIM_Y = personTop(deepest - 1) + 24 + 18;
const HEIGHT = DIM_Y + 14;

// A line from the foot of each leader's figure to the rail; without leaders, one line from
// the top edge instead. The rail spans the branches and the leaders, whichever is wider.
const feeders = leaders.length
  ? leaders.map((l) => `M${n(l.cx)} ${n(l.fig.base)} V${RAIL}`).join(' ')
  : `M${CX} 10 V${RAIL}`;
const railFrom = Math.min(firstX - RAIL_OVERHANG, ...leaders.map((l) => l.cx - RAIL_OVERHANG));
const railTo = Math.max(lastX + RAIL_OVERHANG, ...leaders.map((l) => l.cx + RAIL_OVERHANG));
const railLeft = `M${CX} ${RAIL} H${n(railFrom)}`;
const railRight = `M${CX} ${RAIL} H${n(railTo)}`;
const crosshair = 'M28 30 H48 M38 20 V40';
const dimension = [
  `M${n(firstX)} ${DIM_Y} H${n(lastX)}`,
  ...groups.map((_, i) => `M${n(branchX(i))} ${DIM_Y - 4} V${DIM_Y + 4}`),
].join(' ');

// Gear teeth: eight short spokes outside the gear's rim.
const gearTeeth = Array.from({ length: 8 }, (_, k) => {
  const a = (k * Math.PI) / 4;
  return `M${n(Math.cos(a) * 4.5)} ${n(Math.sin(a) * 4.5)} L${n(Math.cos(a) * 7)} ${n(Math.sin(a) * 7)}`;
}).join(' ');

/** Trade icons, drawn about the origin inside a radius of 7, in copper. */
const ICONS: Record<Icon, ReactNode> = {
  fan: (
    <>
      <circle r={1.5} />
      {[0, 120, 240].map((deg) => (
        // One leaf-shaped blade, turned to each third.
        <path key={deg} transform={`rotate(${deg})`} d="M0 -1.5 C2.8 -2.5 3.6 -6.4 0.4 -7 C-2.2 -6.2 -1.6 -3.2 0 -1.5 Z" />
      ))}
    </>
  ),
  gear: (
    <>
      <circle r={4.5} />
      <circle r={1.6} />
      <path d={gearTeeth} />
    </>
  ),
  hat: <path d="M-7 3.5 H7 M-5 3.5 C-5 -4.5 5 -4.5 5 3.5 M0 -2.5 V3.5" />,
  square: <path d="M-5.5 5.5 V-5.5 L5.5 5.5 Z M-3 3 V-1.5 L1.5 3 Z" />,
  folder: <path d="M-6.5 -4.5 H-2 L0 -2.5 H6.5 V5 H-6.5 Z M-6.5 -0.5 H6.5" />,
  ring: <circle r={3} />,
};

/*
 * Branch timing, in 0.05s steps, one branch after another. A branch's line drops at step s
 * (0.2s long), its icon pops at s + 2 as the line arrives, and person j pops at s + 3 + j.
 * The next branch drops three steps (0.15s) after this branch's last person starts, when
 * that figure's 0.45s ease-out pop has all but settled.
 *
 * Steps map onto DELAYS, from 1.40s (when the rail is out) to 3.00s. If the team grows past
 * the table, steps are scaled down to fit it, so the order holds (branches then overlap a
 * little more) and the last figure always lands by 3.45s (3.00s plus the pop), before the
 * copper rings round the leaders start at 3.5s.
 *
 * The CSP forbids style attributes (scripts/prerender.mjs), so each delay is a class written
 * out in full for Tailwind to find.
 */
const DELAYS = [
  '[--d:1.40s]', '[--d:1.45s]', '[--d:1.50s]', '[--d:1.55s]', '[--d:1.60s]', '[--d:1.65s]', '[--d:1.70s]',
  '[--d:1.75s]', '[--d:1.80s]', '[--d:1.85s]', '[--d:1.90s]', '[--d:1.95s]', '[--d:2.00s]', '[--d:2.05s]',
  '[--d:2.10s]', '[--d:2.15s]', '[--d:2.20s]', '[--d:2.25s]', '[--d:2.30s]', '[--d:2.35s]', '[--d:2.40s]',
  '[--d:2.45s]', '[--d:2.50s]', '[--d:2.55s]', '[--d:2.60s]', '[--d:2.65s]', '[--d:2.70s]', '[--d:2.75s]',
  '[--d:2.80s]', '[--d:2.85s]', '[--d:2.90s]', '[--d:2.95s]', '[--d:3.00s]',
] as const;
const ICON_STEP = 2;
const FIRST_PERSON_STEP = 3;
const SETTLE_STEPS = 3;
const branchStart: number[] = [];
let lastStep = 0; // the last person's step
let nextStep = 0;
for (const group of groups) {
  branchStart.push(nextStep);
  lastStep = nextStep + FIRST_PERSON_STEP + group.people.length - 1;
  nextStep = lastStep + SETTLE_STEPS;
}
const scale = Math.min(1, (DELAYS.length - 1) / Math.max(lastStep, 1));
const delay = (step: number) => DELAYS[Math.round(step * scale)];
// With today's team (5 branches, 10 people) the last person is step 32: 3.00s, landing by 3.45s.

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

      {/* Leaders: a larger figure each at the top. */}
      {leaders.map((l) => (
        <g key={l.id} className="stroke-steel-500" strokeWidth="1.25">
          <circle pathLength={1} className="draw [--d:0.1s] [--dur:0.6s]" {...l.fig.head} />
          <path pathLength={1} className="draw [--d:0.25s] [--dur:0.7s]" d={l.fig.bust} />
        </g>
      ))}

      {/* Lines down and the rail, in copper. The rail draws out both ways from the centre. */}
      <g className="stroke-copper-500">
        <path pathLength={1} className="draw [--d:0.7s] [--dur:0.3s]" strokeWidth="1.25" d={feeders} />
        <path pathLength={1} className="draw [--d:0.9s] [--dur:0.5s]" strokeWidth="2" d={railLeft} />
        <path pathLength={1} className="draw [--d:0.9s] [--dur:0.5s]" strokeWidth="2" d={railRight} />
      </g>

      {/* Branches: one per discipline, its trade icon, then one figure per person. */}
      {groups.map((group, i) => {
        const x = branchX(i);
        const s = branchStart[i];
        return (
          <g key={group.people[0].id}>
            <path
              pathLength={1}
              className={`draw stroke-copper-500 [--dur:0.2s] ${delay(s)}`}
              strokeWidth="1.25"
              d={`M${n(x)} ${RAIL} V${ICON_Y - ICON_R}`}
            />
            <g transform={`translate(${n(x)} ${ICON_Y})`}>
              <g className={`draw-pop ${delay(s + ICON_STEP)}`}>
                <circle r={ICON_R} className="fill-white stroke-steel-500" strokeWidth="1.25" />
                <g className="stroke-copper-500" strokeWidth="1.1">
                  {ICONS[group.icon]}
                </g>
              </g>
            </g>
            {group.people.map((member, j) => {
              const fig = person(x, personTop(j), 1);
              return (
                <g
                  key={member.id}
                  className={`draw-pop fill-white stroke-steel-500 ${delay(s + FIRST_PERSON_STEP + j)}`}
                  strokeWidth="1.25"
                >
                  <path d={fig.bust} />
                  <circle {...fig.head} />
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Dimension line under the branches, a tick at each. */}
      <g className="opacity-60">
        <path className="draw-fill stroke-steel-500 [--d:3.3s]" strokeWidth="1" d={dimension} />
      </g>

      {/* Last, a copper ring draws round each leader. */}
      {leaders.map((l) => (
        <circle
          key={l.id}
          pathLength={1}
          className="draw stroke-copper-500 [--d:3.5s] [--dur:0.8s]"
          strokeWidth="1.25"
          {...l.ring}
        />
      ))}
    </svg>
  );
}
