interface RevealImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * An image that, below the fold, reveals through a curved clip-path wipe while a
 * hairline crosshair flashes at its top-left corner like a registration mark
 * (src/motion/useReveal.ts). Without JS or with reduced motion it is simply shown.
 */
export function RevealImage({ src, alt, width, height, className = '' }: RevealImageProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
        data-reveal-image
      />
      {/* Decorative; hidden unless the reveal plays (opacity-0 until GSAP flashes it). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute -left-2 -top-2 h-4 w-4 fill-none stroke-steel-500 opacity-0"
        strokeWidth="1"
        data-reveal-mark
      >
        <path d="M8 0V16M0 8H16" />
        <circle cx="8" cy="8" r="3" />
      </svg>
    </div>
  );
}
