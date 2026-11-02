/**
 * The lazily loaded motion layer (GSAP, ScrollTrigger, SplitText, Lenis).
 * Loaded after hydration by Layout and PageTransition; never part of the main bundle.
 */
import { useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, useGSAP } from './gsap';
import { setLenis } from './lenis';
import { SCROLL_PROGRESS_ID } from './ScrollProgress';
import { useReducedMotion } from './useReducedMotion';
import { useReveal } from './useReveal';
import { useSplitHeading } from './useSplitHeading';
import { useCountUp } from './useCountUp';
import { useParallax } from './useParallax';

/** Site-wide: Lenis driven by the GSAP ticker, and the scroll-progress bar. Mounted once. */
export function MotionRuntime() {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const bar = document.getElementById(SCROLL_PROGRESS_ID);
      if (bar) {
        gsap.fromTo(
          bar,
          { xPercent: -100 },
          { xPercent: 0, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: reduced ? true : 0.3 } },
        );
      }

      // Web fonts change text metrics, which moves every trigger.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      if (reduced) return;
      const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);

      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        setLenis(null);
      };
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  return null;
}

/**
 * Per page: scroll reveals, split headings, count-ups and parallax inside <main>.
 * Mounted with each page (inside PageTransition), so everything is reverted when
 * the page leaves.
 */
export function PageMotion() {
  const reduced = useReducedMotion();
  const [scope] = useState(() => ({ current: document.getElementById('main') }));

  useReveal(scope, reduced);
  useSplitHeading(scope, reduced);
  useCountUp(scope, reduced);
  useParallax(scope, reduced);

  // The new page changed the document height: recalculate every trigger,
  // including the site-wide progress bar.
  useGSAP(() => ScrollTrigger.refresh(), { dependencies: [reduced] });

  return null;
}
