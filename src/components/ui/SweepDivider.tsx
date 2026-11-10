import { useId } from 'react';

interface SweepDividerProps {
  /** Positioning classes, e.g. "absolute inset-x-0 top-0". */
  className?: string;
  /** On ink backgrounds the ribbon runs copper-300 → copper-100 so it glows. */
  dark?: boolean;
}

/**
 * The copper sweep: a tapering ribbon with the S-curve of the logo, used as a section
 * divider. Below the fold it draws in from the left (data-rule, src/motion/useReveal.ts).
 * Decorative.
 */
export function SweepDivider({ className = '', dark = false }: SweepDividerProps) {
  // Gradient ids must be unique per instance.
  const id = useId().replace(/:/g, '');
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-6 w-full origin-left sm:h-8 ${className}`}
      data-rule=""
    >
      <defs>
        <linearGradient id={`sweep-${id}`} x1="0" x2="1" y1="0" y2="0">
          {/* Token colours via classes (stop-color is a CSS property). */}
          <stop offset="0" className={dark ? '[stop-color:theme(colors.copper.300)]' : '[stop-color:theme(colors.copper.700)]'} />
          <stop offset="0.55" className={dark ? '[stop-color:theme(colors.copper.100)]' : '[stop-color:theme(colors.copper.500)]'} />
          <stop offset="1" className="[stop-color:theme(colors.copper.300)]" />
        </linearGradient>
      </defs>
      {/* Thin at the left, swelling through the S, thin again at the right. */}
      <path
        d="M0 34 C 220 34 360 30 520 20 C 700 8 820 4 960 10 C 1060 14 1140 22 1200 26 L1200 30 C 1130 28 1050 22 950 20 C 820 18 700 22 530 30 C 360 38 220 38 0 38 Z"
        fill={`url(#sweep-${id})`}
      />
    </svg>
  );
}
