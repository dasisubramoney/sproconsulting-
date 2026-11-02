import { useEffect } from 'react';
import { getLenis } from '@/motion/lenis';

export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    return () => {
      document.body.style.overflow = previous;
      getLenis()?.start();
    };
  }, [locked]);
}
