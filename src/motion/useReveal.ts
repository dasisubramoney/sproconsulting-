import type { RefObject } from 'react';
import { belowFold, gsap, ScrollTrigger, useGSAP } from './gsap';
import { distance, duration, ease, revealStart, stagger } from './tokens';

// Angled wipe that matches the slash motif: the leading edge leans like the bands.
const IMAGE_HIDDEN = 'polygon(0% 0%, 0% 0%, -25% 100%, -25% 100%)';
const IMAGE_SHOWN = 'polygon(0% 0%, 125% 0%, 100% 100%, -25% 100%)';

/**
 * Scroll reveals inside `scope`:
 *  - [data-reveal-item]   fades up in staggered batches
 *  - [data-reveal-image]  revealed through an angled clip-path wipe
 *  - [data-slash]         section slash bands draw in, maroon after crimson
 *
 * Initial states are set here, in JS, and only for elements below the fold, so
 * content is always visible without JS, with reduced motion, or if GSAP fails.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, reduced: boolean): void {
  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      const root = scope.current;

      const items = gsap.utils.toArray<HTMLElement>('[data-reveal-item]', root).filter(belowFold);
      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y: distance.reveal });
        ScrollTrigger.batch(items, {
          start: revealStart,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: duration.reveal,
              ease: ease.out,
              stagger: stagger.items,
              overwrite: true,
              clearProps: 'transform',
            }),
        });
      }

      for (const image of gsap.utils.toArray<HTMLElement>('[data-reveal-image]', root).filter(belowFold)) {
        gsap.fromTo(
          image,
          { clipPath: IMAGE_HIDDEN },
          {
            clipPath: IMAGE_SHOWN,
            duration: duration.draw,
            ease: ease.expo,
            clearProps: 'clipPath',
            scrollTrigger: { trigger: image, start: revealStart, once: true },
          },
        );
      }

      // Hero bands (data-slash-intro) draw in with CSS on load instead.
      const slashes = gsap.utils
        .toArray<HTMLElement>('[data-slash]:not([data-slash-intro])', root)
        .filter(belowFold);
      for (const slash of slashes) {
        gsap.from(slash.querySelectorAll('[data-slash-band]'), {
          scaleX: 0,
          duration: duration.draw,
          ease: ease.out,
          stagger: 0.15,
          scrollTrigger: { trigger: slash, start: 'top 85%', once: true },
        });
      }
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}
