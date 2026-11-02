/**
 * Site-wide settings. Company facts (address, phone, etc.) live in
 * src/content/company.ts — this file is only about the website itself.
 */
export const site = {
  // TODO: confirm canonical domain (apex vs www) before launch.
  url: 'https://sproconsulting.co.za',
  name: 'S-PRO Consulting Engineers',
  titleTemplate: '%s | S-PRO Consulting Engineers',
  defaultTitle: 'S-PRO Consulting Engineers | Sustainable Innovation — Engineering Solutions',
  defaultDescription:
    'Cape Town-based Electrical, Mechanical, Fire Protection, HVAC and Wet Services consulting engineers. Design, supervision and commissioning of complex capital projects.',
  locale: 'en_ZA',
  // TODO: add a 1200×630 social share image at public/images/og-default.jpg, then set this.
  defaultOgImage: undefined as string | undefined,
} as const;
