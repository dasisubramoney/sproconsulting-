import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { getLenis } from '@/hooks/useSmoothScroll';

/** Resets scroll on route change and moves focus to <main> for screen readers. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
