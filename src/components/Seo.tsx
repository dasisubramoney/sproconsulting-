import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { site } from '@/config/site';

interface SeoProps {
  /** Page title without the site suffix. Omit on the home page. */
  title?: string;
  description?: string;
  /** Canonical path; defaults to the current location. */
  path?: string;
  noindex?: boolean;
  image?: string;
}

export function Seo({ title, description = site.defaultDescription, path, noindex, image }: SeoProps) {
  const { pathname } = useLocation();
  const fullTitle = title ? site.titleTemplate.replace('%s', title) : site.defaultTitle;
  const canonicalPath = path ?? pathname;
  const canonical = `${site.url}${canonicalPath === '/' ? '/' : canonicalPath.replace(/\/$/, '')}`;
  const ogImage = image ?? site.defaultOgImage;

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en-ZA" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : <link rel="canonical" href={canonical} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={`${site.url}${ogImage}`} />}

      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={`${site.url}${ogImage}`} />}
    </Helmet>
  );
}
