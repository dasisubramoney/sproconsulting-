/**
 * Single list of public routes. Used by the sitemap generator (vite.config.ts)
 * and the navigation. Keep in sync with src/App.tsx.
 */
export const serviceSlugs = ['electrical', 'mechanical', 'fire', 'hvac', 'wet-services'] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export const staticRoutes = [
  '/',
  '/about',
  '/services',
  '/sustainability',
  '/projects',
  '/team',
  '/contact',
  '/privacy',
] as const;

export const allRoutes: string[] = [
  ...staticRoutes,
  ...serviceSlugs.map((slug) => `/services/${slug}`),
];


export const mainNav = [
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/projects', label: 'Projects' },
  { to: '/team', label: 'Team' },
] as const;
