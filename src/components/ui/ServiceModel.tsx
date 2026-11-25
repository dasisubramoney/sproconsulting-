import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ServiceSlug } from '@/config/routes';
import { useReducedMotion } from '@/motion/useReducedMotion';
import { ServiceSchematic } from './ServiceSchematic';

// Large screens with a mouse or trackpad: not phones, and not large tablets in landscape.
const WIDE = '(min-width: 1280px) and (hover: hover) and (pointer: fine)';

function subscribeWide(onChange: () => void): () => void {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const isWide = () => window.matchMedia(WIDE).matches;

/** Runs `fn` once the first-visit intro has cleared and the browser is idle. Returns a cancel. */
function whenSettled(fn: () => void): () => void {
  let cancelled = false;
  let clear = () => {};
  const root = document.documentElement;
  const idle = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(fn, { timeout: 1500 });
      clear = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(fn, 200);
      clear = () => clearTimeout(id);
    }
  };
  let mo: MutationObserver | null = null;
  if (root.hasAttribute('data-intro')) {
    mo = new MutationObserver(() => {
      if (root.hasAttribute('data-intro')) return;
      mo?.disconnect();
      idle();
    });
    mo.observe(root, { attributes: true, attributeFilter: ['data-intro'] });
  } else {
    idle();
  }
  return () => {
    cancelled = true;
    mo?.disconnect();
    clear();
  };
}

type Phase = 'svg' | 'crossfade' | 'live' | 'failed';

/**
 * A service page's hero model. The enlarged SVG schematic is the complete static
 * version: it is what pre-renders, and what phones, reduced motion, no-JS and browsers
 * without WebGL keep. On wide screens with motion on, a lazily loaded three.js model
 * (src/three/stage.ts) replaces it, cross-fading in once its first frame is drawn.
 * Decorative: the page's h1 names the discipline.
 */
export function ServiceModel({ slug, className = '' }: { slug: ServiceSlug; className?: string }) {
  const reduced = useReducedMotion();
  const wide = useSyncExternalStore(subscribeWide, isWide, () => false);
  const host = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('svg');
  const enabled = wide && !reduced && phase !== 'failed';

  useEffect(() => {
    const el = host.current;
    if (!enabled || !el) return;
    let stage: { dispose(): void } | null = null;
    let cancelled = false;
    const fail = () => {
      if (!cancelled) setPhase('failed');
    };
    const cancel = whenSettled(() => {
      import('@/three/stage')
        .then(({ createStage }) => {
          if (cancelled) return;
          stage = createStage(el, slug, {
            onReady: () => !cancelled && setPhase('crossfade'),
            onFail: fail,
          });
        })
        .catch(fail);
    });
    return () => {
      cancelled = true;
      cancel();
      stage?.dispose();
      setPhase((p) => (p === 'failed' ? p : 'svg'));
    };
  }, [enabled, slug]);

  const shown = phase === 'crossfade' || phase === 'live';
  return (
    <div className={`relative ${className}`}>
      {/* Stays mounted (so useInViewPlay keeps observing it and it plays again if the 3D
          fails later); once the model is live it is hidden with its loops paused. */}
      <ServiceSchematic
        slug={slug}
        size="feature"
        className={`h-full w-full transition-opacity duration-500 ease-brand ${shown ? 'opacity-0' : ''} ${
          phase === 'live' ? 'invisible [&_*]:![animation-play-state:paused]' : ''
        }`}
      />
      <div
        ref={host}
        className={`absolute inset-0 transition-opacity duration-500 ease-brand ${shown ? 'opacity-100' : 'opacity-0'}`}
        onTransitionEnd={() => phase === 'crossfade' && setPhase('live')}
      />
    </div>
  );
}
