import type { RefObject } from 'react';
import { belowFold, gsap, ScrollTrigger, useGSAP } from './gsap';
import { distance, duration, ease, revealStart, stagger } from './tokens';

// Curved wipe, after the copper sweep: a circle grows from the bottom-left corner.
const IMAGE_HIDDEN = 'circle(0% at 0% 100%)';
const IMAGE_SHOWN = 'circle(150% at 0% 100%)';

/**
 * Scroll reveals inside `scope`:
 *  - [data-reveal-item]   fades up in staggered batches
 *  - [data-reveal-image]  revealed through a curved clip-path wipe; a sibling
 *                         [data-reveal-mark] crosshair flashes at its corner (<RevealImage>)
 *  - [data-rule]          a copper rule or sweep, drawn from the left (scaleX)
 * Sketch lines ([data-sketch]) are drawn by useDrawLines.
 *
 * Initial states are set here, in JS, and only for elements below the fold, so
 * content is always visible without JS, with reduced motion, or if GSAP fails.
 * Above the fold the same graphics draw with CSS instead (`intro` props).
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
        const mark = image.parentElement?.querySelector('[data-reveal-mark]');
        const tl = gsap.timeline({ scrollTrigger: { trigger: image, start: revealStart, once: true } });
        tl.fromTo(
          image,
          { clipPath: IMAGE_HIDDEN },
          { clipPath: IMAGE_SHOWN, duration: duration.draw, ease: ease.expo, clearProps: 'clipPath' },
        );
        // Registration mark: appears as the wipe starts, gone once the image settles.
        if (mark) tl.fromTo(mark, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, yoyo: true, repeat: 1, repeatDelay: 0.5 }, 0);
      }

      // Rules in a "Follow the Water" stage draw when the water reaches it (WaterMotion).
      const rules = gsap.utils.toArray<Element>('[data-rule]', root).filter((r) => !r.closest('[data-water-stage]'));
      for (const rule of rules.filter(belowFold)) {
        gsap.from(rule, {
          scaleX: 0,
          transformOrigin: '0% 50%',
          duration: duration.draw,
          ease: ease.out,
          scrollTrigger: { trigger: rule, start: revealStart, once: true },
        });
      }
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}
