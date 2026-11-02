import { useEffect } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

let instance: Lenis | null = null;

/** The active Lenis instance, or null when smooth scrolling is disabled. */
export function getLenis(): Lenis | null {
  return instance;
}

/** Enables Lenis smooth scrolling unless the user prefers reduced motion. */
export function useSmoothScroll(): void {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    instance = new Lenis({ autoRaf: true, lerp: 0.12 });
    return () => {
      instance?.destroy();
      instance = null;
    };
  }, [reduced]);
}
