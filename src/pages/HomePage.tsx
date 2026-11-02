import { Link } from 'react-router';
import { ArrowRight, Droplets } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { SlashBands } from '@/components/ui/SlashBands';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { StatsBand } from '@/components/sections/StatsBand';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { CtaBand } from '@/components/sections/CtaBand';
import { company } from '@/content/company';
import { services } from '@/content/services';
import { featuredProjects } from '@/content/projects';
import { carbonFootprint } from '@/content/sustainability';

export default function HomePage() {
  return (
    <>
      <Seo />
      <Hero />
      <Disciplines />
      <StatsBand />
      <FeaturedProjects />
      <SustainabilityTeaser />
      <ClientLogos />
      <CtaBand />
    </>
  );
}

function Hero() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy text-white">
      <SlashBands region="-z-10 bottom-0 right-0 hidden h-[55%] w-[38%] xl:block" angle={-24} size="lg" intro />
      <SlashBands region="-z-10 inset-x-0 bottom-0 h-24 xl:hidden" angle={-24} intro />
      <div className="container-page pb-36 pt-20 sm:pt-28 xl:py-36">
        <p className="text-eyebrow uppercase text-navy-100" data-reveal>
          {company.legalName}
        </p>
        <h1 className="mt-4 max-w-4xl text-display" data-reveal="1">
          {company.tagline.primary}
          <span className="block font-light text-navy-100">{company.tagline.secondary}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy-50 sm:text-lg" data-reveal="2">
          {company.summary}
        </p>
        <div className="mt-10 flex flex-wrap gap-3" data-reveal="3">
          <Link to="/services" className="btn-primary">
            Our services <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link to="/projects" className="btn-on-dark">
            Project experience
          </Link>
        </div>
      </div>
    </section>
  );
}

function Disciplines() {
  return (
    <section aria-labelledby="disciplines-heading" className="container-page py-20 sm:py-24">
      <SectionHeading
        id="disciplines-heading"
        eyebrow="What we do"
        title="Engineering disciplines under one roof"
        intro="Detailing, design, supervision and commissioning for commercial buildings and industrial projects."
      />
      <ul className="mt-12 grid gap-px overflow-hidden border border-surface-muted bg-surface-muted sm:grid-cols-2 lg:grid-cols-5">
        {services.map((service) => (
          <li key={service.slug} className="bg-white" data-reveal-item>
            <Link
              to={`/services/${service.slug}`}
              className="group flex h-full flex-col p-6 transition-colors hover:bg-surface-subtle"
            >
              <ServiceIcon icon={service.icon} className="h-8 w-8 text-crimson" />
              <h3 className="mt-5 text-h3 text-navy">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{service.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-crimson">
                Learn more
                <span className="sr-only"> about {service.title}</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeaturedProjects() {
  return (
    <section aria-labelledby="featured-heading" className="container-page py-20 sm:py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="featured-heading"
          eyebrow="Selected projects"
          title="Airports, hospitals, malls and industry"
        />
        <Link to="/projects" className="btn-secondary shrink-0">
          All projects <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <li key={project.id} data-reveal-item>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SustainabilityTeaser() {
  const litres = (carbonFootprint.litresSavedPerYear / 1_000_000).toFixed(2);
  return (
    <section aria-labelledby="sustain-heading" className="relative isolate overflow-hidden bg-surface-subtle">
      <div className="container-page grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2">
        <div>
          <SectionHeading
            id="sustain-heading"
            eyebrow="Sustainable innovation"
            title="Water and energy systems that take load off the grid"
            intro="We combine reclaimed rainwater, grey water, black water and ground water with renewable energy — reducing the load on municipal water, stormwater and electricity networks."
          />
          <Link to="/sustainability" className="btn-primary mt-8">
            Our sustainability approach <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative overflow-hidden bg-navy p-8 text-white sm:p-10">
          <SlashBands region="inset-x-0 bottom-0 h-14" angle={-20} size="sm" />
          <Droplets aria-hidden="true" className="h-8 w-8 text-navy-100" strokeWidth={1.75} />
          <p className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
            {litres}
            <span className="ml-2 text-2xl font-semibold text-navy-100 sm:text-3xl">million litres</span>
          </p>
          <p className="relative mt-4 max-w-sm pb-16 text-navy-50">
            Potential water saving per year across {carbonFootprint.households} households using our reclaimed water
            solutions.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Renders only once approved client logos are added to company.clientLogos. */
function ClientLogos() {
  if (company.clientLogos.length === 0) return null;
  return (
    <section aria-labelledby="clients-heading" className="container-page py-16">
      <h2 id="clients-heading" className="text-center text-eyebrow uppercase text-ink-muted">
        Trusted by
      </h2>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {company.clientLogos.map((logo) => (
          <li key={logo.name}>
            <img
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              loading="lazy"
              decoding="async"
              className="h-10 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
