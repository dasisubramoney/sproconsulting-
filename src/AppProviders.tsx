import { startTransition, useEffect, useState, type ReactNode } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { isMotionReduced, subscribeMotionPreference } from '@/motion/preference';

/** Providers shared by the browser entry (main.tsx) and the pre-renderer (entry-server.tsx). */
export function AppProviders({ children }: { children: ReactNode }) {
  const reduced = useDeferredReducedMotion();
  return (
    // Lightweight Framer Motion bundle; honours the OS setting and the footer toggle.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>{children}</MotionConfig>
    </LazyMotion>
  );
}

/**
 * Like useReducedMotion, but updates as a transition. This provider sits above the
 * page's Suspense boundary; a synchronous context change while that boundary is
 * still hydrating would make React discard its pre-rendered HTML (error #421).
 */
function useDeferredReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const update = () => startTransition(() => setReduced(isMotionReduced()));
    update();
    return subscribeMotionPreference(update);
  }, []);
  return reduced;
}
