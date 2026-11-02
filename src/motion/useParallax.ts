import type { RefObject } from 'react';
import { gsap, useGSAP } from './gsap';

/**
 * [data-parallax="18"] layers drift by that many percent of their height as their
 * section scrolls out of view. Put it on an untransformed wrapper, never on an
 * element that already has a transform class (GSAP would replace it).
 */
export function useParallax(scope: RefObject<HTMLElement | null>, reduced: boolean): void {
  useGSAP(
    () => {
      if (reduced || !scope.current) return;

      for (const layer of gsap.utils.toArray<HTMLElement>('[data-parallax]', scope.current)) {
        gsap.to(layer, {
          yPercent: Number(layer.dataset.parallax) || 15,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.closest('section') ?? layer,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}
