import type { ReactNode } from 'react';

/**
 * "Follow the Water" (Sustainability page): a steel pipe runs down the left gutter
 * through five stages. As the page scrolls, water flows down it and each stage's
 * section lights up when the water reaches it (src/motion/WaterMotion.tsx).
 *
 * Without JS or with reduced motion this is a static drawing: the pipe is full of
 * water and every stage is lit. The CSS for the unlit and flowing states is in
 * index.css ("Follow the Water"). Decorative: the content is in the sections.
 */

/** Stage labels, top to bottom. One per section, in page order. */
export const waterStages = ['Rainwater catchment', 'Filtration', 'Storage tank', 'Grey water reuse', 'Building'] as const;

/** Horizontal position shared by the pipe and the stage nodes: the middle of the left gutter. */
// Literal classes so Tailwind can see them.
const DROP_DELAYS = ['[--d:0s]', '[--d:0.3s]', '[--d:0.6s]', '[--d:0.9s]'];

const RAIL_X = 'left-[7px] lg:left-[calc(max(2rem,(100vw_-_76rem)/2_+_2rem)/2)]';

/** The pipe, the water in it and the leading edge. Place once, inside the [data-water] wrapper. */
export function WaterRail() {
  return (
    <div
      aria-hidden="true"
      data-water-rail
      className={`pointer-events-none absolute bottom-0 top-[92px] z-10 w-0 sm:top-[108px] lg:top-[112px] ${RAIL_X}`}
    >
      {/* Pipe walls */}
      <div className="absolute inset-y-0 -left-[3px] w-1.5 border-x border-steel-500" />
      {/* Water, revealed from the top (clip-path) as it flows */}
      <div data-water-flow className="water-flow absolute inset-y-0 -left-[2px] w-1 overflow-hidden">
        <div className="water-shimmer absolute inset-x-0 -top-10 bottom-0" />
      </div>
      {/* Leading edge, with droplets running into it (two on phones) */}
      <div data-water-head className="water-head absolute left-0 top-0">
        {DROP_DELAYS.map((delay, i) => (
          <span
            key={i}
            className={`water-drop absolute -left-[2px] -top-1 h-1 w-1 rounded-full bg-water-300 ${delay} ${
              i % 2 ? 'max-lg:hidden' : ''
            }`}
          />
        ))}
        <span className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 rounded-full bg-water-300 shadow-[0_0_10px_2px] shadow-water-300/70" />
      </div>
    </div>
  );
}

type Surface = 'paper' | 'white' | 'ink';

const surfaceClass: Record<Surface, string> = {
  paper: 'bg-paper',
  white: 'bg-white',
  ink: 'bg-ink',
};

const glyphs: ReactNode[] = [
  // Rainwater catchment: rain on a roof, into a downpipe
  <path key="rain" d="M8 3v2.5M12 2v2.5M16 3v2.5M3 13l9-5 9 5M18 11.3V21" />,
  // Filtration: a filter funnel
  <path key="filter" d="M4 5h16l-6 7v5l-4 2v-7z" />,
  // Storage tank: the level fills as the water travels on (data-tank-level)
  <g key="tank">
    <rect x="6" y="4" width="12" height="16" rx="1.5" />
    <rect data-tank-level x="7.5" y="10" width="9" height="8.5" className="tank-level fill-water stroke-none" />
    <path d="M9 4V2.5h6V4M4 20h16" />
  </g>,
  // Grey water reuse: a return loop
  <path key="reuse" d="M6.5 10a6 6 0 0 1 10.3-3M17 3.5V7.5h-4M17.5 14a6 6 0 0 1-10.3 3M7 20.5v-4h4" />,
  // Building
  <path key="building" d="M3 20.5h18M5.5 20.5V9h5v11.5M10.5 20.5V4.5h8v16M13.5 8.5h2M13.5 12h2M13.5 15.5h2" />,
];

/**
 * One stage: a node on the pipe, aligned with its section's eyebrow. Place inside a
 * `relative` full-width section marked data-water-stage, as its first child.
 */
export function WaterStage({ index, surface = 'paper' }: { index: number; surface?: Surface }) {
  const dark = surface === 'ink';
  return (
    <div
      aria-hidden="true"
      data-water-node
      className={`pointer-events-none absolute top-20 z-10 h-6 w-6 -translate-x-1/2 sm:top-24 lg:h-8 lg:w-8 xl:top-[92px] xl:h-10 xl:w-10 ${RAIL_X}`}
    >
      <span className="stage-ring absolute inset-1 rounded-full lg:-inset-1.5 border border-copper-300" />
      <span
        className={`absolute inset-[7px] rounded-full border lg:inset-0 ${surfaceClass[surface]} ${
          dark ? 'border-steel-400' : 'border-steel-500'
        }`}
      />
      {/* Phones: a dot that turns copper */}
      <span className="stage-lit absolute inset-[9px] rounded-full bg-copper-500 lg:hidden" />
      {/* Desktop: the stage drawing */}
      <svg
        viewBox="0 0 24 24"
        className={`stage-glyph relative m-1.5 hidden h-5 w-5 xl:m-2 xl:h-6 xl:w-6 fill-none lg:block ${dark ? 'stage-glyph-dark' : ''}`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {glyphs[index]}
      </svg>
      <span
        className={`absolute left-[calc(100%+6px)] top-1 hidden whitespace-nowrap text-[10px] font-semibold uppercase leading-none tracking-[0.2em] [writing-mode:vertical-rl] 2xl:block ${
          dark ? 'text-steel-300' : 'text-steel-600'
        }`}
      >
        {waterStages[index]}
      </span>
    </div>
  );
}
