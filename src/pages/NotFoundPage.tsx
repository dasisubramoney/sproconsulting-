import { Link } from 'react-router';
import { Seo } from '@/components/Seo';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SketchLines } from '@/components/ui/SketchLines';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="The page you were looking for could not be found." noindex />
      <section className="relative isolate overflow-hidden">
        <SketchLines region="-z-10 inset-y-6 right-0 hidden w-[28%] xl:block" intro />
        <div className="container-page py-24 sm:py-32">
          <p>
            <Eyebrow intro>Error 404</Eyebrow>
          </p>
          <h1 className="mt-3 max-w-2xl text-h1 text-steel-700">This page has moved or no longer exists.</h1>
          <p className="mt-5 max-w-prose text-steel-600">
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
