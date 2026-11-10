import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  /** On ink backgrounds: copper-300 text. */
  dark?: boolean;
  /** Above the fold: the rule draws with CSS on load. Otherwise GSAP draws it on scroll. */
  intro?: boolean;
  /** Extra attributes for the reveal hooks, e.g. data-reveal. */
  className?: string;
}

/**
 * Section label in widely tracked capitals with a copper rule beneath, echoing the
 * line under "CONSULTING ENGINEERS" in the logo, and a steel registration crosshair
 * where the rule ends.
 */
export function Eyebrow({ children, dark = false, intro = false, className = '' }: EyebrowProps) {
  return (
    <span className={`relative inline-block pb-2.5 pr-5 ${className}`}>
      <span className={`text-eyebrow uppercase ${dark ? 'text-copper-300' : 'text-copper-700'}`}>{children}</span>
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 right-5 h-px bg-gradient-to-r from-copper-500 to-copper-100 ${
          intro ? 'rule-intro [--d:0.35s]' : ''
        }`}
        data-rule={intro ? undefined : ''}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className={`absolute -bottom-[5.5px] right-0 h-3 w-3 fill-none ${dark ? 'stroke-steel-300' : 'stroke-steel-500'}`}
        strokeWidth="1"
        data-sketch={intro ? undefined : ''}
      >
        <path d="M6 0V12M0 6H12" pathLength={intro ? 1 : undefined} className={intro ? 'draw [--d:0.8s]' : undefined} />
        <circle cx="6" cy="6" r="2.5" pathLength={intro ? 1 : undefined} className={intro ? 'draw [--d:0.9s]' : undefined} />
      </svg>
    </span>
  );
}
