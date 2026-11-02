import { Check, Target } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Blockquote } from '@/components/ui/Blockquote';
import { company } from '@/content/company';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About S-PRO"
        description="S-PRO Consulting Engineers is an independent black-empowerment Electrical, Mechanical, Industrial Consulting and Project Management company in Cape Town."
      />
      <PageHero eyebrow="About us" title="Engineering capital projects from detail to commissioning" intro={company.introduction[0]} />

      {/* Introduction + overview */}
      <section aria-labelledby="overview-heading" className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="overview-heading" eyebrow="Overview" title="Professional engineering services of the highest quality" />
        </div>
        <div className="space-y-5 leading-relaxed text-ink-muted lg:col-span-7">
          <p>{company.introduction[1]}</p>
          {company.overview.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      {/* Mission statement + aims */}
      <section aria-labelledby="mission-heading" className="on-dark relative isolate overflow-hidden bg-navy text-white">
        <div className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="text-eyebrow uppercase text-navy-100">Mission statement</p>
            <h2 id="mission-heading" className="mt-4 text-h2 font-semibold leading-snug">
              “{company.missionStatement}”
            </h2>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-eyebrow uppercase text-navy-100">
              <Target aria-hidden="true" className="h-4 w-4" /> Aims &amp; objectives
            </h3>
            <ul className="mt-6 space-y-4">
              {company.aims.map((aim) => (
                <li key={aim} className="flex gap-3 border-b border-white/15 pb-4 text-lg">
                  <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-navy-100" />
                  {aim}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mission, vision & BEE */}
      <section aria-label="Mission and vision" className="container-page grid gap-16 py-20 sm:py-24 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Our mission" title="Independent and black-empowered" />
          <div className="mt-6 space-y-5 leading-relaxed text-ink-muted">
            {company.mission.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div id="bee">
          <SectionHeading eyebrow="Our vision & BEE" title="A fully representative team" />
          <div className="mt-6 space-y-5 leading-relaxed text-ink-muted">
            {company.vision.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Overall vision + MD quote */}
      <section aria-labelledby="vision-heading" className="bg-surface-subtle">
        <div className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="vision-heading" eyebrow="Overall vision" title="Strong service delivery through sustainable growth" />
            <div className="mt-6 space-y-5 leading-relaxed text-ink-muted">
              {company.overallVision.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <Blockquote quote={company.mdQuote.quote} name={company.mdQuote.name} role={company.mdQuote.role} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
