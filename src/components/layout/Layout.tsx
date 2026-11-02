import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useScrollMotion } from '@/hooks/useScrollMotion';
import { StructuredData } from '@/components/StructuredData';
import { organizationSchema } from '@/content/schema';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';
import { ScrollToTop } from './ScrollToTop';

export function Layout() {
  useSmoothScroll();

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData data={organizationSchema()} />
      <SkipLink />
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
          <ScrollMotion />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

/** Rendered inside the Suspense boundary so it runs only once the lazy page is on screen. */
function ScrollMotion() {
  useScrollMotion();
  return null;
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
