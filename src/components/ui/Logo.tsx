interface LogoProps {
  variant?: 'default' | 'light';
  className?: string;
}

/**
 * Placeholder logo: a simplified tower mark plus wordmark.
 * TODO: replace with the official S-PRO logo artwork (SVG preferred) in public/images/logo/.
 */
export function Logo({ variant = 'default', className = '' }: LogoProps) {
  const light = variant === 'light';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true" focusable="false">
        <rect x="9" y="4" width="10" height="30" className={light ? 'fill-white' : 'fill-navy'} />
        <rect x="22" y="12" width="8" height="22" className={light ? 'fill-navy-200' : 'fill-navy-400'} />
        <path d="M2 38 L38 18 L38 24 L8 40 Z" className="fill-crimson" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`text-xl font-extrabold tracking-wide ${light ? 'text-white' : 'text-crimson'}`}>
          S-PRO
        </span>{' '}
        <span
          className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] ${light ? 'text-navy-100' : 'text-navy'}`}
        >
          Consulting Engineers
        </span>
      </span>
    </span>
  );
}
