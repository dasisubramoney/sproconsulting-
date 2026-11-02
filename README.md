# S-PRO Consulting Engineers — website

Source for **sproconsulting.co.za**, the website of S-PRO Consulting Engineers (Pty) Ltd. It replaces the 2018 Adobe Muse site (~40 thin pages) with a fast, secure, accessible site of 10 routes, hosted on Netlify.

- **Stack:** Vite · React 18 · TypeScript · Tailwind CSS 3 · React Router 7 · Framer Motion · GSAP + ScrollTrigger · Lenis · react-helmet-async
- **Rendering:** every route is pre-rendered to static HTML at build time, then hydrated by React in the browser.
- **Hosting:** Netlify (static files, Netlify Forms, security headers, 301s from the old site).

| Doc | What's in it |
|---|---|
| This README | Running, building, deploying, editing content, open TODOs |
| [DESIGN.md](DESIGN.md) | Colours, contrast rules, typography, the diagonal-slash motif, motion rules |
| [netlify.toml](netlify.toml) | Build settings, security headers (CSP), caching, old-site redirects |

---

## Contents

1. [What has been done](#what-has-been-done)
2. [Quick start](#quick-start)
3. [Project structure](#project-structure)
4. [Editing content](#editing-content) — for non-developers
5. [How the build works](#how-the-build-works)
6. [Deploying to Netlify](#deploying-to-netlify)
7. [Security](#security)
8. [Quality: accessibility, performance, SEO](#quality-accessibility-performance-seo)
9. [Decisions that differ from the original brief](#decisions-that-differ-from-the-original-brief)
10. [Remaining TODOs before launch](#remaining-todos-before-launch)

---

## What has been done

The rebuild was delivered in six phases. Everything below is in this repository and has been checked with `npm run build` + `npm run preview`.

**1. Setup**
- Vite + React 18 + TypeScript project with Tailwind, React Router 7 (lazy-loaded routes), Framer Motion, GSAP + ScrollTrigger, Lenis and react-helmet-async. All dependency versions are pinned exactly.
- Design tokens (navy, crimson, maroon, ink, surface; Montserrat type scale) in [tailwind.config.ts](tailwind.config.ts), documented with contrast rules in [DESIGN.md](DESIGN.md).
- Montserrat self-hosted via `@fontsource-variable/montserrat` (no font CDN).
- [netlify.toml](netlify.toml) with build settings, security headers and caching; `.gitignore` excludes `.env*` files.

**2. Content layer** — [src/content/](src/content/)
- Company details, about copy, mission and vision, from the company profile.
- Five services (Electrical, Mechanical, Fire, HVAC, Wet Services).
- 34 projects (six featured), with year and discipline for filtering.
- 11 team members (leadership and staff), shown with initials until consented photos are supplied.
- Sustainability content: water systems, carbon footprint figures, service offering.
- Home-page stats derived from the content, and Organization JSON-LD.
- Anything not in the profile is a marked `TODO:` placeholder rather than invented.

**3. Pages**
- Home, About, Services, five service detail pages, Sustainability, Projects, Team, Contact, Privacy and a 404 page.
- Header with a keyboard-accessible Services menu and a mobile drawer with focus trap; footer with contact details.
- Projects page with year and discipline filters kept in the URL, grouped by year.
- Contact form on Netlify Forms: validation, honeypot, POPIA consent checkbox, accessible error and success messages.
- Click-to-load OpenStreetMap on the Contact page (no third-party request until the visitor asks for it).
- Email address obfuscated in the HTML; external links use `rel="noopener noreferrer"`.
- Per-page titles, descriptions, canonical URLs, Open Graph tags and JSON-LD; `sitemap.xml` and `robots.txt`.

**4. Motion and polish**
- The brand's diagonal "slash" bands, drawn in on page heroes.
- Hero text rises in with CSS keyframes; below-the-fold cards, headings and slashes reveal on scroll with GSAP; stats count up.
- Smooth scrolling with Lenis.
- All motion switches off when the visitor has "reduce motion" turned on, and no content depends on an animation to become visible.

**5. Hardening**
- Every route pre-rendered to static HTML at build time, then hydrated by React — faster first load and better SEO.
- Strict Content Security Policy (`'self'` only, no `unsafe-inline`); the build fails if any page contains an inline script or `style` attribute.
- HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy and COOP headers.
- 42 permanent (301) redirects from the old Muse URLs; unknown URLs return a real 404.
- Font-loading layout shift removed with a size-matched fallback font. (A font preload was added here, then removed in the motion pass because Chrome warned about it whenever the font was already cached.)
- `public/.well-known/security.txt` added.
- `npm audit`: 0 vulnerabilities. No trackers or analytics.
- Measured results: see [Quality](#quality-accessibility-performance-seo).

**6. Documentation**
- This README (running, editing content, deploying, security, quality results, open TODOs) and [DESIGN.md](DESIGN.md).

### Motion & effects pass

A second piece of work gives the site its own motion identity: design on paper → built reality, and systems that flow. It runs in seven phases, each approved before the next starts.

**Phase 1 — Global motion system (done)**
- All motion code now lives in [src/motion/](src/motion/): shared timing tokens, the hooks `useReveal`, `useSplitHeading`, `useCountUp`, `useParallax` and `useReducedMotion`, and the site-wide effects. Documented in [DESIGN.md → Motion](DESIGN.md#motion).
- **Page transitions:** on navigation, a crimson band then a maroon band sweep diagonally across the screen, the new page swaps in underneath, and the bands sweep away (about 650 ms). Focus moves to the new page's heading for screen readers.
- **First-visit intro:** the tower mark draws itself as blueprint lines, fills with brand colour and slides away on the diagonal (about 1.2 s), once per browser session. Any key or tap skips it. The page loads underneath, so it doesn't slow the site down. It uses the placeholder logo until the official artwork is supplied.
- **Headings** rise line by line as they scroll into view, and content blocks fade up in sequence. An angled image wipe is ready for when photos are added.
- **Scroll progress:** a thin crimson bar with an angled edge along the top of the page.
- **"Reduce motion" switch** in the footer, remembered on the visitor's device. With it on, or with reduced motion set in the device's settings, there is no intro, no page wipe, no smooth scrolling and no scroll animations; content is simply there.
- GSAP (now including SplitText via `@gsap/react` and `useGSAP`) and Lenis load in one separate file after the page is interactive. The code needed for the first paint got 3.7 KB *smaller* (117.0 → 113.3 KB gzipped).
- Tested: no console errors or CSP violations under `npm run preview` (desktop, mobile, reduced motion, JavaScript off). Lighthouse mobile performance 99–100 on a quiet machine, CLS 0.

**Still to do:** Phase 2 home hero "Blueprint to Reality" · Phase 3 animated discipline icons · Phase 4 Sustainability "Follow the Water" · Phase 5 projects timeline and map · Phase 6 stats, team and details · Phase 7 cross-browser QA and a full "Motion system" README section.

---

## Quick start

Requires **Node 24** (see [.nvmrc](.nvmrc); Netlify uses the same version).

```bash
npm install
npm run dev        # dev server at http://localhost:5173 (hot reload, no pre-rendering)
npm run build      # type-check, build, pre-render every page into dist/
npm run preview    # serve dist/ at http://localhost:4173 with the production CSP
npm run typecheck  # TypeScript only
```

`npm run preview` behaves like Netlify: it sends the same Content-Security-Policy as `netlify.toml` and returns `404.html` with a 404 status for unknown URLs. Always check a change with `build` + `preview` before deploying. Some problems (CSP, pre-rendering) only show up there, not in `dev`.

No environment variables or secrets are needed. `.env*` files are git-ignored. Never commit keys.

---

## Project structure

```
src/
  content/            ← all site text and data — edit these to update the site
    company.ts          company facts, About-page copy, contact details, MD quote
    services.ts         the five engineering disciplines
    projects.ts         project portfolio + testimonials
    team.ts             team members
    sustainability.ts   Sustainability-page copy and figures
    stats.ts            headline numbers (calculated from the files above, don't edit)
    schema.ts           JSON-LD structured data for search engines (calculated)
  config/
    routes.ts           list of pages (drives navigation, pre-rendering and sitemap.xml)
    site.ts             site URL, default title/description, social image
  pages/              one component per route
  components/
    layout/             header, footer, mobile menu, skip link
    sections/           page hero, CTA band, stats band, project card
    contact/            contact form, validation, click-to-load map
    ui/                 small building blocks (logo, slash motif, tags, avatars…)
  motion/             all animation: tokens, GSAP hooks, page transition, intro, reduce-motion switch
  hooks/              hydration, body scroll lock
  styles/index.css    Tailwind layers, fonts, entrance animations, intro animation
  entry-server.tsx    renders a route to HTML at build time
scripts/prerender.mjs writes dist/*.html for every route; fails on CSP-unsafe output
public/               copied as-is: favicon, robots.txt, manifest, security.txt, images/,
                        motion-gate.js (tiny script that applies reduce-motion and the intro before first paint)
```

---

## Editing content

All words, projects and people live in plain TypeScript files under [src/content/](src/content/). You don't need to know React. Edit the data, then run `npm run build`; if you made a typo in the structure, the build will tell you where.

**Rule for all content: only publish facts the client has approved.** Don't invent figures, project names or staff details.

### Add or change a project — [src/content/projects.ts](src/content/projects.ts)

Projects are listed newest first. Copy an existing entry and edit it:

```ts
{
  id: 'example-hospital',            // unique, lowercase-with-dashes
  name: 'Example Hospital',
  startYear: 2026,
  endYear: 2027,                     // optional, for multi-year projects
  nature: 'Fire protection, wet services',
  scope: 'Rational fire design',     // optional
  disciplines: ['fire', 'wet-services'],  // drives the /projects filter
  location: { city: 'Cape Town', region: 'Western Cape', country: 'South Africa' }, // optional
  partner: 'Afri-Eng',               // optional, for joint appointments
  featured: true,                    // optional: show on the home page (keep to ~6)
},
```

`disciplines` must use these slugs: `electrical`, `mechanical`, `fire`, `hvac`, `wet-services`. The home-page numbers (project count, years since the earliest project, countries) update automatically.

**Testimonials** are in the same file and only show when `approved: true`. Set that only once the client has the author's written permission.

### Add or change a team member — [src/content/team.ts](src/content/team.ts)

```ts
{ id: 'jane-doe', name: 'Jane Doe', role: 'Fire Engineer', group: 'team' },
```

`group` is `'leadership'` or `'team'`. Without a photo, an initials tile is shown.

**Photos (POPIA):** only add a photo once that person has given **written consent** for it to be published. Then:

1. Save a square WebP, at least 480×480, as `public/images/team/jane-doe.webp`.
2. Add `photo: '/images/team/jane-doe.webp'` to their entry.

### Services — [src/content/services.ts](src/content/services.ts)

Edit `summary`, `capabilities` and `systems` freely. **Adding a new discipline** is a developer task: add its slug to `serviceSlugs` in [src/config/routes.ts](src/config/routes.ts) first, then add the entry here (the dev server logs an error if they're out of sync), and pick an icon in [ServiceIcon.tsx](src/components/ui/ServiceIcon.tsx).

### Company details, About copy, contact — [src/content/company.ts](src/content/company.ts)

Address, phone, email, registration number, mission, vision, aims, HR development and the MD quote. The email is stored in two parts (`user` and `domain`) and assembled in the browser so it isn't in the HTML for scrapers. Keep it that way.

**Client logos** for the home-page "Trusted by" strip go in `clientLogos`. The strip stays hidden while the list is empty. Add logos only with each client's written permission.

### Sustainability page — [src/content/sustainability.ts](src/content/sustainability.ts)

Climate context, the "Our Offering" points, water systems (each linked to proof projects by `id`), and the carbon-footprint figures.

### Page titles and search descriptions

Each page sets its own `<Seo title=… description=… />` at the top of its file in [src/pages/](src/pages/). Site-wide defaults are in [src/config/site.ts](src/config/site.ts).

---

## How the build works

`npm run build` runs four steps:

1. `tsc -b` type-checks everything.
2. `vite build` bundles the browser app into `dist/` and generates `sitemap.xml` from the route list.
3. `vite build --ssr` builds a Node version of the app into `dist-ssr/` (temporary).
4. [scripts/prerender.mjs](scripts/prerender.mjs) renders every route to HTML, using Netlify's URL conventions so canonical URLs have no trailing slash:

| Route | File | Served at |
|---|---|---|
| `/` | `dist/index.html` | `/` |
| `/about` | `dist/about.html` | `/about` |
| `/services/fire` | `dist/services/fire.html` | `/services/fire` |
| anything else | `dist/404.html` | Netlify serves it with a **404** status |

The pre-render step also **fails the build** if any page contains an inline `<script>` (other than JSON-LD) or a `style=""` attribute, because the CSP would block them.

### Adding a new page

1. Create the component in `src/pages/`, with a `<Seo />`.
2. Add the route in [src/App.tsx](src/App.tsx) (lazy-loaded, like the others).
3. Add the path to `staticRoutes` in [src/config/routes.ts](src/config/routes.ts), so it's pre-rendered and in the sitemap.
4. If it belongs in the menu, add it to `mainNav` in the same file.

### Rules for developers (these keep the CSP strict)

- **No `style={…}` props** and no Framer Motion `initial` on pre-rendered elements. Use Tailwind classes or CSS keyframes. See [DESIGN.md → Motion](DESIGN.md#motion).
- **No `dangerouslySetInnerHTML`.**
- **No third-party scripts, fonts, iframes or trackers** without updating the CSP in `netlify.toml` and getting approval.
- External links go through [`<ExternalLink>`](src/components/ui/ExternalLink.tsx) (adds `rel="noopener noreferrer"`).
- Anything that would make the first browser render differ from the static HTML (reading `?query` params, `window`, dates that change) must wait for [`useHydrated()`](src/hooks/useHydrated.ts).

---

## Deploying to Netlify

### First-time setup

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In Netlify, choose **Add new site → Import an existing project** and select the repo. Build settings come from `netlify.toml` automatically (`npm run build`, publish `dist`, Node 24). Don't override them in the UI.
3. **Enable form detection:** Site configuration → Forms → *Enable form detection*. Then redeploy. Netlify finds the `contact` form from the hidden copy in [index.html](index.html).
4. **Form notifications:** Forms → `contact` → *Form notifications* → add an email notification to the address that should receive enquiries.
5. **Domain:** Domain management → add `sproconsulting.co.za` and `www.sproconsulting.co.za`, then set the primary domain (TODO: apex or www). Netlify 301-redirects the other one and provisions HTTPS automatically.
6. **DNS cut-over:** point the domain's DNS at Netlify only after the deploy-preview checklist below passes.

### Deploy-preview checklist (before DNS cut-over)

These can't be fully tested locally:

- [ ] Submit the contact form for real. Check it appears under Forms and the notification email arrives.
- [ ] A submission with the hidden `bot-field` filled in is rejected as spam.
- [ ] `/about`, `/services/fire` etc. load with **200** and no trailing-slash redirect; `/about.html` and `/services.html` behave sensibly (served or 301 to the clean URL).
- [ ] An unknown URL (e.g. `/nope`) returns the branded page with a **404** status.
- [ ] Old Muse URLs (e.g. `/about-us.html`, `/hvac.html`, `/2012-b.html`) return **301** to the right page. Cross-check the old site's full URL list (sitemap or Google Search Console) and add any missing pages to `netlify.toml`.
- [ ] Response headers on any page include the CSP and security headers (DevTools → Network → the document → Headers), and the browser console shows no CSP errors.
- [ ] Run Lighthouse (mobile) on the preview URL. See [Quality](#quality-accessibility-performance-seo) for expected scores.
- [ ] Only after every subdomain serves HTTPS: consider submitting to [hstspreload.org](https://hstspreload.org). That is hard to undo, so treat it as optional.

### Ongoing

Every push to the main branch deploys automatically. Pull requests get their own deploy preview URL.

---

## Security

Configured in [netlify.toml](netlify.toml):

- **Content-Security-Policy:** `default-src 'self'`, with no `'unsafe-inline'` or `'unsafe-eval'` anywhere. The only third-party origin is `frame-src https://www.openstreetmap.org` for the map, which loads only when the visitor clicks **Load map**. Fonts are self-hosted, so there's no font CDN.
- **Other headers:** HSTS (2 years, includeSubDomains, preload), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation, payment, USB, interest-cohort and browsing-topics all off) and `Cross-Origin-Opener-Policy: same-origin`.
- **Caching:** hashed files under `/assets/*` are immutable for a year, and HTML always revalidates.

**Contact form** ([ContactForm.tsx](src/components/contact/ContactForm.tsx)):

- Submitted to Netlify Forms, with a honeypot field (`bot-field`) to catch spam bots.
- Client-side validation (required fields, email format, length limits) is for usability only. Netlify's own spam filtering is the server-side check.
- Without JavaScript, the browser validates natively and the form still posts to Netlify.
- A POPIA consent checkbox links to `/privacy`.
- Success and error messages are announced to screen readers; there's no page reload.
- Netlify's reCAPTCHA is **off** by default. Enabling it requires adding Google's domains to `script-src` and `frame-src` in the CSP.

**Also:**

- The email address is assembled client-side.
- `npm audit` reports 0 vulnerabilities, and dependency versions are pinned exactly.
- There are no analytics or trackers. If analytics are wanted, choose a privacy-friendly, cookie-free option that can be self-hosted or allowed narrowly in the CSP, and update the privacy notice.
- [public/.well-known/security.txt](public/.well-known/security.txt) gives a security contact (TODO: real address).

---

## Quality: accessibility, performance, SEO

Results from Phase 5 testing on the production build, using a local server that copies Netlify's compression, headers and 404 handling:

| Page | Lighthouse mobile: Perf / A11y / Best Practices / SEO | LCP | CLS |
|---|---|---|---|
| `/` | 95 / 100 / 100 / 100 | 1.6 s | 0 |
| `/about` | 98 / 100 / 100 / 100 | 2.1 s | 0 |
| `/services/fire` | 97 / 100 / 100 / 100 | 2.2 s | 0 |
| `/projects` | 95 / 100 / 100 / 100 | 2.6 s | 0 |
| `/contact` | 96 / 100 / 100 / 100 | 2.4 s | 0 |
| `/sustainability` | 97 / 100 / 100 / 100 | 2.1 s | 0 |
| `/team` | 97 / 100 / 100 / 100 | 2.2 s | 0 |

Lighthouse scores vary by a few points between runs. Re-measure on the Netlify deploy preview, which is the number that counts.

**Accessibility (WCAG 2.2 AA):**

- axe-core reports no violations on any page at 360px and 1366px, including with the services menu open, the mobile drawer open, the form showing errors and the projects list filtered.
- Skip link, semantic landmarks, one `h1` per page, and visible focus rings everywhere.
- Header menus work by keyboard (Escape closes and returns focus), and the mobile drawer keeps focus inside while open.
- Touch targets are at least 24px.
- Contrast rules are in [DESIGN.md](DESIGN.md#contrast-rules-wcag-22-aa). Crimson is never used for text on navy.

**Reduced motion:** with the OS setting on, or the footer **Reduce motion** switch on, there is no intro or page wipe, smooth scrolling and scroll animations are off, and CSS transitions are near-instant. Content never depends on an animation to become visible.

**SEO:**

- Each page has its own title, description, canonical URL, and Open Graph and Twitter tags, all present in the static HTML.
- JSON-LD `ProfessionalService` structured data is on every page.
- `sitemap.xml` and `robots.txt` are included, and the 404 page is `noindex`.

> **Testing locally on a PC with Kaspersky:** Kaspersky injects its own script into every page it scans, which drags down Lighthouse scores and adds console noise. Block `*.kaspersky-labs.com` when measuring (Lighthouse `blockedUrlPatterns`), or test on the deploy preview from another machine.

---

## Decisions that differ from the original brief

| Brief | What was built | Why |
|---|---|---|
| React Router v6 | React Router **7** (library mode) | v6 has two security advisories fixed only in v7. v7 works with React 18 and the routing API used here is unchanged. |
| SPA with `/* /index.html 200` fallback | **Pre-rendered static pages**, no catch-all | The client-rendered version topped out at mobile Performance 85–94. Pre-rendering reaches 95–98, gives real 404 status codes, and makes content visible to search engines and no-JS visitors. |
| `/index.html → /` and `/services.html → /services` redirects | Not added | Both are real files now, and a forced redirect would risk a loop. The canonical tag handles the duplicate. |
| Map provider unspecified | **OpenStreetMap**, click-to-load | More private than Google Maps, and only one origin in `frame-src`. |
| `Permissions-Policy: interest-cohort=()` | Kept, plus `browsing-topics=()` | As requested. Note that Chrome logs an "unrecognised feature" warning for `interest-cohort`. Remove it if a clean console matters more. |
| Three.js hero (optional) | Not used | The CSS/GSAP slash motif carries the brand without adding about 150 KB of JavaScript. |
| Electrical / Mechanical lists | Swapped back from the PDF | The PDF has them reversed. Confirm with the client (see TODOs). |

---

## Remaining TODOs before launch

Every item below is also marked `TODO` in the code (search the repo for `TODO`).

### Client to confirm (content)

- [ ] **Electrical vs Mechanical service lists:** the PDF has them swapped; the site uses the corrected split. [services.ts](src/content/services.ts)
- [ ] **Approve copy-edited wording:** About and Sustainability text was lightly corrected for grammar. [company.ts](src/content/company.ts), [sustainability.ts](src/content/sustainability.ts)
- [ ] **Approve headings and summaries written for the site,** e.g. "Engineering capital projects from detail to commissioning". [src/pages/](src/pages/)
- [ ] **"27+ years of project experience, since 1999":** this counts from the V&A Waterfront (1999), but the company was registered in 2012. Confirm the wording is acceptable. [stats.ts](src/content/stats.ts)
- [ ] **Spelling of "Liegtensgrie"** Solar Panel Plant. [projects.ts](src/content/projects.ts)
- [ ] **Surname for "Eugene"** (HVAC). [team.ts](src/content/team.ts)
- [ ] **OR Tambo "carousel design"** is tagged Mechanical. Confirm. [projects.ts](src/content/projects.ts)
- [ ] **Project locations** for the projects without one (only places named in the project title are filled in). [projects.ts](src/content/projects.ts)
- [ ] **Carbon-footprint payback period:** the profile mentions one but gives no figure, so none is shown. [sustainability.ts](src/content/sustainability.ts)
- [ ] **Forte Architetti / Arcadia Rd testimonial:** confirm exact wording and get written permission, then set `approved: true`. [projects.ts](src/content/projects.ts)
- [ ] **Map pin** coordinates for Boulevard Place, Century City. [company.ts](src/content/company.ts)

### Assets to supply

- [ ] **Official S-PRO logo** (SVG preferred). Replace the placeholder in [Logo.tsx](src/components/ui/Logo.tsx) and [favicon.svg](public/favicon.svg), add `apple-touch-icon.png` (180×180) and `favicon.ico` ([index.html](index.html)), and add `logo` to the JSON-LD ([schema.ts](src/content/schema.ts)).
- [ ] **Exact brand navy:** `#252B72` is sampled from the PDF; confirm it against the vector logo. [DESIGN.md](DESIGN.md), [tailwind.config.ts](tailwind.config.ts)
- [ ] **Social share image,** 1200×630 at `public/images/og-default.jpg`; then set `defaultOgImage`. [site.ts](src/config/site.ts)
- [ ] **Project photography** (WebP/AVIF) in `public/images/projects/`. [projects.ts](src/content/projects.ts)
- [ ] **Team photos, with each person's written consent (POPIA).** [team.ts](src/content/team.ts)
- [ ] **Client logos, with each client's written permission.** [company.ts](src/content/company.ts)

### Legal / POPIA

- [ ] **Legal review of the privacy notice.** [PrivacyPage.tsx](src/pages/PrivacyPage.tsx) needs:
  - the Information Officer's name and contact details (and registration with the Information Regulator);
  - the retention period for enquiries;
  - confirmation that Netlify's data-processing terms cover the cross-border transfer (POPIA s72);
  - confirmation of who has access to form submissions;
  - the "last updated" date.
- [ ] **Security contact** in [security.txt](public/.well-known/security.txt). Replace the placeholder address.

### Launch / infrastructure

- [ ] **Canonical domain: apex or www?** Update `url` in [site.ts](src/config/site.ts), `robots.txt`, `security.txt`, and the Netlify primary domain.
- [ ] **Cross-check old Muse URLs** against the live site / Search Console. Year pages `/2015.html`–`/2017.html` were inferred from the brief. [netlify.toml](netlify.toml)
- [ ] **Run the deploy-preview checklist** above (real form submission, 404 status, redirects, headers, Lighthouse).
- [ ] **`interest-cohort`** in Permissions-Policy: keep or remove (see [Decisions](#decisions-that-differ-from-the-original-brief)).
- [ ] **HSTS preload submission** (optional, only once every subdomain is HTTPS).
