/**
 * Company facts and About-page copy. Edit here — the whole site reads from this file.
 *
 * Rule: only add facts that appear in the approved company profile.
 * Copy below is taken from the 2025 Company & Sustainability Profile, lightly
 * copy-edited for grammar. TODO: client to approve the edited wording.
 */
export const company = {
  legalName: 'S-PRO Consulting Engineers (Pty) Ltd',
  shortName: 'S-PRO',
  registration: '2012/04730/07',
  tagline: { primary: 'Sustainable Innovation', secondary: 'Engineering Solutions' },
  footerLine: 'Electrical, Mechanical, Fire Protection Engineers & Facilities Management',

  contact: {
    address: {
      building: 'Boulevard Place, 5th Floor, Unit SL 303/A',
      street: '3 Heron Crescent',
      suburb: 'Century City',
      city: 'Cape Town',
      region: 'Western Cape',
      postalCode: '7441',
      country: 'South Africa',
      countryCode: 'ZA',
    },
    phoneDisplay: '+27 (0)21 671 0713',
    phoneE164: '+27216710713',
    // Stored in parts and assembled client-side to reduce scraping. See ObfuscatedEmail.
    email: { user: 'shaun', domain: 'sproconsulting.co.za' },
    // TODO: confirm map pin. Used only for the click-to-load map on /contact.
    map: { lat: -33.8915, lng: 18.5115 },
  },

  /** One-sentence positioning, used on the home page and in meta descriptions. */
  summary:
    'A full-service Electrical, Mechanical, Industrial Consulting and Project Management company, involved in the detailing, design, supervision and commissioning of large, complex capital projects.',

  introduction: [
    'We are a full-service Electrical, Mechanical, Industrial Consulting and Project Management services company. Our involvement in major capital works across these disciplines has seen the company take part in the detailing, design, supervision and commissioning of a number of large, complex projects.',
    'This has enabled us to develop strong project management skills and a flexible approach to resource management, so that we operate effectively as the demands of each project require and satisfy the needs of the client.',
  ],

  overview: [
    'We are dedicated to providing our clients with professional engineering services of the highest quality, with a direct focus on meeting their needs. We respond to clients with promptness, sensitivity, respect and integrity.',
    'The company has CAD systems in addition to computer and network facilities used for design and administration. Our CAD systems use current technology and are compatible with many other systems, allowing information to be exchanged freely between professional teams.',
    'We consider ourselves well equipped to undertake the design, documentation management and handover of the services you require.',
  ],

  missionStatement:
    'Strive towards becoming leaders within the Consulting Engineering market by providing excellent service.',

  aims: [
    'To earn a reputation within the market',
    'Strive towards becoming market leaders',
    'Stay ahead of competitors through Research & Development',
  ],

  mission: [
    'S-PRO is an independent black empowerment company, managed by black engineers with skills in the electrical and mechanical consulting and manufacturing industries.',
    'We have all the necessary technology and equipment to ensure the timeous and professional execution of projects. We offer consulting and contract administration services for commercial buildings and industrial projects.',
  ],

  /** "Our Vision" and "BEE" share the same text in the profile; shown once on /about. */
  vision: [
    'S-PRO is committed to maintaining a fully representative personnel. We embrace gender equity in line with regulatory requirements as a measuring stick for meeting our policy obligations.',
    'As an organisation we enhance personnel growth and skills specialisation to meet our strategic objectives, and we have pooled together a network of skilled personnel — with gender equity and balance as a necessary platform.',
    'Our strategy is strengthened by a professional network of skills that reflects S-PRO as a Black Economic Empowerment organisation with a proven track record.',
  ],

  overallVision: [
    'Our overarching goal is to enable clients to provide strong service delivery through sustainable growth using renewable solutions.',
    'We aim to reduce fruitless client expenditure through innovative technologies, allowing money to be allocated to other vital areas.',
  ],

  hrDevelopment: {
    intro: [
      'To fulfil the objectives of Black empowerment, each staff member is offered financial assistance to further their studies.',
      'We offer practical training, or support with purchasing a personal computer, so that people from disadvantaged backgrounds can grow to meet the requirements for entry and integration into positions where they play a meaningful part in growing the company.',
    ],
    staffDevelopment: ['On-site training', 'Career guidance'],
    informationTechnology:
      'The practice has all the necessary technology and equipment to ensure the timeous and professional execution of all projects.',
  },

  /**
   * Client logo strip on the home page. Hidden while empty.
   * TODO: add logos only with each client's written permission. SVG/WebP in public/images/clients/.
   */
  clientLogos: [] as { name: string; src: string; width: number; height: number }[],

  mdQuote: {
    name: 'S. Pietersen',
    role: 'Managing Director',
    quote:
      'S-PRO (Pty) Ltd is committed to the uplifting of disadvantaged communities and individuals, always keeping its major criteria to the fore, i.e. that of technical competence, professionalism, dedication, enthusiasm and the ability to focus on the needs of the clients.',
  },
} as const;
