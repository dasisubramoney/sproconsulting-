import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { Layout } from '@/components/layout/Layout';
import { pageLoaders } from '@/pages/loaders';

const HomePage = lazy(pageLoaders.home);
const AboutPage = lazy(pageLoaders.about);
const ServicesPage = lazy(pageLoaders.services);
const ServiceDetailPage = lazy(pageLoaders.serviceDetail);
const SustainabilityPage = lazy(pageLoaders.sustainability);
const ProjectsPage = lazy(pageLoaders.projects);
const TeamPage = lazy(pageLoaders.team);
const ContactPage = lazy(pageLoaders.contact);
const PrivacyPage = lazy(pageLoaders.privacy);
const NotFoundPage = lazy(pageLoaders.notFound);

// Keep in sync with src/config/routes.ts (drives the sitemap).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetailPage />} />
        <Route path="sustainability" element={<SustainabilityPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
