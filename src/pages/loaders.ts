/** Page chunk loaders, shared by the router (App.tsx) and idle preloading (Layout.tsx). */
export const pageLoaders = {
  home: () => import('./HomePage'),
  about: () => import('./AboutPage'),
  services: () => import('./ServicesPage'),
  serviceDetail: () => import('./ServiceDetailPage'),
  sustainability: () => import('./SustainabilityPage'),
  projects: () => import('./ProjectsPage'),
  team: () => import('./TeamPage'),
  contact: () => import('./ContactPage'),
  privacy: () => import('./PrivacyPage'),
  notFound: () => import('./NotFoundPage'),
};

export function preloadPages(): void {
  for (const load of Object.values(pageLoaders)) {
    load().catch(() => {
      // Offline or a deploy replaced the chunk: the router retries on navigation.
    });
  }
}
