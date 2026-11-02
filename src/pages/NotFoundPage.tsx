import { Link } from 'react-router';
import { Seo } from '@/components/Seo';
import { SlashBands } from '@/components/ui/SlashBands';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="The page you were looking for could not be found." noindex />
      <section className="relative isolate overflow-hidden">
        <SlashBands region="-z-10 inset-y-0 right-0 hidden w-[32%] xl:block" />
        <div className="container-page py-24 sm:py-32">
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-3 max-w-2xl text-h1 text-navy">This page has moved or no longer exists.</h1>
          <p className="mt-5 max-w-prose text-ink-muted">
            Our website has been rebuilt, so some older links no longer work. Try one of these instead:
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn-primary">
              Go to the home page
            </Link>
            <Link to="/services" className="btn-secondary">
              Our services
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
