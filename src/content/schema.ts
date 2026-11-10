import { site } from '@/config/site';
import { company } from './company';
import { services } from './services';

/**
 * JSON-LD structured data built from the content files.
 * Rendered by <StructuredData> as a non-executable data block (allowed by the CSP).
 */
export function organizationSchema() {
  const { address, phoneE164 } = company.contact;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#organization`,
    name: company.legalName,
    alternateName: company.shortName,
    slogan: `${company.tagline.primary} — ${company.tagline.secondary}`,
    description: company.summary,
    url: site.url,
    telephone: phoneE164,
    logo: `${site.url}/images/brand/SPRO_logo_clean.png`,
    // TODO: add `image` once project photography is supplied.
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.building}, ${address.street}, ${address.suburb}`,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    areaServed: { '@type': 'Country', name: 'South Africa' },
    knowsAbout: services.map((s) => `${s.title} engineering`),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Engineering services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: `${s.title} engineering`,
          description: s.summary,
          url: `${site.url}/services/${s.slug}`,
        },
      })),
    },
  };
}
