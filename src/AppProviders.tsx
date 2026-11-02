import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';

/** Providers shared by the browser entry (main.tsx) and the pre-renderer (entry-server.tsx). */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    // Lightweight Framer Motion bundle; honours the OS reduced-motion setting.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
