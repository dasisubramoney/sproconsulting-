import type { ReactNode } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { MapEmbed } from '@/components/contact/MapEmbed';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail';
import { SketchLines } from '@/components/ui/SketchLines';
import { SweepDivider } from '@/components/ui/SweepDivider';
import { company } from '@/content/company';

export default function ContactPage() {
  const { address, phoneDisplay, phoneE164 } = company.contact;

  return (
    <>
      <Seo
        title="Contact us"
        description={`Contact ${company.legalName}, ${address.suburb}, ${address.city}. Tel ${phoneDisplay}.`}
      />
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        intro="Send us a message and one of our engineers will get back to you, or call the office directly."
      >
        <div className="mt-8 flex flex-wrap gap-3 pb-10 sm:pb-12" data-reveal="3">
          <a href="#form-heading" className="btn-primary">
            Send a message
          </a>
          <a href={`tel:${phoneE164}`} className="btn-secondary">
            <Phone aria-hidden="true" className="h-4 w-4" /> Call {phoneDisplay}
          </a>
        </div>
      </PageHero>

      {/* The card overlaps the hero's lower edge. */}
      <div className="container-page relative z-10 -mt-16 pb-20 sm:-mt-20 sm:pb-24">
        <div className="grid overflow-hidden rounded-sm border border-steel-200 bg-white shadow-card lg:grid-cols-12">
          <section
            aria-labelledby="form-heading"
            className="relative p-6 sm:p-10 lg:col-span-7 lg:p-12"
          >
            {/* Copper rule along the top edge, like the service cards. */}
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-copper-700 via-copper-500 to-copper-100" />
            <p>
              <Eyebrow intro>Send a message</Eyebrow>
            </p>
            <h2 id="form-heading" className="mt-3 scroll-mt-28 text-h2 text-steel-700">
              Tell us what you're building
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </section>

          <aside
            aria-labelledby="details-heading"
            className="on-dark relative isolate overflow-hidden bg-ink p-6 text-white sm:p-10 lg:col-span-5 lg:p-12"
          >
            <SweepDivider dark className="absolute inset-x-0 top-0 -z-10 opacity-80" />
            <SketchLines region="-z-10 -bottom-16 -right-20 h-80 w-80 opacity-40" />

            <p>
              <Eyebrow dark intro>
                Our office
              </Eyebrow>
            </p>
            <h2 id="details-heading" className="mt-3 text-h2 text-white">
              Visit or call us
            </h2>

            <address className="mt-8 space-y-3 not-italic">
              <ContactTile icon={<Phone className="h-5 w-5" />} label="Call us">
                <a href={`tel:${phoneE164}`} className="tile-link">
                  {phoneDisplay}
                </a>
              </ContactTile>
              <ContactTile icon={<Mail className="h-5 w-5" />} label="Email us">
                <ObfuscatedEmail className="tile-link break-all !text-base" />
              </ContactTile>
              <ContactTile icon={<MapPin className="h-5 w-5" />} label="Visit us" static>
                <p className="leading-relaxed text-steel-100">
                  {address.building}
                  <br />
                  {address.street}
                  <br />
                  {address.suburb}, {address.city}
                  <br />
                  {address.country}, {address.postalCode}
                </p>
              </ContactTile>
            </address>

            <div className="mt-8">
              <MapEmbed dark />
            </div>

            <p className="mt-8 border-t border-steel-800 pt-6 text-sm leading-relaxed text-steel-200">
              {company.legalName}
              <br />
              Reg: {company.registration}
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

/**
 * A contact row on the dark panel. Linked tiles stretch their link over the whole
 * tile (via `.tile-link::after`) and show an arrow on hover.
 */
function ContactTile({
  icon,
  label,
  static: isStatic = false,
  children,
}: {
  icon: ReactNode;
  label: string;
  static?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex gap-4 rounded-sm border border-steel-800 bg-white/[0.03] p-4 transition-colors duration-200 ease-brand ${
        isStatic ? '' : 'group hover:border-copper-300/60 hover:bg-white/[0.06] focus-within:border-copper-300/60'
      }`}
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-copper-300/40 bg-copper-300/10 text-copper-300 transition-colors duration-200 group-hover:bg-copper-300 group-hover:text-ink"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-eyebrow uppercase text-copper-300">{label}</p>
        <div className="mt-1.5">{children}</div>
      </div>
      {!isStatic && (
        <ArrowUpRight
          aria-hidden="true"
          className="h-5 w-5 shrink-0 self-center text-steel-300 transition-transform duration-200 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-copper-300"
        />
      )}
    </div>
  );
}
