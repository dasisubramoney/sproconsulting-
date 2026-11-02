// Pre-renders every route in src/config/routes.ts to static HTML after `vite build`.
//
// Output follows Netlify's URL rules so canonical URLs have no trailing slash:
//   /                 -> dist/index.html
//   /about            -> dist/about.html            (served at /about)
//   /services/fire    -> dist/services/fire.html
//   (not found)       -> dist/404.html              (Netlify serves this with a 404 status)
//
// It also guards the CSP: the build fails if any page contains an inline <script>
// (other than JSON-LD data) or a style="" attribute, both of which the CSP blocks.

import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const { render, allRoutes } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
// Preload the Latin subset of Montserrat (hashed filename) so text renders in the
// brand font sooner and the fallback swap is shorter.
const latinFont = readdirSync(join(dist, 'assets')).find((f) => /^montserrat-latin-wght-normal-.*\.woff2$/.test(f));
if (!latinFont) throw new Error('Montserrat latin woff2 not found in dist/assets');
const fontPreload = `<link rel="preload" href="/assets/${latinFont}" as="font" type="font/woff2" crossorigin>`;

const template = readFileSync(join(dist, 'index.html'), 'utf8').replace(
  '<link rel="icon"',
  `${fontPreload}\n    <link rel="icon"`,
);

function outFile(route) {
  if (route === '/') return join(dist, 'index.html');
  if (route === '404') return join(dist, '404.html');
  return join(dist, `${route.slice(1)}.html`);
}

function inject({ html, head, htmlAttributes }) {
  return (
    template
      // Helmet supplies the per-page title and description; drop the template defaults.
      .replace(/<title>[\s\S]*?<\/title>\s*/, '')
      .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, '')
      .replace(/<html[^>]*>/, `<html ${htmlAttributes}>`)
      .replace('</head>', `    ${head}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  );
}

function assertCspSafe(route, page) {
  const problems = [];
  for (const m of page.matchAll(/<script\b([^>]*)>/g)) {
    const attrs = m[1];
    if (!/\bsrc=/.test(attrs) && !/type="application\/ld\+json"/.test(attrs)) problems.push(`inline <script${attrs}>`);
  }
  for (const m of page.matchAll(/<[a-z][^>]*\sstyle="[^"]*"[^>]*>/g)) problems.push(`style attribute: ${m[0].slice(0, 120)}`);
  if (problems.length) {
    throw new Error(`Pre-rendered ${route} would violate the CSP:\n  ${problems.join('\n  ')}`);
  }
}

const routes = [...allRoutes, '404'];
for (const route of routes) {
  // Any unmatched path renders the NotFound page.
  const result = await render(route === '404' ? '/__not-found__' : route);
  const page = inject(result);
  assertCspSafe(route, page);
  const file = outFile(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  console.log(`  pre-rendered ${route.padEnd(24)} -> ${file.slice(dist.length + 1)}`);
}

rmSync(ssrDir, { recursive: true, force: true });
console.log(`✓ pre-rendered ${routes.length} pages`);
