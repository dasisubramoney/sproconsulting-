import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router';
import { AnimatePresence, m, type Variants } from 'framer-motion';
import { useHydrated } from '@/hooks/useHydrated';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { useReducedMotion } from './useReducedMotion';
import { bezier, coverTime, duration, stagger } from './tokens';

const PageMotion = lazy(() => import('./runtime').then((mod) => ({ default: mod.PageMotion })));

type Phase = 'idle' | 'cover' | 'reveal';

/**
 * Route content with the copper S-sweep transition (after the logo's ribbon):
 *  1. a copper ribbon draws across the screen along an S-curve, a steel ribbon
 *     and a copper highlight following it, until the screen is covered (cover);
 *  2. the old page unmounts under the cover and the new page mounts
 *     (scroll reset and focus move to its <h1> happen here, in ScrollToTop);
 *  3. the ribbon's tail pulls away along the same S (reveal).
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
      {hydrated && <SweepWipe phase={phase} onRevealed={() => setPhase('idle')} />}
    </>
  );
}

// The S, in a 100 × 100 box stretched to the viewport. It starts off-screen bottom
// left and leaves top right, curling through the middle like the logo's ribbon.
const S_PATH = 'M-30 118 C 25 118 22 58 50 50 C 78 42 75 -18 130 -18';

// i = 0 copper ribbon (wide enough to cover the screen), 1 steel ribbon, 2 copper highlight.
const variants: Variants = {
  // Nothing drawn. Instant, so resetting after a reveal is never seen.
  idle: { pathLength: 0, pathOffset: 0, transition: { duration: 0 } },
  // The ribbon draws along the S until the screen is covered; the lines on top follow it.
  cover: (i: number) => ({
    pathLength: 1,
    pathOffset: 0,
    transition: { duration: duration.wipe, ease: bezier.inOut, delay: i * stagger.bands },
  }),
  // The tail pulls away along the same S, all three ribbons together.
  reveal: {
    pathLength: 0,
    pathOffset: 1,
    transition: { duration: duration.wipe, ease: bezier.inOut },
  },
};

function SweepWipe({ phase, onRevealed }: { phase: Phase; onRevealed: () => void }) {
  return (
    <div aria-hidden="true" className={`fixed inset-0 z-[90] ${phase === 'idle' ? 'pointer-events-none' : ''}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full fill-none">
        <m.path
          d={S_PATH}
          className="stroke-copper-500"
          strokeWidth="170"
          custom={0}
          variants={variants}
          initial="idle"
          animate={phase}
          onAnimationComplete={(definition) => definition === 'reveal' && onRevealed()}
        />
        <m.path
          d={S_PATH}
          className="stroke-steel-700"
          strokeWidth="2.5"
          custom={1}
          variants={variants}
          initial="idle"
          animate={phase}
        />
        <m.path
          d={S_PATH}
          className="stroke-copper-300"
          strokeWidth="0.6"
          transform="translate(0 -3)"
          custom={2}
          variants={variants}
          initial="idle"
          animate={phase}
        />
      </svg>
    </div>
  );
}
