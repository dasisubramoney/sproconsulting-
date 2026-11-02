import { serviceSlugs, type ServiceSlug } from '@/config/routes';

/**
 * Engineering disciplines. Each entry becomes /services/<slug>.
 * To add a discipline, add its slug to src/config/routes.ts first.
 *
 * NOTE: the company profile PDF has the Electrical and Mechanical lists swapped.
 * The split below is the corrected version. TODO: confirm with client.
 */

/** Icon keys map to lucide icons in src/components/ui/ServiceIcon.tsx. */
export type ServiceIconKey = 'zap' | 'cog' | 'flame' | 'wind' | 'droplets';

export interface Service {
  slug: ServiceSlug;
  title: string;
  /** One sentence for cards and meta descriptions. */
  summary: string;
  icon: ServiceIconKey;
  /** Core capabilities, as listed in the company profile. */
  capabilities: string[];
  /** Detailed systems from the Sustainable Innovation offering (fire and wet only). */
  systems?: string[];
}

export const services: Service[] = [
  {
    slug: 'electrical',
    title: 'Electrical',
    summary:
      'Bulk supply, reticulation, lighting, power, standby and UPS systems, and security systems for commercial and industrial buildings.',
    icon: 'zap',
    capabilities: [
      'HV/MV/LV bulk intake points & reticulation',
      'General lighting',
      'Power',
      'Standby power',
      'UPS plants',
      'Security systems',
    ],
  },
  {
    slug: 'mechanical',
    title: 'Mechanical',
    summary:
      'Air conditioning, ventilation, vertical transport, refrigeration and extraction systems.',
    icon: 'cog',
    capabilities: [
      'Air conditioning',
      'Ventilation',
      'Hoists',
      'Escalators',
      'Refrigeration',
      'Dust extraction',
      'Fume extraction',
    ],
  },
  {
    slug: 'fire',
    title: 'Fire Protection',
    summary:
      'Rational fire design, fire plans, suppression, detection and evacuation, sprinkler and hydrant systems.',
    icon: 'flame',
    capabilities: [
      'Rational fire design',
      'Fire plans',
      'Gas suppression',
      'Fire equipment',
      'Fire detection & evacuation',
    ],
    systems: [
      'Automatic fire sprinkler systems',
      'Conventional fire hydrant and hose reel systems',
      'Fire water storage tanks for independence from municipal supply',
      'Hydraulic calculations',
    ],
  },
  {
    slug: 'hvac',
    title: 'HVAC',
    summary: 'Air conditioning, ventilation, smoke control and smoke extraction design.',
    icon: 'wind',
    capabilities: ['Air conditioning', 'Ventilation', 'Smoke control', 'Smoke extraction'],
  },
  {
    slug: 'wet-services',
    title: 'Wet Services',
    summary:
      'Plumbing and drainage, grey water and rainwater harvesting, specialised plant design and hot water generation.',
    icon: 'droplets',
    capabilities: ['Plumbing & drainage', 'Grey water', 'Rainwater harvesting'],
    systems: [
      'Rainwater disposal systems',
      'Specialised plant design — booster pump sets, sumps and grease traps',
      'Rainwater harvesting and non-potable reticulation systems',
      'Grey water treatment',
      'Hot water generation systems',
      'Hydraulic calculations',
    ],
  },
];

const bySlug = new Map(services.map((s) => [s.slug, s]));

export function getService(slug: ServiceSlug): Service {
  const service = bySlug.get(slug);
  if (!service) throw new Error(`No service content for slug "${slug}"`);
  return service;
}

export function serviceTitle(slug: ServiceSlug): string {
  return getService(slug).title;
}

// Fail fast in dev if a slug in routes.ts has no content here (or vice versa).
if (import.meta.env.DEV) {
  const missing = serviceSlugs.filter((slug) => !bySlug.has(slug));
  if (missing.length || services.length !== serviceSlugs.length) {
    console.error('services.ts is out of sync with serviceSlugs in routes.ts:', missing);
  }
}
