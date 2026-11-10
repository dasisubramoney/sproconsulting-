interface LogoProps {
  /** header: 48 px tall on mobile, 64 px from `lg`. drawer: 48 px. footer: 96 px. */
  size?: 'header' | 'drawer' | 'footer';
  /** On dark backgrounds the full-colour logo sits on a white panel. */
  onDark?: boolean;
  className?: string;
}

// Trimmed, resized copies of public/images/brand/SPRO_logo_clean.png (the approved
// artwork, unmodified). Never shown above the native size of the largest file.
const BASE = '/images/brand/spro-logo';
const heights = [48, 64, 96, 128, 192] as const;
const widths: Record<(typeof heights)[number], number> = { 48: 57, 64: 77, 96: 115, 128: 153, 192: 230 };
const srcSet = (ext: 'webp' | 'png') => heights.map((h) => `${BASE}-${h}.${ext} ${widths[h]}w`).join(', ');

const sizing = {
  header: { sizes: '(min-width: 1024px) 77px, 57px', width: 77, height: 64, className: 'h-12 w-auto lg:h-16' },
  drawer: { sizes: '57px', width: 57, height: 48, className: 'h-12 w-auto' },
  footer: { sizes: '115px', width: 115, height: 96, className: 'h-24 w-auto' },
} as const;

/**
 * The approved S-PRO logo (raster for now).
 * TODO: request vector logo (SVG/AI/EPS) from client.
 * TODO: reversed logo from designer, for dark backgrounds (until then: white panel).
 */
export function Logo({ size = 'header', onDark = false, className = '' }: LogoProps) {
  const s = sizing[size];
  const image = (
    <picture>
      <source type="image/webp" srcSet={srcSet('webp')} sizes={s.sizes} />
      <img
        src={`${BASE}-${s.height}.png`}
        srcSet={srcSet('png')}
        sizes={s.sizes}
        width={s.width}
        height={s.height}
        alt="S-PRO Consulting Engineers"
        decoding="async"
        className={`block ${s.className}`}
      />
    </picture>
  );

  if (!onDark) return <span className={`inline-flex ${className}`}>{image}</span>;
  return <span className={`inline-flex rounded-sm bg-white p-2 ${className}`}>{image}</span>;
}
