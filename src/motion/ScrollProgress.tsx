export const SCROLL_PROGRESS_ID = 'scroll-progress';

/**
 * Thin copper reading-progress rule along the top, shading copper-500 → copper-300
 * like the rule under the logo's wordmark, with a small steel crosshair marking its
 * leading end. Starts off-screen; MotionRuntime moves it with ScrollTrigger
 * (transform only). Decorative.
 */
export function ScrollProgress() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[11px] overflow-hidden">
      <div id={SCROLL_PROGRESS_ID} className="relative h-full w-full -translate-x-full">
        <div className="h-[3px] w-full bg-gradient-to-r from-copper-500 to-copper-300" />
        <svg
          viewBox="0 0 11 11"
          className="absolute right-0 top-0 h-[11px] w-[11px] translate-x-1/2 fill-none stroke-steel-500"
          strokeWidth="1"
        >
          <path d="M5.5 0V11M0 1.5H11" />
          <circle cx="5.5" cy="1.5" r="2.5" />
        </svg>
      </div>
    </div>
  );
}
