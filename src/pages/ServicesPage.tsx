import { Link } from 'react-router';
import { ArrowRight, Check } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { services } from '@/content/services';
import { projects } from '@/content/projects';

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Engineering services"
        description="Electrical, Mechanical, Fire Protection, HVAC and Wet Services engineering — detailing, design, supervision and commissioning."
      />
      <PageHero
        eyebrow="Services"
        title="Five disciplines, one consulting team"
        intro="We offer consulting and contract administration services for commercial buildings and industrial projects — from detailing and design through supervision and commissioning."
      />

      <section aria-label="Service disciplines" className="container-page py-20 sm:py-24">
        <ul className="grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const projectCount = projects.filter((p) => p.disciplines.includes(service.slug)).length;
            return (
              <li key={service.slug} data-reveal-item>
                <article className="group relative flex h-full flex-col border border-surface-muted bg-white p-8 transition-shadow hover:shadow-card">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-1 w-16 bg-crimson transition-all duration-300 ease-brand group-hover:w-full"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <ServiceIcon icon={service.icon} className="h-10 w-10 text-crimson" />
                    <p className="text-right text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      {projectCount} projects
                    </p>
                  </div>
                  <h2 className="mt-6 text-h3 text-navy sm:text-2xl">{service.title}</h2>
                  <p className="mt-2 leading-relaxed text-ink-muted">{service.summary}</p>
                  <ul className="mt-6 grid gap-2 text-sm text-ink sm:grid-cols-2">
                    {service.capabilities.map((c) => (
                      <li key={c} className="flex gap-2">
                        <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/services/${service.slug}`}
                    className="mt-8 inline-flex items-center gap-1 self-start text-sm font-semibold text-navy hover:text-crimson"
                  >
                    {service.title} in detail
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
