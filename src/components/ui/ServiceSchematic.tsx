import type { ReactNode } from 'react';
import type { ServiceSlug } from '@/config/routes';

interface ServiceSchematicProps {
  slug: ServiceSlug;
  className?: string;
}

/**
 * Animated schematic icon for each discipline: steel-500 linework with the moving
 * element in copper-500 (water itself in the `water` tint).
 *
 * The markup is a complete, static drawing. The loops (CSS, src/styles/index.css
 * "Discipline schematics") run only while the schematic is in view (data-inview, set
 * by useInViewPlay) or its card is hovered / focused, and never with reduced motion.
 * Decorative: the card's heading names the discipline.
 */
export function ServiceSchematic({ slug, className = '' }: ServiceSchematicProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={`schematic fill-none stroke-steel-500 ${className}`}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-schematic
    >
      {drawings[slug]}
    </svg>
  );
}

// Fire: spray droplets, each with its own end point (--dx/--dy) and start offset (--d).
// Every other droplet is hidden on small screens (fewer particles on mobile).
const droplets = [
  '[--dx:-18px] [--dy:24px] [--d:0s]',
  '[--dx:-11px] [--dy:30px] [--d:0.5s] max-sm:hidden',
  '[--dx:-4px] [--dy:34px] [--d:0.25s]',
  '[--dx:4px] [--dy:34px] [--d:0.75s] max-sm:hidden',
  '[--dx:11px] [--dy:30px] [--d:0.1s]',
  '[--dx:18px] [--dy:24px] [--d:0.6s] max-sm:hidden',
  '[--dx:-15px] [--dy:14px] [--d:0.4s]',
  '[--dx:15px] [--dy:14px] [--d:0.9s] max-sm:hidden',
];

const drawings: Record<ServiceSlug, ReactNode> = {
  // Single-line diagram: busbar → breaker → load, with a current pulse along the feeder.
  electrical: (
    <>
      <path d="M6 14 H58" strokeWidth="3" className="stroke-steel-700" />
      <path d="M32 14 V24 M32 34 V42" />
      {/* Breaker. */}
      <path d="M27 24 H37 V34 H27 Z M28 33 L36 25" />
      {/* Motor load. */}
      <circle cx="32" cy="49" r="7" />
      <path d="M28.5 52 V46 L32 50 L35.5 46 V52" strokeWidth="1.2" />
      {/* Second feeder with a lamp load. */}
      <path d="M50 14 V36" />
      <circle cx="50" cy="41" r="5" />
      <path d="M46.5 37.5 L53.5 44.5 M53.5 37.5 L46.5 44.5" strokeWidth="1.2" />
      {/* Current pulse with a soft copper-300 glow. */}
      <path d="M6 14 H32 V42" className="sch-pulse stroke-copper-300 opacity-50" strokeWidth="5" />
      <path d="M6 14 H32 V42" className="sch-pulse stroke-copper-500" strokeWidth="2.5" />
    </>
  ),
  // Interlocking gears: teeth drawn as a dashed ring; the copper gear drives the steel one.
  mechanical: (
    <>
      <g className="sch-spin">
        <circle cx="25" cy="38" r="13" strokeWidth="5" strokeDasharray="3.2 3.6" strokeLinecap="butt" />
        <circle cx="25" cy="38" r="8.5" />
        <circle cx="25" cy="38" r="2.5" />
      </g>
      <g className="sch-spin-rev stroke-copper-500">
        <circle cx="43" cy="22" r="8.5" strokeWidth="5" strokeDasharray="3.2 3.6" strokeLinecap="butt" />
        <circle cx="43" cy="22" r="4.5" />
        <circle cx="43" cy="22" r="1.5" />
      </g>
      <path d="M4 60 H60" strokeWidth="1" />
    </>
  ),
  // Sprinkler head releasing a spray pattern of droplets.
  fire: (
    <>
      <path d="M32 2 V14" strokeWidth="3" className="stroke-steel-700" />
      <path d="M28 14 H36 L34 19 H30 Z" />
      <path d="M23 21 H41" strokeWidth="2" />
      <g className="fill-copper-500 stroke-none">
        {droplets.map((cls) => (
          <circle key={cls} cx="32" cy="23" r="1.7" className={`sch-drop ${cls}`} />
        ))}
      </g>
      <path d="M6 60 H58" strokeWidth="1" />
    </>
  ),
  // Duct run elbowing down into a diffuser; airflow streams through and curls out.
  hvac: (
    <>
      <path d="M4 16 H46 V40 M4 30 H34 V40" />
      <path d="M28 40 H52 M30 44 L26 49 M40 44 V50 M50 44 L54 49" strokeWidth="1.2" />
      <path d="M6 23 H36 Q40 23 40 28 V42" className="sch-air stroke-copper-500" strokeWidth="1.6" />
      <path d="M38 46 Q34 54 24 55 M42 46 Q46 54 56 55" className="sch-air stroke-copper-500" strokeWidth="1.6" />
    </>
  ),
  // Water through a pipe run into a tank whose level rises.
  'wet-services': (
    <>
      <path d="M2 12 H36 V24 M2 18 H30 V24" />
      <path d="M26 24 H60 V60 H26 Z" />
      <rect x="27" y="25" width="32" height="34" className="sch-level fill-water stroke-none opacity-70" />
      <path d="M2 15 H33 V30" className="sch-air stroke-copper-500" strokeWidth="1.6" />
      <path d="M22 40 H26 M22 50 H26" strokeWidth="1" />
    </>
  ),
};
