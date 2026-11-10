import { Fragment, lazy, Suspense } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Droplets } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { useHydrated } from '@/hooks/useHydrated';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SweepDivider } from '@/components/ui/SweepDivider';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HeroBlueprint } from '@/components/sections/HeroBlueprint';
import { ServiceSchematic } from '@/components/ui/ServiceSchematic';
import { CardDecor } from '@/components/ui/CardDecor';
import { StatsBand } from '@/components/sections/StatsBand';
import { ProjectCard } from '@/components/sections/ProjectCard';
import { CtaBand } from '@/components/sections/CtaBand';
import { company } from '@/content/company';
import { services } from '@/content/services';
import { featuredProjects } from '@/content/projects';
import { carbonFootprint } from '@/content/sustainability';

// Hero scroll build, mouse depth and magnetic buttons: GSAP, home page only, after hydration.
const HeroMotion = lazy(() => import('@/motion/HeroMotion'));

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
  const hydrated = useHydrated();
  return (
    <section className="relative isolate overflow-hidden border-b border-steel-200 bg-paper text-ink" data-home-hero>
      {/* Drafting grid: mouse depth on the outer layer, scroll drift on the inner. Oversized so drift never shows an edge. */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-8 -z-10" data-depth="6">
        <div className="drafting-grid absolute inset-0 opacity-70" data-parallax="4" />
      </div>
      <div className="container-page grid items-center gap-12 pb-16 pt-20 sm:pt-28 xl:grid-cols-[minmax(0,1fr)_30rem] xl:py-32">
        <div>
          <p data-reveal>
            <Eyebrow intro>{company.legalName}</Eyebrow>
          </p>
          <h1 className="mt-4 max-w-5xl text-balance text-display">
            <Words text={company.tagline.primary} start={0.08} />
            {/* Display size, so copper-500 meets AA for large text (3.30:1 on paper; 3:1 needed). */}
            <span className="block font-light text-copper-500">
              <Words text={company.tagline.secondary} start={0.24} />
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-steel-600 sm:text-lg" data-reveal="2">
            {company.summary}
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal="3">
            <Link to="/services" className="btn-primary" data-magnetic>
              Our services <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link to="/projects" className="btn-secondary" data-magnetic>
              Project experience
            </Link>
          </div>
        </div>
        <HeroBlueprint className="mx-auto w-full max-w-lg xl:max-w-none" />
      </div>
      {hydrated && (
        <Suspense fallback={null}>
          <HeroMotion />
        </Suspense>
      )}
    </section>
  );
}

// Delay classes per word (classes, not style props: pages are pre-rendered under a strict CSP).
const wordDelays = ['[--d:0s]', '[--d:0.08s]', '[--d:0.16s]', '[--d:0.24s]', '[--d:0.32s]', '[--d:0.4s]'];

/**
 * Splits a line into words that rise one after another (CSS, so the heading paints
 * at once for LCP and works without JS). The text itself is unchanged: screen readers
 * read the words as one line.
 */
function Words({ text, start }: { text: string; start: number }) {
  const first = Math.round(start / 0.08);
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className={`word-rise ${wordDelays[Math.min(first + i, wordDelays.length - 1)]}`}>{word}</span>
        </Fragment>
      ))}
    </>
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
      <ul className="mt-12 grid gap-px overflow-hidden border border-steel-200 bg-steel-200 sm:grid-cols-2 lg:grid-cols-5">
        {services.map((service) => (
          <li key={service.slug} className="bg-white" data-reveal-item>
            <Link
              to={`/services/${service.slug}`}
              className="service-card group flex h-full flex-col bg-white p-6"
              data-tilt
            >
              <CardDecor />
              <ServiceSchematic slug={service.slug} className="h-14 w-14" />
              <h3 className="mt-5 text-h3 text-steel-700">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-600">{service.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-steel-700 group-hover:text-copper-800">
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
    <section aria-labelledby="sustain-heading" className="relative isolate overflow-hidden bg-white">
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
        <div className="relative overflow-hidden bg-ink p-8 text-white sm:p-10">
          <SweepDivider dark className="absolute inset-x-0 bottom-6" />
          <Droplets aria-hidden="true" className="h-8 w-8 text-steel-200" strokeWidth={1.75} />
          <p className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
            {litres}
            <span className="ml-2 text-2xl font-semibold text-steel-200 sm:text-3xl">million litres</span>
          </p>
          <p className="relative mt-4 max-w-sm pb-16 text-steel-100">
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
      <h2 id="clients-heading" className="text-center text-eyebrow uppercase text-steel-600">
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
