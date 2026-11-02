import { Link, useParams } from 'react-router';
import { ArrowRight, Check } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { serviceSlugs, type ServiceSlug } from '@/config/routes';
import { getService, services } from '@/content/services';
import { projects } from '@/content/projects';
import NotFoundPage from './NotFoundPage';

const RELATED_LIMIT = 6;

function isServiceSlug(value: string | undefined): value is ServiceSlug {
  return serviceSlugs.includes(value as ServiceSlug);
}

export default function ServiceDetailPage() {
  const { slug } = useParams();
  if (!isServiceSlug(slug)) return <NotFoundPage />;

  const service = getService(slug);
  const related = projects.filter((p) => p.disciplines.includes(slug));
  const others = services.filter((s) => s.slug !== slug);

  return (
    <>
      <Seo title={`${service.title} engineering`} description={service.summary} />
      <PageHero eyebrow="Services" title={`${service.title} engineering`} intro={service.summary}>
        <ServiceIcon icon={service.icon} className="mt-8 h-12 w-12 text-navy-100" />
      </PageHero>

      <section aria-labelledby="capabilities-heading" className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-2">
        <div>
          <SectionHeading id="capabilities-heading" eyebrow="Capabilities" title="What we design" />
          <ul className="mt-8 divide-y divide-surface-muted border-y border-surface-muted">
            {service.capabilities.map((c) => (
              <li key={c} className="flex items-center gap-3 py-4 font-medium text-navy">
                <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-crimson" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {service.systems && (
          <div className="bg-surface-subtle p-8 sm:p-10">
            <SectionHeading
              eyebrow="Sustainable Innovation"
              title="Systems we specify"
              as="h3"
              intro={
                <>
                  Part of our{' '}
                  <Link to="/sustainability" className="font-semibold text-navy underline hover:text-crimson">
                    Sustainable Innovation
                  </Link>{' '}
                  fire and wet services offering.
                </>
              }
            />
            <ul className="mt-6 space-y-3 text-ink">
              {service.systems.map((s) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 bg-crimson" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="bg-surface-subtle">
          <div className="container-page py-20 sm:py-24">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                id="related-heading"
                eyebrow="Track record"
                title={`${service.title} projects`}
                intro={`${related.length} projects in our portfolio include ${service.title} work.`}
              />
              <Link to={`/projects?discipline=${slug}`} className="btn-secondary shrink-0">
                See all {related.length} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, RELATED_LIMIT).map((p) => (
                <li key={p.id}>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <nav aria-labelledby="other-services-heading" className="container-page py-16">
        <h2 id="other-services-heading" className="text-eyebrow uppercase text-maroon">
          Other disciplines
        </h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {others.map((s) => (
            <li key={s.slug}>
              <Link to={`/services/${s.slug}`} className="btn-secondary">
                <ServiceIcon icon={s.icon} className="h-4 w-4" />
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <CtaBand />
    </>
  );
}
