interface SlashBandsProps {
  /**
   * Tailwind classes for the clipping region the bands are drawn in, e.g.
   * "inset-y-0 right-0 w-[38%]". The region must not overlap any text —
   * the bands never sit behind copy (see DESIGN.md "Motif").
   */
  region: string;
  /** Rotation in degrees (see DESIGN.md). */
  angle?: -18 | -20 | -22 | -24;
  size?: 'sm' | 'md' | 'lg';
  /**
   * Above-the-fold bands (heroes): draw in with CSS on load and drift on scroll.
   * Otherwise the bands draw in via GSAP when scrolled into view (src/motion/useReveal.ts).
   */
  intro?: boolean;
}

const heights = { sm: 'h-5 sm:h-6', md: 'h-8 sm:h-10', lg: 'h-10 sm:h-14' } as const;

// Classes, not inline styles: pages are pre-rendered and the CSP blocks style attributes.
const rotations = {
  [-18]: '-rotate-[18deg]',
  [-20]: '-rotate-[20deg]',
  [-22]: '-rotate-[22deg]',
  [-24]: '-rotate-[24deg]',
} as const;

/** The signature crimson + maroon diagonal bands. Purely decorative. */
export function SlashBands({ region, angle = -22, size = 'md', intro = false }: SlashBandsProps) {
  return (
    <div
      aria-hidden="true"
      data-slash
      data-slash-intro={intro || undefined}
      className={`pointer-events-none absolute overflow-hidden ${region}`}
    >
      {/* Untransformed layer that GSAP moves for parallax, so the rotation below is never touched. */}
      <div className="absolute inset-0" data-parallax={intro ? 18 : undefined}>
        <div className={`absolute left-[-20%] top-1/2 w-[140%] -translate-y-1/2 ${rotations[angle]}`}>
          <div className={`${heights[size]} w-full origin-right bg-crimson`} data-slash-band />
          <div className={`${heights[size]} mt-3 w-full origin-right bg-maroon sm:mt-4`} data-slash-band />
        </div>
      </div>
    </div>
  );
}
