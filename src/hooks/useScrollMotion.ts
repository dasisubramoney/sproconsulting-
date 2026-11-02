import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { prefersReducedMotion } from './usePrefersReducedMotion';
import { getLenis } from './useSmoothScroll';

/**
 * Scroll-driven motion with GSAP + ScrollTrigger, loaded on demand so it never
 * blocks first paint. Runs once per route, after the page has rendered.
 *
 * Hooks into these data attributes:
 *  - [data-reveal-item]  cards/list items fade up in staggered batches
 *  - [data-slash]        slash bands draw in (or drift, for hero bands with data-slash-intro)
 *  - [data-stat]         numbers count up, e.g. "27+", "6.57M"
 *
 * Only elements that start below the viewport are animated, so nothing that is
 * already visible ever blinks out. Content never depends on motion: with reduced
 * motion, or if GSAP fails to load, everything simply stays visible.
 */
export function useScrollMotion(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const lenis = getLenis();
        const onLenisScroll = () => ScrollTrigger.update();
        lenis?.on('scroll', onLenisScroll);

        const main = document.getElementById('main');
        if (!main) return;
        const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight;

        const ctx = gsap.context(() => {
          // Staggered card / item reveals.
          const items = gsap.utils.toArray<HTMLElement>('[data-reveal-item]', main).filter(belowFold);
          if (items.length) {
            gsap.set(items, { autoAlpha: 0, y: 32 });
            ScrollTrigger.batch(items, {
              start: 'top 90%',
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, overwrite: true }),
            });
          }

          for (const slash of gsap.utils.toArray<HTMLElement>('[data-slash]', main)) {
            if (slash.hasAttribute('data-slash-intro')) {
              // Hero bands: gentle drift as the hero scrolls away.
              gsap.to(slash.querySelector('[data-slash-parallax]'), {
                yPercent: 18,
                ease: 'none',
                scrollTrigger: { trigger: slash.parentElement, start: 'top top', end: 'bottom top', scrub: true },
              });
            } else if (belowFold(slash)) {
              // Section bands: draw in from the right, maroon following crimson.
              gsap.from(slash.querySelectorAll('[data-slash-band]'), {
                scaleX: 0,
                duration: 1.1,
                ease: 'power3.out',
                stagger: 0.15,
                scrollTrigger: { trigger: slash, start: 'top 85%', once: true },
              });
            }
          }

          // Count-up numbers.
          for (const el of gsap.utils.toArray<HTMLElement>('[data-stat]', main).filter(belowFold)) {
            const final = el.textContent ?? '';
            const match = final.match(/^(\d+(?:\.\d+)?)(.*)$/);
            if (!match) continue;
            const target = Number(match[1]);
            const decimals = match[1].split('.')[1]?.length ?? 0;
            const suffix = match[2];
            const counter = { value: 0 };
            el.textContent = `${(0).toFixed(decimals)}${suffix}`;
            gsap.to(counter, {
              value: target,
              duration: 1.6,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
              onUpdate: () => {
                el.textContent = `${counter.value.toFixed(decimals)}${suffix}`;
              },
              onComplete: () => {
                el.textContent = final;
              },
            });
          }
        }, main);

        // Web fonts and lazy content can shift layout after setup.
        document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());

        cleanup = () => {
          lenis?.off('scroll', onLenisScroll);
          ctx.revert();
        };
      })
      .catch(() => {
        // Motion is an enhancement only; content is already visible.
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);
}
