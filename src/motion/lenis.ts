import type Lenis from 'lenis';

// Type-only import: Lenis itself lives in the lazy motion chunk (runtime.tsx).
let instance: Lenis | null = null;

/** The active Lenis instance, or null when smooth scrolling is off or not loaded yet. */
export function getLenis(): Lenis | null {
  return instance;
}

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}
