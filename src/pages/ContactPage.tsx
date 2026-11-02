import { Mail, MapPin, Phone } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { MapEmbed } from '@/components/contact/MapEmbed';
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail';
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
      />

      <div className="container-page grid gap-16 py-20 sm:py-24 lg:grid-cols-12">
        <section aria-labelledby="form-heading" className="lg:col-span-7">
          <h2 id="form-heading" className="text-h2 text-navy">
            Send us a message
          </h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>

        <aside aria-labelledby="details-heading" className="lg:col-span-5">
          <h2 id="details-heading" className="text-h2 text-navy">
            Our office
          </h2>
          <address className="mt-8 space-y-6 not-italic">
            <div className="flex gap-4">
              <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-crimson" />
              <p className="leading-relaxed text-ink">
                {address.building}
                <br />
                {address.street}
                <br />
                {address.suburb}, {address.city}
                <br />
                {address.country}, {address.postalCode}
              </p>
            </div>
            <div className="flex gap-4">
              <Phone aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-crimson" />
              <a href={`tel:${phoneE164}`} className="font-semibold text-navy hover:text-crimson hover:underline">
                {phoneDisplay}
              </a>
            </div>
            <div className="flex gap-4">
              <Mail aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-crimson" />
              <ObfuscatedEmail className="break-all font-semibold text-navy hover:text-crimson hover:underline" />
            </div>
          </address>
          <p className="mt-8 text-sm text-ink-muted">
            {company.legalName}
            <br />
            Reg: {company.registration}
          </p>
          <div className="mt-10">
            <MapEmbed />
          </div>
        </aside>
      </div>
    </>
  );
}
