import type { RefObject } from 'react';
import { belowFold, gsap, useGSAP } from './gsap';
import { duration, ease, revealStart, stagger } from './tokens';

/**
 * [data-sketch] <svg> construction lines (crosshairs, arcs, ticks) inside `scope`
 * draw on with DrawSVG as they scroll into view.
 *
 * Only below the fold: above it, the same graphics draw with CSS on load (`intro`
 * props), so nothing visible is ever hidden by JS.
 */
export function useDrawLines(scope: RefObject<HTMLElement | null>, reduced: boolean): void {
  useGSAP(
    () => {
      if (reduced || !scope.current) return;

      for (const sketch of gsap.utils.toArray<SVGElement>('[data-sketch]', scope.current).filter(belowFold)) {
        gsap.from(sketch.querySelectorAll('path, circle, line'), {
          drawSVG: 0,
          duration: duration.draw,
          ease: ease.out,
          stagger: stagger.items,
          scrollTrigger: { trigger: sketch, start: revealStart, once: true },
        });
      }
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}
