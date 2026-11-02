import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router';
import { getLenis } from '@/motion/lenis';

// useLayoutEffect warns during pre-rendering; it only matters in the browser.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Module scope (not a ref) so React StrictMode's double effects don't count as a navigation.
let lastPath: string | null = null;

/**
 * Mounted with each page (inside PageTransition). On client-side navigation it
 * resets scroll and moves focus to the new page's <h1>, so screen readers announce
 * the page. Skipped on the first page load.
 *
 * Runs on mount only: while the old page plays its exit it already sees the new
 * location, and must not act on it.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useIsomorphicLayoutEffect(() => {
    if (lastPath === null || lastPath === pathname) {
      lastPath = pathname;
      return;
    }
    lastPath = pathname;

    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    const target = document.querySelector<HTMLElement>('#main h1') ?? document.getElementById('main');
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }, []);

  return null;
}
