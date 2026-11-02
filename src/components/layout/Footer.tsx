import { Link } from 'react-router';
import { Mail, MapPin, Phone } from 'lucide-react';
import { company } from '@/content/company';
import { mainNav, serviceSlugs } from '@/config/routes';
import { serviceTitle } from '@/content/services';
import { Logo } from '@/components/ui/Logo';
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail';

export function Footer() {
  const { address, phoneDisplay, phoneE164 } = company.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden border-t-4 border-crimson bg-navy text-navy-100">

      <div className="container-page relative grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo variant="light" />
          <p className="mt-5 text-sm leading-relaxed">
            {company.tagline.primary} — {company.tagline.secondary}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-navy-200">{company.footerLine}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-eyebrow uppercase text-white">Company</h2>
          <ul className="mt-3 space-y-0.5 text-sm">
            {mainNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="inline-flex min-h-7 items-center hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/contact" className="inline-flex min-h-7 items-center hover:text-white hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-eyebrow uppercase text-white">Services</h2>
          <ul className="mt-3 space-y-0.5 text-sm">
            {serviceSlugs.map((slug) => (
              <li key={slug}>
                <Link to={`/services/${slug}`} className="inline-flex min-h-7 items-center hover:text-white hover:underline">
                  {serviceTitle(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-eyebrow uppercase text-white">Get in touch</h2>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <p className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <span>
                {address.building}
                <br />
                {address.street}, {address.suburb}
                <br />
                {address.city}, {address.postalCode}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-white" />
              <a href={`tel:${phoneE164}`} className="inline-flex min-h-7 items-center hover:text-white hover:underline">
                {phoneDisplay}
              </a>
            </p>
            <p className="flex gap-3">
              <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <ObfuscatedEmail className="break-all hover:text-white hover:underline" />
            </p>
          </address>
        </div>
      </div>

      <div className="relative border-t border-white/15">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-navy-200 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. Reg: {company.registration}
          </p>
          <Link to="/privacy" className="inline-flex min-h-7 items-center hover:text-white hover:underline">
            Privacy notice (POPIA)
          </Link>
        </div>
      </div>
    </footer>
  );
}
