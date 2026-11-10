import { useEffect, type RefObject } from 'react';

/**
 * Sets data-inview on [data-schematic] elements while they are on screen, which lets
 * their CSS loops run (index.css "Discipline schematics"); off screen they rest on
 * their static frame, so nothing animates unseen. Nothing plays with reduced motion.
 */
export function useInViewPlay(scope: RefObject<HTMLElement | null>, reduced: boolean): void {
  useEffect(() => {
    const root = scope.current;
    if (reduced || !root || !('IntersectionObserver' in window)) return;
    const targets = root.querySelectorAll<SVGElement>('[data-schematic]');
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.toggleAttribute('data-inview', e.isIntersecting);
    });
    targets.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      targets.forEach((t) => t.removeAttribute('data-inview'));
    };
  }, [scope, reduced]);
}
