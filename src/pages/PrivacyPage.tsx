import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/components/sections/PageHero';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail';
import { company } from '@/content/company';

/*
 * POPIA privacy notice — DRAFT.
 * TODO (legal review required before launch):
 *  - Confirm the Information Officer's name and contact details (and registration with the Information Regulator).
 *  - Set the retention period for enquiries.
 *  - Confirm Netlify's data-processing terms cover cross-border transfer (POPIA s72).
 *  - Confirm the Information Regulator's current contact details.
 *  - Set the "last updated" date.
 */
const LAST_UPDATED = 'TODO: set date after legal review';

export default function PrivacyPage() {
  const { address, phoneDisplay, phoneE164 } = company.contact;

  return (
    <>
      <Seo
        title="Privacy notice"
        description={`How ${company.legalName} collects, uses and protects personal information under POPIA.`}
      />
      <PageHero eyebrow="POPIA" title="Privacy notice" intro={`Last updated: ${LAST_UPDATED}`} />

      <article className="container-page py-16 sm:py-20">
        <div className="max-w-prose space-y-10 leading-relaxed text-ink">
          <Section title="1. Who we are">
            <p>
              {company.legalName} (registration number {company.registration}) is the responsible party for personal
              information collected through this website, under the Protection of Personal Information Act 4 of 2013
              (POPIA).
            </p>
            <p>
              {address.building}, {address.street}, {address.suburb}, {address.city}, {address.postalCode},{' '}
              {address.country}.
            </p>
          </Section>

          <Section title="2. What we collect">
            <p>We only collect personal information you choose to give us through the contact form:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>your name and email address (required);</li>
              <li>your phone number and company name (optional);</li>
              <li>the service you are interested in and your message.</li>
            </ul>
            <p>
              Our hosting provider automatically processes technical information such as your IP address and browser
              type to deliver and secure the website.
            </p>
            <p>
              This website does not use advertising or analytics cookies, and does not use third-party tracking.
            </p>
          </Section>

          <Section title="3. Why we use it">
            <p>
              We use your details only to respond to your enquiry and, if you ask us to, to prepare a proposal or
              quotation. We process this information with your consent, which you give by ticking the box on the
              contact form, and to take steps you have asked for before entering into a contract.
            </p>
            <p>We do not sell your information or use it for direct marketing.</p>
          </Section>

          <Section title="4. Who we share it with">
            <p>
              Form submissions are received and stored by our website host, Netlify, Inc., acting as our operator.
              Netlify stores data outside South Africa. We rely on its contractual data-protection commitments to
              protect your information to a standard substantially similar to POPIA, as section 72 requires.
            </p>
            <p>
              If you choose to load the map on our{' '}
              <Link to="/contact" className="font-semibold text-navy underline hover:text-crimson">
                contact page
              </Link>
              , your browser connects to OpenStreetMap, which will receive your IP address. The map does not load unless
              you click “Load map”.
            </p>
            <p>We will only disclose your information otherwise where the law requires it.</p>
          </Section>

          <Section title="5. How long we keep it">
            {/* TODO: confirm retention period with client / legal. */}
            <p>
              We keep enquiries only for as long as needed to respond and to meet our legal and professional
              obligations, after which they are deleted.
            </p>
          </Section>

          <Section title="6. How we protect it">
            {/* TODO: confirm with client who has access to Netlify form submissions. */}
            <p>
              The website is served only over encrypted HTTPS connections with strict security headers. Access to form
              submissions is limited to authorised S-PRO staff.
            </p>
          </Section>

          <Section title="7. Your rights">
            <p>Under POPIA you have the right to:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>ask whether we hold personal information about you, and request a copy of it;</li>
              <li>ask us to correct or delete information that is inaccurate, out of date or no longer needed;</li>
              <li>object to us processing your information, or withdraw your consent at any time;</li>
              <li>lodge a complaint with the Information Regulator.</li>
            </ul>
            <p>
              Information Regulator (South Africa):{' '}
              <ExternalLink href="https://inforegulator.org.za/" className="font-semibold text-navy underline hover:text-crimson">
                inforegulator.org.za<span className="sr-only"> (opens in a new tab)</span>
              </ExternalLink>
            </p>
          </Section>

          <Section title="8. Contact us">
            {/* TODO: name the Information Officer once confirmed. */}
            <p>To exercise your rights or ask about this notice, contact our Information Officer:</p>
            <ul className="space-y-1">
              <li>
                Email: <ObfuscatedEmail className="font-semibold text-navy underline hover:text-crimson" />
              </li>
              <li>
                Phone:{' '}
                <a href={`tel:${phoneE164}`} className="font-semibold text-navy underline hover:text-crimson">
                  {phoneDisplay}
                </a>
              </li>
            </ul>
          </Section>
        </div>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-h3 text-navy sm:text-2xl">{title}</h2>
      {children}
    </section>
  );
}
