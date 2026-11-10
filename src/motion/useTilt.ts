import type { RefObject } from 'react';
import { gsap, useGSAP } from './gsap';
import { ease } from './tokens';

const MAX_TILT = 6;

/**
 * [data-tilt] cards follow the pointer in 3D, up to 6° (desktop, fine pointer only).
 * When the pointer leaves, the inline transform is cleared so the CSS hover / focus
 * tilt (index.css .service-card) applies again, including for keyboard focus.
 */
export function useTilt(scope: RefObject<HTMLElement | null>, reduced: boolean): void {
  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-tilt]', scope.current);
      if (!cards.length) return;

      const mm = gsap.matchMedia();
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const offs = cards.map((card) => {
          const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: ease.out });
          const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: ease.out });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            gsap.set(card, { transformPerspective: 900 });
            rx(-ny * MAX_TILT);
            ry(nx * MAX_TILT);
          };
          const leave = () => {
            gsap.killTweensOf(card);
            gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.4, ease: ease.out, clearProps: 'transform' });
          };
          card.addEventListener('pointermove', move);
          card.addEventListener('pointerleave', leave);
          return () => {
            card.removeEventListener('pointermove', move);
            card.removeEventListener('pointerleave', leave);
          };
        });
        return () => offs.forEach((off) => off());
      });
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
}
