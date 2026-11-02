import { lazy, Suspense, useEffect } from 'react';
import { StructuredData } from '@/components/StructuredData';
import { organizationSchema } from '@/content/schema';
import { useHydrated } from '@/hooks/useHydrated';
import { preloadPages } from '@/pages/loaders';
import { IntroOverlay } from '@/motion/IntroOverlay';
import { PageTransition } from '@/motion/PageTransition';
import { ScrollProgress } from '@/motion/ScrollProgress';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';

// GSAP, ScrollTrigger and Lenis: fetched after hydration, never in the main bundle.
const MotionRuntime = lazy(() => import('@/motion/runtime').then((mod) => ({ default: mod.MotionRuntime })));

export function Layout() {
  // Fetch the other pages' code when the browser is idle, so route transitions
  // never wait on the network mid-wipe.
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preloadPages, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(preloadPages, 2500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData data={organizationSchema()} />
      <IntroOverlay />
      <ScrollProgress />
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageFallback />}>
          <PageTransition />
        </Suspense>
      </main>
      <Footer />
      <DeferredMotionRuntime />
    </div>
  );
}

/**
 * A leaf of its own: its re-render after hydration must not touch the page's
 * Suspense boundary, which may still be hydrating (React error #421).
 */
function DeferredMotionRuntime() {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return (
    <Suspense fallback={null}>
      <MotionRuntime />
    </Suspense>
  );
}

/** Full-height so the footer stays below the fold while a page chunk loads (avoids layout shift). */
function PageFallback() {
  return (
    <div className="container-page min-h-[100svh] py-24" role="status" aria-live="polite">
      <span className="sr-only">Loading page…</span>
      <div aria-hidden="true" className="h-1 w-24 animate-pulse bg-crimson" />
    </div>
  );
}
