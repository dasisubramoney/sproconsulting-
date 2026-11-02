export const SCROLL_PROGRESS_ID = 'scroll-progress';

/**
 * Thin crimson reading-progress bar with an angled leading edge. Starts off-screen;
 * MotionRuntime moves it with ScrollTrigger (transform only). Decorative.
 */
export function ScrollProgress() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-1 overflow-hidden">
      <div
        id={SCROLL_PROGRESS_ID}
        className="h-full w-full -translate-x-full bg-crimson [clip-path:polygon(0_0,100%_0,calc(100%-6px)_100%,0_100%)]"
      />
    </div>
  );
}
