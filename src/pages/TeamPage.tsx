import { Compass, GraduationCap, Laptop } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { CtaBand } from '@/components/sections/CtaBand';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Avatar } from '@/components/ui/Avatar';
import { Blockquote } from '@/components/ui/Blockquote';
import { company } from '@/content/company';
import { leadership, staff } from '@/content/team';

export default function TeamPage() {
  const { hrDevelopment, mdQuote } = company;

  return (
    <>
      <Seo
        title="Our team"
        description="Meet the S-PRO engineers, technicians and project managers, and how we invest in staff development."
      />
      <PageHero
        eyebrow="People"
        title="Our team"
        intro="Engineers, technicians, project managers and administrators — a network of skilled personnel behind every project."
      />

      {/* Leadership */}
      <section aria-labelledby="leadership-heading" className="container-page py-20 sm:py-24">
        <h2 id="leadership-heading" className="sr-only">
          Leadership
        </h2>
        {leadership.map((member) => (
          <div key={member.id} className="grid items-center gap-10 lg:grid-cols-12">
            <div className="flex items-center gap-6 lg:col-span-4">
              <Avatar member={member} size="lg" />
              <div>
                <p className="text-eyebrow uppercase text-maroon">{member.role}</p>
                <h3 className="mt-2 text-h3 text-navy sm:text-2xl">{member.name}</h3>
              </div>
            </div>
            {member.name === mdQuote.name && (
              <div className="lg:col-span-7 lg:col-start-6">
                <Blockquote quote={mdQuote.quote} name={mdQuote.name} role={mdQuote.role} />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Team grid */}
      <section aria-labelledby="team-heading" className="bg-surface-subtle">
        <div className="container-page py-20 sm:py-24">
          <SectionHeading id="team-heading" eyebrow="HR profile" title="The people behind the projects" />
          <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {staff.map((member) => (
              <li key={member.id} data-reveal-item>
                <Avatar member={member} />
                <h3 className="mt-4 font-semibold text-navy">{member.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{member.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HR development */}
      <section aria-labelledby="hr-heading" className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading id="hr-heading" eyebrow="HR development" title="Growing our people" />
          <div className="mt-6 space-y-5 leading-relaxed text-ink-muted">
            {hrDevelopment.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:col-start-8 lg:grid-cols-1">
          <div className="border-t-2 border-crimson bg-surface-subtle p-6">
            <h3 className="flex items-center gap-2 font-semibold text-navy">
              <GraduationCap aria-hidden="true" className="h-5 w-5 text-crimson" /> Staff development
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-ink">
              {hrDevelopment.staffDevelopment.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Compass aria-hidden="true" className="h-4 w-4 text-ink-muted" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t-2 border-crimson bg-surface-subtle p-6">
            <h3 className="flex items-center gap-2 font-semibold text-navy">
              <Laptop aria-hidden="true" className="h-5 w-5 text-crimson" /> Information technology
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ink">{hrDevelopment.informationTechnology}</p>
          </div>
        </div>
      </section>

      <CtaBand title="Work with our team" />
    </>
  );
}
