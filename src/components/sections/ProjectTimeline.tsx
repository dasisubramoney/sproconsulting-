import { projects, projectYear, type Project } from '@/content/projects';
import { projectYearRange } from '@/content/stats';

/**
 * Projects page hero drawing: the project record as a timeline on a ground line.
 *
 * One copper square per project, stacked in its year's column. The year is the one the
 * list below groups it under (`projectYear`), so the stacks match the copper markers in
 * that list. A project that ran over several years gets a steel hairline back to its
 * start year. Year ticks sit under the ground line, longer at each decade, and a
 * dimension line spans the first year to the last. Built from `projects.ts`, so it
 * updates when a project is added.
 *
 * No text on the drawing (DESIGN.md "Motif"): the intro beside it gives the year range.
 *
 * Motion: above the fold, so it draws on with CSS on load (index.css `.draw`, `.draw-fill`,
 * `.draw-pop`): ground line and ticks first, then the squares pop in a wave from left to
 * right and upward, then the hairlines for the longer projects and the dimension line.
 * Every animation ends on the finished drawing, so no-JS and reduced motion show it complete.
 * Decorative: the page copy and the list carry the content.
 */

const { earliest, latest } = projectYearRange;
const SPAN = latest - earliest + 1;

// Geometry, in viewBox units.
const PITCH = 12; // column width per year
const SIZE = 8; // square side
const STEP = 10; // square plus gap, stacked upward
const PAD_X = 24; // ground line overshoot past the first and last columns
const TOP = 36; // room above the tallest stack for the crosshair

/**
 * Stack levels (0 = on the ground). Single-year projects stack first in their column.
 * Then each multi-year project, shortest span first, goes on the lowest level that clears
 * everything already drawn across its span, its own column included: squares and earlier
 * hairlines. So its hairline never crosses a square or another hairline, though its
 * square may float above its own stack.
 */
const isMultiYear = (p: Project) => p.startYear < projectYear(p);
const col = (year: number) => year - earliest;
const height = new Array<number>(SPAN).fill(0); // levels in use per column
const placed: Array<{ project: Project; col: number; level: number }> = [];

for (const project of projects.filter((p) => !isMultiYear(p))) {
  const c = col(projectYear(project));
  placed.push({ project, col: c, level: height[c]++ });
}
const spanOf = (p: Project) => projectYear(p) - p.startYear;
for (const project of projects.filter(isMultiYear).sort((a, b) => spanOf(a) - spanOf(b))) {
  const from = col(project.startYear);
  const to = col(projectYear(project));
  const level = Math.max(...height.slice(from, to + 1));
  placed.push({ project, col: to, level });
  for (let c = from; c <= to; c++) height[c] = level + 1;
}

const tallest = Math.max(...height);
const GROUND = TOP + tallest * STEP + 6;
const DIM_Y = GROUND + 26;
const WIDTH = PAD_X * 2 + SPAN * PITCH;
const HEIGHT = DIM_Y + 12;

const colX = (year: number) => PAD_X + (year - earliest) * PITCH + PITCH / 2;
/** Top edge of the square at `level` (0 = on the ground). */
const squareY = (level: number) => GROUND - 2 - (level + 1) * STEP + (STEP - SIZE);

const ticks = Array.from({ length: SPAN }, (_, i) => {
  const year = earliest + i;
  const x = colX(year);
  return `M${x} ${GROUND} V${GROUND + (year % 10 === 0 ? 8 : 4)}`;
}).join(' ');

const first = colX(earliest);
const last = colX(latest);
// Extension lines down from the ground at the first and last year, then the dimension
// line between them with end ticks.
const dimension = [
  `M${first} ${GROUND + 11} V${DIM_Y + 5} M${last} ${GROUND + 11} V${DIM_Y + 5}`,
  `M${first} ${DIM_Y} H${last}`,
  `M${first - 3} ${DIM_Y + 3} L${first + 3} ${DIM_Y - 3} M${last - 3} ${DIM_Y + 3} L${last + 3} ${DIM_Y - 3}`,
].join(' ');

