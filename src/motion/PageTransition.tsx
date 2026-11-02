import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router';
import { AnimatePresence, m, type Variants } from 'framer-motion';
import { useHydrated } from '@/hooks/useHydrated';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { useReducedMotion } from './useReducedMotion';
import { bezier, coverTime, duration, slashAngle, stagger } from './tokens';

const PageMotion = lazy(() => import('./runtime').then((mod) => ({ default: mod.PageMotion })));

type Phase = 'idle' | 'cover' | 'reveal';

/**
 * Route content with the diagonal slash transition:
 *  1. a crimson band, then a maroon band, sweep up across the screen (cover);
 *  2. the old page unmounts under the cover and the new page mounts
 *     (scroll reset and focus move to its <h1> happen here, in ScrollToTop);
 *  3. the bands sweep off the top (reveal).
 * About 650 ms in total. With reduced motion, pages swap instantly.
 */
export function PageTransition() {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const [phase, setPhase] = useState<Phase>('idle');
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (!reduced) setPhase('cover');
  }, [pathname, reduced]);

  return (
    <>
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => setPhase((current) => (current === 'cover' ? 'reveal' : current))}
      >
        {/* No initial/animate props: this wrapper is pre-rendered and must not get a style attribute. */}
        <m.div key={pathname} exit={reduced ? undefined : { opacity: 0, transition: { duration: 0, delay: coverTime } }}>
          <ScrollToTop />
          {outlet}
          {hydrated && (
            <Suspense fallback={null}>
              <PageMotion />
            </Suspense>
          )}
        </m.div>
      </AnimatePresence>
      {hydrated && <SlashWipe phase={phase} onRevealed={() => setPhase('idle')} />}
    </>
  );
}

interface Band {
  width: number;
  height: number;
  /** Vertical rise of the slash across the screen width. */
  rise: number;
  order: 0 | 1;
}

/** A band between two parallel lines rising left to right, `top` and `bottom` at the right edge. */
function band({ width, rise }: Band, top: number, bottom: number) {
  return `polygon(0px ${top + rise}px, ${width}px ${top}px, ${width}px ${bottom}px, 0px ${bottom + rise}px)`;
}

const variants: Variants = {
  // Below the screen, zero height. Instant, so resetting after a reveal is never seen.
  idle: (b: Band) => ({ clipPath: band(b, b.height, b.height), transition: { duration: 0 } }),
  // Leading edge sweeps to the top: the screen is covered.
  cover: (b: Band) => ({
    clipPath: band(b, -b.rise, b.height),
    transition: { duration: duration.wipe, ease: bezier.inOut, delay: b.order * stagger.bands },
  }),
  // Trailing edge follows it off the top. Maroon (in front) leaves first.
  reveal: (b: Band) => ({
    clipPath: band(b, -b.rise, -b.rise),
    transition: { duration: duration.wipe, ease: bezier.inOut, delay: (1 - b.order) * stagger.bands },
  }),
};

function SlashWipe({ phase, onRevealed }: { phase: Phase; onRevealed: () => void }) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const rise = width * Math.tan((slashAngle * Math.PI) / 180);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[90] ${phase === 'idle' ? 'pointer-events-none' : ''}`}
    >
      <m.div
        className="absolute inset-0 bg-crimson"
        custom={{ width, height, rise, order: 0 } satisfies Band}
        variants={variants}
        initial="idle"
        animate={phase}
        onAnimationComplete={(definition) => definition === 'reveal' && onRevealed()}
      />
      <m.div
        className="absolute inset-0 bg-maroon"
        custom={{ width, height, rise, order: 1 } satisfies Band}
        variants={variants}
        initial="idle"
        animate={phase}
      />
    </div>
  );
}
