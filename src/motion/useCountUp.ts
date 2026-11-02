import type { RefObject } from 'react';
import { belowFold, gsap, useGSAP } from './gsap';
import { duration, revealStart } from './tokens';

/**
 * [data-stat] numbers (e.g. "27+", "6.57M") count up once when scrolled into view,
 * then settle on the exact source text. The number in the HTML is always the
 * final value, so it reads correctly without JS.
 */
export function useCountUp(scope: RefObject<HTMLElement | null>, reduced: boolean): void {
  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      const restore: Array<() => void> = [];

      for (const el of gsap.utils.toArray<HTMLElement>('[data-stat]', scope.current).filter(belowFold)) {
        const final = el.textContent ?? '';
        const match = final.match(/^(\d+(?:\.\d+)?)(.*)$/);
        if (!match) continue;
        restore.push(() => {
          el.textContent = final;
        });
        const target = Number(match[1]);
        const decimals = match[1].split('.')[1]?.length ?? 0;
        const suffix = match[2];
        const counter = { value: 0 };
        el.textContent = `${(0).toFixed(decimals)}${suffix}`;
        gsap.to(counter, {
          value: target,
          duration: duration.count,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: revealStart, once: true },
          onUpdate: () => {
            el.textContent = `${counter.value.toFixed(decimals)}${suffix}`;
          },
          onComplete: () => {
            el.textContent = final;
          },
        });
      }

      // On revert (route change, reduced motion switched on) restore the real values.
      return () => restore.forEach((fn) => fn());
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}
