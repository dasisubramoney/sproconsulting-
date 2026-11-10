/**
 * Home hero motion, loaded only on the home page (lazy chunk):
 *  - "Blueprint to Reality": as the hero scrolls, the drawing is built (GSAP scrub) —
 *    steel planes rise, services appear, the copper ribbon sweeps in, the render plate
 *    is revealed through an S-curve mask, and the linework fades back.
 *  - Depth: the drafting grid and the drawing drift with the mouse (desktop, fine pointer).
 *  - Magnetic CTAs: [data-magnetic] buttons lean towards the pointer (desktop).
 * Everything is reverted on unmount and switched off with reduced motion, which shows
 * the finished drawing (see .bp-solid in index.css).
 */
import { useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from './gsap';
import { ease } from './tokens';
import { useReducedMotion } from './useReducedMotion';


export default function HeroMotion() {
  const reduced = useReducedMotion();
  const [scope] = useState(() => ({ current: document.querySelector<HTMLElement>('[data-home-hero]') }));

  useGSAP(
    () => {
      const hero = scope.current;
      if (reduced || !hero) return;
      const q = gsap.utils.selector(hero);
      const drawing = q('[data-blueprint]')[0];
      if (!drawing) return;

      // --- Blueprint to Reality (scroll scrub) ---------------------------------
      // Initial states, set from JS. The built layers are hidden by CSS until now
      // (html[data-js]), so making their groups visible here never flashes.
      gsap.set(q('[data-bp="planes"], [data-bp="ribbon"], [data-bp="plate"]'), { opacity: 1 });
      gsap.set(q('[data-bp-tower]'), { scaleY: 0, transformOrigin: '50% 100%' });
      gsap.set(q('[data-bp="ribbon"] path'), { drawSVG: 0 });
      gsap.set(q('[data-bp="plate-sweep"]'), { drawSVG: 0 });
      gsap.set(q('[data-bp="services"]'), { opacity: 0 });

      const mm = gsap.matchMedia();
      mm.add({ wide: '(min-width: 1280px)', narrow: '(max-width: 1279.98px)' }, (ctx) => {
        // Wide: the drawing sits beside the text and is in view on load, so build over
        // the first ~600px of scroll. Narrow: it sits below the text, so build as it
        // crosses the viewport.
        const wide = ctx.conditions?.wide;
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: drawing,
            start: wide ? 'top 20%' : 'top 75%',
            end: wide ? '+=600' : 'bottom 35%',
            scrub: 0.6,
          },
        });
        tl.to(q('[data-bp-tower]'), { scaleY: 1, duration: 0.35, stagger: 0.06, ease: ease.out }, 0)
          .to(q('[data-bp="ribbon"] path'), { drawSVG: '100%', duration: 0.4, stagger: 0.03 }, 0.15)
          .to(q('[data-bp="services"]'), { opacity: 1, duration: 0.25 }, 0.4)
          .to(q('[data-bp="plate-sweep"]'), { drawSVG: '100%', duration: 0.6 }, 0.3)
          .to(q('[data-bp="lines"]'), { opacity: 0.35, duration: 0.4 }, 0.55);
      });

      // --- Depth on mouse move, and magnetic CTAs (desktop, fine pointer only) ---
      mm.add('(min-width: 1024px) and (pointer: fine)', () => {
        const layers = q('[data-depth]').map((el) => ({
          depth: Number(el.getAttribute('data-depth')) || 6,
          x: gsap.quickTo(el, 'x', { duration: 0.8, ease: ease.out }),
          y: gsap.quickTo(el, 'y', { duration: 0.8, ease: ease.out }),
        }));
        const onMove = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          for (const l of layers) {
            l.x(nx * l.depth);
            l.y(ny * l.depth);
          }
        };
        hero.addEventListener('pointermove', onMove);

        const magnets = (q('[data-magnetic]') as HTMLElement[]).map((el) => {
          const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: ease.out });
          const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: ease.out });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            // Lean at most 6px towards the pointer.
            x(((e.clientX - r.left) / r.width - 0.5) * 12);
            y(((e.clientY - r.top) / r.height - 0.5) * 12);
          };
          const leave = () => {
            x(0);
            y(0);
          };
          el.addEventListener('pointermove', move);
          el.addEventListener('pointerleave', leave);
          return () => {
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerleave', leave);
          };
        });

        return () => {
          hero.removeEventListener('pointermove', onMove);
          magnets.forEach((off) => off());
        };
      });

      // The built layers change no layout, but the page height may have settled.
      ScrollTrigger.refresh();
    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  return null;
}
