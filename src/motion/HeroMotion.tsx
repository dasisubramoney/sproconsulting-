/**
 * Home hero motion, loaded only on the home page (lazy chunk):
 *  (The "Blueprint to Reality" draw, 3D swing and colour fill are pure CSS, in
 *  HeroBlueprint and index.css, so they never wait on this chunk.)
 *  - 3D tilt: on desktop the drawing tilts towards the pointer (max 6°).
 *  - Depth: the drafting grid and the drawing drift with the mouse (desktop, fine pointer).
 *  - Magnetic CTAs: [data-magnetic] buttons lean towards the pointer (desktop).
 * Everything is reverted on unmount and switched off with reduced motion.
 */
import { useState } from 'react';
import { gsap, useGSAP } from './gsap';
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

      const mm = gsap.matchMedia();

      // --- Depth on mouse move, and magnetic CTAs (desktop, fine pointer only) ---
      mm.add('(min-width: 1024px) and (pointer: fine)', () => {
        const layers = q('[data-depth]').map((el) => {
          // Layers holding the 3D drawing also tilt towards the pointer (max 6°).
          const tilt = !!el.querySelector('[data-blueprint]');
          if (tilt) gsap.set(el, { transformPerspective: 1100 });
          return {
            depth: Number(el.getAttribute('data-depth')) || 6,
            x: gsap.quickTo(el, 'x', { duration: 0.8, ease: ease.out }),
            y: gsap.quickTo(el, 'y', { duration: 0.8, ease: ease.out }),
            ry: tilt ? gsap.quickTo(el, 'rotationY', { duration: 1, ease: ease.out }) : null,
            rx: tilt ? gsap.quickTo(el, 'rotationX', { duration: 1, ease: ease.out }) : null,
          };
        });
        const onMove = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          for (const l of layers) {
            l.x(nx * l.depth);
            l.y(ny * l.depth);
            l.ry?.(nx * 12);
            l.rx?.(-ny * 12);
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

    },
    { dependencies: [reduced], revertOnUpdate: true },
  );

  return null;
}
