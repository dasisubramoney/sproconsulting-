/**
 * Sustainability page motion, loaded only on that page (lazy chunk):
 *  - "Follow the Water": water flows down the pipe (components/sections/WaterNetwork)
 *    with the scroll. Its leading edge tracks the middle of the viewport. Each stage
 *    lights up (node ring, copper drawing, its section's eyebrow rule) when the water
 *    reaches it, and the storage tank fills as the water travels on to the next stage.
 *  - The 500 houses fill copper in a diagonal wave (components/ui/HouseRow).
 *  - The population chart draws on scroll (components/ui/PopulationChart).
 * The 6.57 figure counts up via the shared useCountUp ([data-stat]).
 *
 * Initial states are set here or in CSS gated on html[data-js]:not([data-reduce-motion]),
 * so the page is complete without JS. Everything is reverted on unmount and with
 * reduced motion.
 */
import { useState } from 'react';
import { belowFold, gsap, ScrollTrigger, useGSAP } from './gsap';
import { ease, revealStart } from './tokens';
import { useReducedMotion } from './useReducedMotion';

export default function WaterMotion() {
  const reduced = useReducedMotion();
  const [scope] = useState(() => ({ current: document.getElementById('main') }));

  useGSAP(
    () => {
      const root = scope.current;
      if (reduced || !root) return;
      const q = gsap.utils.selector(root);

      // --- Follow the Water ----------------------------------------------------
      const wrapper = q('[data-water]')[0] as HTMLElement | undefined;
      const rail = q('[data-water-rail]')[0] as HTMLElement | undefined;
      if (wrapper && rail) {
        const water = rail.querySelector('[data-water-flow]');
        const head = rail.querySelector('[data-water-head]');
        const stages = q('[data-water-stage]') as HTMLElement[];
        const nodes = stages.map((s) => s.querySelector<HTMLElement>('[data-water-node]'));
        const tank = q('[data-tank-level]')[0];
        let offsets: number[] = [];
        let length = 0;

        // The pipe ends at the last stage. Measured before every refresh, as fonts
        // and resizes move the sections.
        const measure = () => {
          const last = nodes[nodes.length - 1];
          if (!last) return;
          const n = last.getBoundingClientRect();
          const w = wrapper.getBoundingClientRect();
          gsap.set(rail, { bottom: w.bottom - (n.top + n.height / 2) });
        };
        const locate = () => {
          const top = rail.getBoundingClientRect().top;
          length = rail.offsetHeight;
          offsets = nodes.map((n) => (n ? n.getBoundingClientRect().top + n.offsetHeight / 2 - top : Infinity));
        };
        measure();
        ScrollTrigger.addEventListener('refreshInit', measure);
        ScrollTrigger.addEventListener('refresh', locate);

        if (tank) gsap.set(tank, { scaleY: 0, transformOrigin: '50% 100%' });
        gsap.set(head, { autoAlpha: 0 });

        const update = (progress: number) => {
          const y = progress * length;
          stages.forEach((stage, i) => stage.toggleAttribute('data-lit', progress > 0 && y >= offsets[i] - 2));
          gsap.set(head, { autoAlpha: progress > 0 && progress < 1 ? 1 : 0 });
          // Tank (stage 3) fills as the water runs from it to the next stage.
          if (tank && offsets.length > 3) {
            const fill = gsap.utils.clamp(0, 1, (y - offsets[2]) / (offsets[3] - offsets[2] || 1));
            gsap.set(tank, { scaleY: fill });
          }
        };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: rail,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
          onUpdate: () => update(tl.progress()),
        });
        tl.fromTo(water, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }, 0).fromTo(
          head,
          { y: 0 },
          { y: () => rail.offsetHeight },
          0,
        );

        // The shimmer and droplets loop only while the pipe is on screen.
        ScrollTrigger.create({
          trigger: rail,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => rail.toggleAttribute('data-flowing', self.isActive),
        });

        locate();
        update(0);

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', measure);
          ScrollTrigger.removeEventListener('refresh', locate);
          rail.removeAttribute('data-flowing');
          stages.forEach((s) => s.removeAttribute('data-lit'));
          // Set from callbacks, outside the context's record: clear them explicitly.
          gsap.set([head, tank].filter(Boolean), { clearProps: 'all' });
        };
      }
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  // Houses and chart: below-the-fold reveals.
  useGSAP(
    () => {
      const root = scope.current;
      if (reduced || !root) return;
      const q = gsap.utils.selector(root);

      const houses = q('[data-houses]')[0];
      if (houses && belowFold(houses)) {
        gsap.from(houses.querySelectorAll('[data-house-wave]'), {
          opacity: 0,
          duration: 0.4,
          ease: ease.out,
          stagger: 0.025,
          scrollTrigger: { trigger: houses, start: revealStart, once: true },
        });
      }

      const chart = q('[data-population-chart]')[0];
      if (chart && belowFold(chart)) {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: chart, start: 'top 90%', end: 'bottom 55%', scrub: 0.5 },
        });
        tl.from(chart.querySelector('[data-chart-line]'), { drawSVG: 0, duration: 1 }).from(
          chart.querySelector('[data-chart-end]'),
          { scale: 0, transformOrigin: '50% 50%', duration: 0.2, ease: ease.out },
          0.9,
        );
      }
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  return null;
}
