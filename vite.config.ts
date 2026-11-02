import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { site } from './src/config/site.ts';
import { allRoutes } from './src/config/routes.ts';

/** Emits sitemap.xml into the build output from the shared route list. */
function sitemap(): Plugin {
  return {
    name: 'spro-sitemap',
    apply: 'build',
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10);
      const urls = allRoutes
        .map((path) => {
          const loc = path === '/' ? `${site.url}/` : `${site.url}${path}`;
          const priority = path === '/' ? '1.0' : path.split('/').length > 2 ? '0.6' : '0.8';
          return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
        })
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

/**
 * Makes `vite preview` serve unknown paths like Netlify does: dist/404.html with a
 * 404 status, instead of Vite's SPA fallback to index.html.
 */
function netlifyStyle404(): Plugin {
  return {
    name: 'spro-preview-404',
    configurePreviewServer(server) {
      const dist = server.config.build.outDir;
      server.middlewares.use((req, res, next) => {
        const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
        const candidates = [path, `${path}.html`, `${path.replace(/\/$/, '')}/index.html`];
        if (path === '/' || candidates.some((c) => existsSync(join(dist, c)) && statSync(join(dist, c)).isFile())) {
          return next();
        }
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(join(dist, '404.html')));
      });
    },
  };
}

/**
 * Reads the CSP from netlify.toml so `npm run preview` enforces the same policy as production.
 * upgrade-insecure-requests is dropped because preview runs over plain http.
 */
function productionCsp(): string {
  const toml = readFileSync(new URL('./netlify.toml', import.meta.url), 'utf8');
  const match = toml.match(/Content-Security-Policy = "([^"]+)"/);
  if (!match) throw new Error('Content-Security-Policy not found in netlify.toml');
  return match[1].replace(/;\s*upgrade-insecure-requests/, '');
}

export default defineConfig({
  plugins: [react(), sitemap(), netlifyStyle404()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  ssr: {
    // CommonJS package without ESM named exports; bundle it into the pre-render build.
    noExternal: ['react-helmet-async'],
  },
  preview: {
    headers: {
      'Content-Security-Policy': productionCsp(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
