import type { ServiceSlug } from '@/config/routes';

/**
 * Project experience, newest first. Source: company profile, pages 14–17.
 *
 * - `nature` and `scope` are shown as written in the profile.
 * - `disciplines` drives the /projects filter. It is taken from `nature`, plus the
 *   discipline a `scope` item belongs to (e.g. lifts design → mechanical,
 *   HVAC design → hvac). Comments mark anything inferred.
 * - `location` is filled in only where the project name itself states the place.
 *   TODO: client to supply locations for the rest.
 */

export interface ProjectLocation {
  city?: string;
  region?: string;
  country: string;
}

export interface Project {
  id: string;
  name: string;
  startYear: number;
  /** Set when the project ran over several years. */
  endYear?: number;
  nature: string;
  scope?: string;
  disciplines: ServiceSlug[];
  location?: ProjectLocation;
  /** Joint appointment partner, if any. */
  partner?: string;
  /** Shown on the home page. */
  featured?: boolean;
  /** Path under public/images/projects/. TODO: supply project photography. */
  image?: string;
}

const WC = (city: string): ProjectLocation => ({ city, region: 'Western Cape', country: 'South Africa' });
const GP = (city: string): ProjectLocation => ({ city, region: 'Gauteng', country: 'South Africa' });

export const projects: Project[] = [
  // 2025
  {
    id: 'cape-town-international-airport-2025',
    name: 'Cape Town International Airport',
    startYear: 2025,
    nature: 'Fire protection, wet services, mechanical and electrical',
    scope: 'Lifts design',
    disciplines: ['fire', 'wet-services', 'mechanical', 'electrical'],
    location: WC('Cape Town'),
    featured: true,
  },
  {
    id: 'or-tambo-international-airport',
    name: 'OR Tambo International Airport',
    startYear: 2025,
    nature: 'Fire protection, wet services',
    scope: 'Carousel design',
    // mechanical inferred from "carousel design" — TODO confirm.
    disciplines: ['fire', 'wet-services', 'mechanical'],
    location: { region: 'Gauteng', country: 'South Africa' },
    featured: true,
  },
  {
    id: 'george-airport',
    name: 'George Airport',
    startYear: 2025,
    nature: 'Wet services',
    scope: 'Lifts design',
    disciplines: ['wet-services', 'mechanical'],
    location: WC('George'),
  },
  {
    id: 'transnet',
    name: 'Transnet',
    startYear: 2025,
    nature: 'Fire protection and wet services',
    scope: 'Plumbing, drainage and rainwater design',
    disciplines: ['fire', 'wet-services'],
  },
  {
    id: 'daveyton-hospital',
    name: 'Daveyton Hospital',
    startYear: 2025,
    nature: 'Fire protection, wet services',
    disciplines: ['fire', 'wet-services'],
    location: GP('Daveyton'),
    featured: true,
  },
  {
    id: 'middestad-mall',
    name: 'Middestad Mall',
    startYear: 2025,
    nature: 'Fire protection, wet services',
    disciplines: ['fire', 'wet-services'],
  },
  {
    id: 'atteridgeville-park',
    name: 'Atteridgeville Park',
    startYear: 2025,
    nature: 'Fire protection, wet services',
    disciplines: ['fire', 'wet-services'],
    location: GP('Atteridgeville'),
  },
  {
    id: 'woolworths-adelphi-centre',
    name: 'Woolworths Adelphi Centre, Sea Point',
    startYear: 2025,
    nature: 'Fire protection, wet services',
    disciplines: ['fire', 'wet-services'],
    location: WC('Sea Point, Cape Town'),
  },
  {
    id: 'cjp-chemicals',
    name: 'CJP Chemicals',
    startYear: 2025,
    nature: 'Fire protection',
    disciplines: ['fire'],
  },
  {
    id: 'heneways-logistics',
    name: 'Heneways Logistics',
    startYear: 2025,
    nature: 'Fire protection',
    disciplines: ['fire'],
  },
  {
    id: 'gugulethu-mall',
    name: 'Gugulethu Mall',
    startYear: 2025,
    nature: 'Fire and HVAC design',
    disciplines: ['fire', 'hvac'],
    location: WC('Gugulethu, Cape Town'),
  },
  {
    id: 'woolworths-gugulethu',
    name: 'Woolworths Gugulethu',
    startYear: 2024,
    endYear: 2025,
    nature: 'Fire protection, wet services',
    disciplines: ['fire', 'wet-services'],
    location: WC('Gugulethu, Cape Town'),
  },
  {
    id: 'adowa-student-village',
    name: 'Adowa Student Village',
    startYear: 2020,
    endYear: 2025,
    nature: 'Fire protection',
    scope: 'Rational fire design',
    disciplines: ['fire'],
  },

  // 2024
  {
    id: 'booksite',
    name: 'Booksite',
    startYear: 2024,
    nature: 'Fire protection, mechanical and electrical',
    scope: 'Lifts and HVAC design',
    disciplines: ['fire', 'mechanical', 'electrical', 'hvac'],
  },
  {
    id: 'cdh-lusaka',
    name: 'CDH Lusaka',
    startYear: 2024,
    nature: 'Fire protection and wet services',
    disciplines: ['fire', 'wet-services'],
    location: { city: 'Lusaka', country: 'Zambia' },
  },
  {
    id: 'travenna-campus-pretoria',
    name: 'Travenna Campus Pretoria',
    startYear: 2024,
    nature: 'Fire protection and smoke extraction',
    disciplines: ['fire', 'hvac'],
    location: GP('Pretoria'),
  },
  {
    id: 'everflo-atlantis',
    name: 'Everflo Atlantis',
    startYear: 2024,
    nature: 'Fire protection',
    scope: 'Fire detection design',
    disciplines: ['fire'],
    location: WC('Atlantis'),
  },
  {
    id: 'vangate-mall',
    name: 'Vangate Mall',
    startYear: 2024,
    nature: 'Fire protection',
    disciplines: ['fire'],
  },
  {
    id: 'carrinho-industria',
    name: 'Carrinho Indústria',
    startYear: 2024,
    nature: 'Fire condition assessment',
    scope: 'Fire condition assessment of the warehouse facility, Rua de S. Tomé S/N, Bairro da Luz',
    disciplines: ['fire'],
    location: { city: 'Lobito', country: 'Angola' },
    partner: 'Afri-Eng',
    featured: true,
  },

  // 2023
  {
    id: 'uwc-life-science-eugene-morris-hospital',
    name: 'UWC Life Science / Eugene Morris Hospital',
    startYear: 2023,
    nature: 'Fire protection',
    scope: 'Gas suppression, wet services',
    disciplines: ['fire', 'wet-services'],
  },
  {
    id: 'unisa-parow',
    name: 'UNISA Parow',
    startYear: 2023,
    nature: 'Fire protection',
    scope: 'Gas suppression',
    disciplines: ['fire'],
    location: WC('Parow, Cape Town'),
  },
  {
    id: 'city-power-2023',
    name: 'City Power',
    startYear: 2023,
    nature: 'Fire protection',
    scope: 'Gas suppression',
    disciplines: ['fire'],
  },
  {
    // TODO: confirm spelling of "Liegtensgrie" with client.
    id: 'liegtensgrie-solar-panel-plant',
    name: 'Liegtensgrie Solar Panel Plant',
    startYear: 2023,
    nature: 'Fire protection',
    scope: 'Project management',
    disciplines: ['fire'],
  },

  // 2022
  {
    id: 'city-power-johannesburg',
    name: 'City Power Johannesburg',
    startYear: 2022,
    nature: 'Fire protection',
    scope: 'Fire design (fire assessment design), HVAC design',
    disciplines: ['fire', 'hvac'],
    location: GP('Johannesburg'),
  },

  // 2021 and earlier
  {
    id: 'uct-residences',
    name: 'University of Cape Town Residences',
    startYear: 2021,
    nature: 'Fire protection revitalisation',
    scope: 'Design, drawings, council submission, construction monitoring, final inspection and sign-off',
    disciplines: ['fire'],
    location: WC('Cape Town'),
  },
  {
    id: 'kuils-river-station',
    name: 'Kuils River Station',
    startYear: 2020,
    nature: 'Rational fire design',
    scope: 'Commissioning, design, drawings, council submission, construction monitoring, final inspection and sign-off',
    disciplines: ['fire'],
    location: WC('Kuils River'),
  },
  {
    id: 'new-national-library-cape-town',
    name: 'New National Library, Cape Town',
    startYear: 2018,
    endYear: 2020,
    nature: 'Gas suppression',
    scope: 'Design, drawings, council submission, construction monitoring, final inspection and sign-off',
    disciplines: ['fire'],
    location: WC('Cape Town'),
  },
  {
    id: 'presidents-hotel',
    name: 'Presidents Hotel',
    startYear: 2019,
    nature: 'Borehole purification and grey water system',
    scope: 'Commissioning, design, drawings, council submission, construction monitoring, final inspection and sign-off',
    disciplines: ['wet-services'],
  },
  {
    id: 'acsa-cape-town-international-airport-2017',
    name: 'ACSA Cape Town International Airport',
    startYear: 2017,
    nature: 'Water management',
    scope:
      'Rainwater harvesting system using Jojo tanks at Parkade 1 and 2 to feed ablution facilities; design, supply, installation, testing and commissioning of a water purification plant',
    disciplines: ['wet-services'],
    location: WC('Cape Town'),
    featured: true,
  },
  {
    id: 'woolworths-distribution-centre',
    name: 'Woolworths Distribution Centre',
    startYear: 2014,
    nature: 'Borehole purification and grey water system',
    scope: 'Commissioning, design, drawings, council submission, construction monitoring, final inspection and sign-off',
    disciplines: ['wet-services'],
  },
  {
    id: 'unisa-litho-printing-pretoria',
    name: 'UNISA Litho Printing, Pretoria',
    startYear: 2012,
    nature: 'Fire',
    scope: 'Design, drawings, council submission, construction monitoring, final inspection and sign-off',
    disciplines: ['fire'],
    location: GP('Pretoria'),
  },
  {
    id: 'cape-town-train-station',
    name: 'Cape Town Train Station',
    startYear: 2008,
    nature: 'Mechanical',
    scope: 'High-tech railway station precinct',
    disciplines: ['mechanical'],
    location: WC('Cape Town'),
  },
  {
    id: 'nelson-mandela-stadium',
    name: 'Nelson Mandela Stadium',
    startYear: 2007,
    nature: 'Fire protection installation',
    scope: 'World-class soccer stadium',
    disciplines: ['fire'],
  },
  {
    id: 'va-waterfront-shopping-centre',
    name: 'V&A Waterfront Shopping Centre',
    startYear: 1999,
    nature: 'Mechanical and electrical installation',
    scope:
      '44,000 m² of underground parking — design, supervision and contract administration of air conditioning, ventilation, sprinklers, fire and smoke control, plumbing, drainage, electrical and security services',
    disciplines: ['mechanical', 'electrical', 'hvac', 'fire', 'wet-services'],
    location: WC('Cape Town'),
    featured: true,
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  project: string;
  /** Only approved testimonials are rendered. */
  approved: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: 'forte-architetti-arcadia-rd',
    // Wording as it appears in the profile. TODO: confirm exact wording and get written permission, then set approved: true.
    quote:
      'Arcadia Rd development is finally completed. It has been a great pleasure to take this journey with you all on this project, and we do hope we will have the chance to work together again. Forte Architetti thanks you all for the great job and support you have provided to achieve this amazing goal.',
    author: 'Forte Architetti',
    project: 'Arcadia Rd development',
    approved: false,
  },
];

/** "2024", or "2020–2025" for multi-year projects. */
export function projectYears(project: Project): string {
  return project.endYear ? `${project.startYear}–${project.endYear}` : String(project.startYear);
}

/** Year used for sorting and the year filter (the latest year the project was active). */
export function projectYear(project: Project): number {
  return project.endYear ?? project.startYear;
}

export const featuredProjects = projects.filter((p) => p.featured);
