import { lazy, Suspense } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Check, CloudRain, Droplets, Gauge, Recycle } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { WaterRail, WaterStage } from '@/components/sections/WaterNetwork';
import { HouseRow } from '@/components/ui/HouseRow';
import { PopulationChart } from '@/components/ui/PopulationChart';
import { useHydrated } from '@/hooks/useHydrated';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { company } from '@/content/company';
import { projects } from '@/content/projects';
import {
  carbonFootprint,
  climateContext,
  offering,
  sustainableInnovation,
  waterSystems,
} from '@/content/sustainability';

// "Follow the Water", the house wave and the chart: GSAP, this page only, after hydration.
const WaterMotion = lazy(() => import('@/motion/WaterMotion'));

const systemIcons = [CloudRain, Recycle, Droplets, Gauge];
const projectName = new Map(projects.map((p) => [p.id, p.name]));

export default function SustainabilityPage() {
  const { households, litresSavedPerYear } = carbonFootprint;
  const { low, high, unit } = climateContext.population2030;
  const hydrated = useHydrated();

  return (
    <>
      <Seo
        title="Sustainability"
        description="Reclaimed rainwater, grey water, borehole purification and renewable energy systems that reduce load on municipal water and electricity networks."
      />
      <PageHero eyebrow="Sustainable innovation" title="Engineering for a water- and energy-stressed future" intro={sustainableInnovation.intro} />

      {/* "Follow the Water": a pipe runs down the gutter through the five sections below. */}
      <div className="relative" data-water>
        <WaterRail />

        {/* Climate context */}
        <section aria-labelledby="climate-heading" className="relative" data-water-stage>
          <WaterStage index={0} />
          <div className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading id="climate-heading" eyebrow="The challenge" title="The current climate change" />
              <div className="mt-8 border-l-2 border-copper-500 pl-5">
                <p className="text-5xl font-bold tracking-tight text-steel-700">
                  {low}–{high}
                  <span className="ml-2 text-xl font-semibold text-steel-600">{unit}</span>
                </p>
                <p className="mt-2 text-sm text-steel-600">Projected South African population by 2030</p>
              </div>
              <PopulationChart year={2030} />
            </div>
            <ul className="space-y-5 lg:col-span-7">
              {climateContext.points.map((point) => (
                <li key={point} className="flex gap-4 border-b border-steel-200 pb-5 leading-relaxed text-ink">
                  <span aria-hidden="true" className="mt-2.5 h-0.5 w-6 shrink-0 bg-copper-500" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Carbon footprint */}
        <section aria-labelledby="footprint-heading" className="on-dark relative isolate overflow-hidden bg-ink text-white" data-water-stage>
          <WaterStage index={1} surface="ink" />
          <div className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-2">
            <div>
              <SectionHeading
                id="footprint-heading"
                tone="dark"
                eyebrow="Carbon footprint"
                title="Measurable savings"
                intro={carbonFootprint.intro}
              />
              <p className="mt-10 text-6xl font-bold tracking-tight sm:text-7xl">
                {/* Counts up when scrolled into view (useCountUp). */}
                <span className="text-copper-500 tabular-nums" data-stat>
                  {(litresSavedPerYear / 1_000_000).toFixed(2)}
                </span>
                <span className="mt-2 block text-xl font-semibold text-steel-200 sm:text-2xl">
                  million litres of water a year
                </span>
              </p>
              <p className="mt-3 text-steel-200">Potential saving across {households} households.</p>
              <HouseRow count={households} />
            </div>
            <div>
              <h3 className="text-eyebrow uppercase text-copper-300">Follow-on benefits</h3>
              <ul className="mt-6 grid gap-x-6 sm:grid-cols-2">
                {carbonFootprint.followOnBenefits.map((b) => (
                  <li key={b} className="flex gap-3 border-b border-white/15 py-3">
                    <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-copper-300" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Offering */}
        <section aria-labelledby="offering-heading" className="relative" data-water-stage>
          <WaterStage index={2} />
          <div className="container-page py-20 sm:py-24">
            <SectionHeading id="offering-heading" eyebrow="Our offering" title={sustainableInnovation.team} />
            <ol className="mt-12 grid gap-px overflow-hidden border border-steel-200 bg-steel-200 sm:grid-cols-2 lg:grid-cols-3">
              {offering.map((item, i) => (
                <li key={item.title} className="bg-white p-8" data-reveal-item>
                  <p aria-hidden="true" className="text-sm font-bold text-copper-700">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 text-h3 text-steel-700">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-steel-600">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Water systems */}
        <section aria-labelledby="systems-heading" className="relative bg-white" data-water-stage>
          <WaterStage index={3} surface="white" />
          <div className="container-page py-20 sm:py-24">
            <SectionHeading
              id="systems-heading"
              eyebrow="Water systems"
              title="Proven on real projects"
              intro={
                <>
                  Each system below has been designed and delivered by S-PRO.{' '}
                  <Link to="/services/wet-services" className="font-semibold text-steel-700 underline hover:text-copper-800">
                    See Wet Services
                  </Link>{' '}
                  for the full scope.
                </>
              }
            />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {waterSystems.map((system, i) => {
                const Icon = systemIcons[i % systemIcons.length];
                return (
                  <li key={system.title} className="flex flex-col border border-steel-200 bg-white p-6" data-reveal-item>
                    <Icon aria-hidden="true" className="h-8 w-8 text-copper-700" strokeWidth={1.75} />
                    <h3 className="mt-5 text-h3 text-steel-700">{system.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-steel-600">{system.body}</p>
                    <div className="mt-auto pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-steel-600">Delivered at</p>
                      <ul className="mt-2 space-y-1 text-sm font-medium text-steel-700">
                        {system.projectIds.map((id) => (
                          <li key={id}>{projectName.get(id)}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link to="/projects?discipline=wet-services" className="btn-secondary mt-10">
              Wet services projects <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Overall vision */}
        <section aria-labelledby="overall-heading" className="relative" data-water-stage>
          <WaterStage index={4} />
          <div className="container-page py-20 sm:py-24">
            <SectionHeading id="overall-heading" eyebrow="Overall vision" title="Sustainable growth through renewable solutions" />
            <div className="mt-6 max-w-prose space-y-5 text-lg leading-relaxed text-steel-600">
              {company.overallVision.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      </div>
      {hydrated && (
        <Suspense fallback={null}>
          <WaterMotion />
        </Suspense>
      )}

      <CtaBand
        title="Considering a sustainable building services solution?"
        body="Ask us how reclaimed water, fire water storage and energy-efficient plant could work for your development."
      />
    </>
  );
}