const crosshair = `M${PAD_X + 2} ${TOP - 18} H${PAD_X + 22} M${PAD_X + 12} ${TOP - 28} V${TOP - 8}`;

/*
 * Square delays: 0.6s to 2.2s in 0.04s steps, once the ground and ticks are down. Square
 * (column c, level l) takes step c + l, so they fill in a wave from left to right and
 * upward. The CSP forbids style attributes (scripts/prerender.mjs), so each delay is a
 * class written out in full for Tailwind to find; past the last step they share it.
 */
const SQUARE_DELAYS = [
  '[--d:0.60s]', '[--d:0.64s]', '[--d:0.68s]', '[--d:0.72s]', '[--d:0.76s]', '[--d:0.80s]', '[--d:0.84s]',
  '[--d:0.88s]', '[--d:0.92s]', '[--d:0.96s]', '[--d:1.00s]', '[--d:1.04s]', '[--d:1.08s]', '[--d:1.12s]',
  '[--d:1.16s]', '[--d:1.20s]', '[--d:1.24s]', '[--d:1.28s]', '[--d:1.32s]', '[--d:1.36s]', '[--d:1.40s]',
  '[--d:1.44s]', '[--d:1.48s]', '[--d:1.52s]', '[--d:1.56s]', '[--d:1.60s]', '[--d:1.64s]', '[--d:1.68s]',
  '[--d:1.72s]', '[--d:1.76s]', '[--d:1.80s]', '[--d:1.84s]', '[--d:1.88s]', '[--d:1.92s]', '[--d:1.96s]',
  '[--d:2.00s]', '[--d:2.04s]', '[--d:2.08s]', '[--d:2.12s]', '[--d:2.16s]', '[--d:2.20s]',
] as const;
const squareDelay = (step: number) => SQUARE_DELAYS[Math.min(step, SQUARE_DELAYS.length - 1)];
// The last square lands by 2.65s (2.2s + the 0.45s pop), then hairlines at 2.7s and the
// dimension line at 2.9s.

export function ProjectTimeline({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={`h-auto fill-none ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Construction, in steel. */}
      <g className="stroke-steel-500" strokeWidth="1">
        <path pathLength={1} className="draw opacity-60 [--d:0s]" d={`M0 ${GROUND} H${WIDTH}`} />
        {/* Opacity on a wrapper: draw-fill animates opacity and would override it on the path. */}
        <g className="opacity-60">
          <path className="draw-fill [--d:0.3s]" d={ticks} />
        </g>
        <path pathLength={1} className="draw opacity-60 [--d:0.2s] [--dur:0.6s]" d={crosshair} />
      </g>

      {/* Projects: one copper square each, column by column. */}
      {placed.map(({ project, col: c, level }) => {
        const x = colX(earliest + c);
        const y = squareY(level);
        return (
          <g key={project.id}>
            {isMultiYear(project) && (
              // Hairline back to the start year, drawn right to left once the squares are in.
              <path
                pathLength={1}
                className="draw stroke-steel-500 opacity-60 [--d:2.7s] [--dur:0.7s]"
                strokeWidth="1"
                d={`M${x - SIZE / 2 - 2} ${y + SIZE / 2} H${colX(project.startYear)} M${colX(project.startYear)} ${y + SIZE / 2 - 3} V${y + SIZE / 2 + 3}`}
              />
            )}
            <rect
              x={x - SIZE / 2}
              y={y}
              width={SIZE}
              height={SIZE}
              className={`draw-pop fill-copper-500 ${squareDelay(c + level)}`}
            />
          </g>
        );
      })}

      {/* Dimension line, first year to last. */}
      <path
        pathLength={1}
        className="draw stroke-steel-500 opacity-60 [--d:2.9s] [--dur:0.8s]"
        strokeWidth="1"
        d={dimension}
      />
    </svg>
  );
}
