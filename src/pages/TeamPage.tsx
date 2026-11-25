import { Compass, ExternalLink as ExternalLinkIcon, GraduationCap, Laptop } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { TeamNetwork } from '@/components/sections/TeamNetwork';
import { CtaBand } from '@/components/sections/CtaBand';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Avatar } from '@/components/ui/Avatar';
import { Blockquote } from '@/components/ui/Blockquote';
import { company } from '@/content/company';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { leadership, staff, type TeamMember } from '@/content/team';

/** LinkedIn's "in" logo: white letters on a LinkedIn-blue rounded square. */
function LinkedInLogo({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="3" className="fill-linkedin" />
      <g className="fill-white">
        <circle cx="6.5" cy="6.6" r="1.75" />
        <rect x="5" y="9.4" width="3" height="9.6" />
        <path d="M10.6 9.4h2.9v1.35c.45-.8 1.5-1.6 3.05-1.6 3.1 0 3.65 2 3.65 4.65V19h-3v-4.7c0-1.15-.05-2.6-1.6-2.6-1.6 0-1.85 1.25-1.85 2.5V19h-3.15z" />
      </g>
    </svg>
  );
}

/** Button-style link to a member's LinkedIn profile; the accessible name includes who it is for. */
function LinkedInLink({ member, className = '' }: { member: TeamMember; className?: string }) {
  return (
    <ExternalLink href={member.linkedin} className={`btn-secondary whitespace-nowrap px-4 ${className}`}>
      <LinkedInLogo className="h-5 w-5 shrink-0" />
      LinkedIn profile
      <span className="sr-only">
        {' '}
        of {member.name} (opens in a new tab)
      </span>
      <ExternalLinkIcon aria-hidden="true" className="h-3.5 w-3.5 opacity-70" />
    </ExternalLink>
  );
}

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
        aside={<TeamNetwork className="w-[22rem]" />}
      />

      {/* Leadership */}
      <section aria-labelledby="leadership-heading" className="container-page py-20 sm:py-24">
        <h2 id="leadership-heading" className="sr-only">
          Leadership
        </h2>
        {leadership.map((member) => (
          <div key={member.id} className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-6">
                <Avatar member={member} size="lg" />
                <div>
                  <p className="text-eyebrow uppercase text-copper-700">{member.role}</p>
                  <h3 className="mt-2 text-h3 text-steel-700 sm:text-2xl">{member.name}</h3>
                </div>
              </div>
              {/* Own row, so it never squeezes beside the photo tile on narrow columns. */}
              {member.linkedin && <LinkedInLink member={member} className="mt-6" />}
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
      <section aria-labelledby="team-heading" className="bg-white">
        <div className="container-page py-20 sm:py-24">
          <SectionHeading id="team-heading" eyebrow="HR profile" title="The people behind the projects" />
          <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {staff.map((member) => (
              <li key={member.id} data-reveal-item>
                <Avatar member={member} />
                <h3 className="mt-4 font-semibold text-steel-700">{member.name}</h3>
                <p className="mt-1 text-sm text-steel-600">{member.role}</p>
                {member.linkedin && <LinkedInLink member={member} className="mt-2" />}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HR development */}
      <section aria-labelledby="hr-heading" className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading id="hr-heading" eyebrow="HR development" title="Growing our people" />
          <div className="mt-6 space-y-5 leading-relaxed text-steel-600">
            {hrDevelopment.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:col-start-8 lg:grid-cols-1">
          <div className="border-t-2 border-copper-500 bg-white p-6">
            <h3 className="flex items-center gap-2 font-semibold text-steel-700">
              <GraduationCap aria-hidden="true" className="h-5 w-5 text-copper-700" /> Staff development
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-ink">
              {hrDevelopment.staffDevelopment.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Compass aria-hidden="true" className="h-4 w-4 text-steel-600" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t-2 border-copper-500 bg-white p-6">
            <h3 className="flex items-center gap-2 font-semibold text-steel-700">
              <Laptop aria-hidden="true" className="h-5 w-5 text-copper-700" /> Information technology
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ink">{hrDevelopment.informationTechnology}</p>
          </div>
        </div>
      </section>

      <CtaBand title="Work with our team" />
    </>
  );
}
