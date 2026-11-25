# S-PRO Consulting Engineers — website

Source for **sproconsulting.co.za**, the website of S-PRO Consulting Engineers (Pty) Ltd. It replaces the 2018 Adobe Muse site (~40 thin pages) with a fast, secure, accessible site of 10 routes, hosted on Netlify.

- **Stack:** Vite · React 18 · TypeScript · Tailwind CSS 3 · React Router 7 · Framer Motion · GSAP + ScrollTrigger · Lenis · react-helmet-async · three.js (service-page 3D models only)
- **Rendering:** every route is pre-rendered to static HTML at build time, then hydrated by React in the browser.
- **Hosting:** Netlify (static files, Netlify Forms, security headers, 301s from the old site).

| Doc | What's in it |
|---|---|
| This README | Running, building, deploying, editing content, open TODOs |
| [DESIGN.md](DESIGN.md) | Colours, contrast rules, typography, logo usage, the copper-sweep and sketch-line motif, motion rules |
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

**Latest:** see [Changes on 24–25 November 2026](#changes-on-2425-november-2026) for a summary of the most recent session.

**1. Setup**
- Vite + React 18 + TypeScript project with Tailwind, React Router 7 (lazy-loaded routes), Framer Motion, GSAP + ScrollTrigger, Lenis and react-helmet-async. All dependency versions are pinned exactly.
- Design tokens (originally navy, crimson and maroon; replaced by the copper / steel rebrand below; Montserrat type scale) in [tailwind.config.ts](tailwind.config.ts), documented with contrast rules in [DESIGN.md](DESIGN.md).
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
- The brand's diagonal "slash" bands, drawn in on page heroes (retired in the rebrand; see below).
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
- **Page transitions:** on navigation, a copper band then a steel band (originally crimson and maroon) sweep diagonally across the screen, the new page swaps in underneath, and the bands sweep away (about 650 ms). Focus moves to the new page's heading for screen readers.
- **First-visit intro:** the tower mark draws itself as blueprint lines, fills with brand colour and slides away on the diagonal (about 1.2 s), once per browser session. Any key or tap skips it. The page loads underneath, so it doesn't slow the site down. It uses the placeholder logo until the official artwork is supplied.
- **Headings** rise line by line as they scroll into view, and content blocks fade up in sequence. An angled image wipe is ready for when photos are added.
- **Scroll progress:** a thin copper bar with an angled edge along the top of the page.
- **"Reduce motion" switch** in the footer, remembered on the visitor's device. With it on, or with reduced motion set in the device's settings, there is no intro, no page wipe, no smooth scrolling and no scroll animations; content is simply there.
- GSAP (now including SplitText via `@gsap/react` and `useGSAP`) and Lenis load in one separate file after the page is interactive. The code needed for the first paint got 3.7 KB *smaller* (117.0 → 113.3 KB gzipped).
- Tested: no console errors or CSP violations under `npm run preview` (desktop, mobile, reduced motion, JavaScript off). Lighthouse mobile performance 99–100 on a quiet machine, CLS 0.

**Phase 1 additions after the rebrand (done)**
- `useDrawLines`: a new hook that draws sketch lines with DrawSVG as they scroll into view.
- The scroll-progress line now has a small crosshair marking its leading end.
- `<RevealImage>`: images reveal through a curved wipe while a hairline crosshair flashes at one corner. It's ready for when photos are supplied.

**Phase 2: home hero, "Blueprint to Reality" (done)**
- **Drafting grid:** the hero sits on a faint drafting grid that shifts slightly with the mouse (desktop) and on scroll.
- **3D building, like the logo:** three solid towers with a front, a darker side and a lit top, in the logo's charcoal-steel and copper, and the copper S ribbon as a solid band with a dark underside.
- **On load:** the building appears as a 3D blueprint: steel hairlines, the towers' wireframe, the outline of the ribbon, and the four service callouts on copper leader lines. The tagline rises word by word.
- **Once the blueprint has drawn, the building fills with the logo colours on its own**, about 1.3–4 seconds after the page opens (changed from scroll-driven at the client's request). It's pure CSS, so it plays even if scripts are slow, blocked or switched off, and it doesn't depend on scrolling:
  - the drawing swings into place in 3D;
  - each tower fills with the logo colours from the ground up;
  - the fire, HVAC, water and electrical runs appear;
  - the solid copper ribbon sweeps in;
  - a "render" panel is revealed behind the towers along an S-curve;
  - the linework fades back.
- **The render panel is a placeholder.** It's a tinted panel until the client supplies a project photo or render (TODO).
- **On desktop the building tilts slightly in 3D towards the mouse** (at most 6°).
- **Hero buttons:** they lean slightly towards the pointer on desktop.
- **Primary button hover:** every primary button now fills with a lighter copper along a curve on hover. The fill is copper-600, not the brief's copper-500, so white text stays above the AA contrast minimum.
- **Without JavaScript, or with reduced motion,** the finished building is shown straight away.
- **Small download cost:** +0.4 KB on first load and +0.5 KB in the shared motion file, plus 1.0 KB that only the home page loads.
- **Tested:**
  - Lighthouse mobile, home page: Performance 98, Accessibility 100, CLS 0.
  - axe: 0 violations on all 14 pages.
  - No console errors or CSP violations.
  - Headings wrap the same before and after the web font loads.

**Phase 3: discipline animations (done)**
- **Each discipline has its own small animated drawing:** steel lines with a moving copper part.
  - Electrical: a current pulse runs from the busbar through the breaker to the load.
  - Mechanical: two gears turn together.
  - Fire: a sprinkler sprays.
  - HVAC: air flows through a duct and curls out of a diffuser.
  - Wet services: water flows into a tank and the level rises.
- **Where they appear:** the home-page discipline cards, the Services page cards and the top of each service page. They loop gently only while on screen.
- **Hovering over a service card, or tabbing to it with the keyboard,** tilts the card slightly (at most 6°). A copper line draws along its top edge, crosshairs appear in the corners, and the drawing plays.
- **Phones, reduced motion and no JavaScript:**
  - Phones show half the spray particles and don't tilt.
  - With reduced motion or without JavaScript, each drawing shows as a still picture.
- **Small download cost:** +0.6 KB on first load, +0.4 KB in the shared motion file, and the drawings themselves are 1.0 KB.
- **Tested in Chrome and Firefox:**
  - Drawings play only while on screen.
  - Hover and keyboard focus work the same way.
  - Reduced motion and phones behave as above.
  - axe: 0 violations on all 14 pages.
  - No console errors or CSP violations.
  - Lighthouse Performance 99 on Home and Services.

**Font loading changed to remove a layout shift.** At some phone widths, text wrapped differently in the backup font than in Montserrat. When the web font arrived, the header moved (CLS 0.015 on /services at 412 px).
- **The fix:** Montserrat now loads with `font-display: optional` and is downloaded early. The browser waits about 0.1 s for it. If it hasn't arrived, the page uses the size-matched backup font and never switches, so text can't move.
- **Result:** CLS is 0 in all 12 Lighthouse runs on /services, /privacy, /services/mechanical and /.
- **Trade-off, measured:**
  - On a first visit over mobile data (emulated fast or slow 4G), the whole visit renders in the backup font. The site moves between pages without reloading, so it doesn't switch part-way through.
  - On the next visit the font is cached and every page uses Montserrat.
  - On a fast connection, it's Montserrat from the start.
- **Known console warning:** Chrome logs a harmless "preloaded but not used" warning when a page is reloaded in the same tab.

**Phase 4: Sustainability, "Follow the Water" (done)**
- **A steel pipe runs down the left edge of the Sustainability page** through five stages, one per section: Rainwater catchment (climate) → Filtration (carbon footprint) → Storage tank (our offering) → Grey water reuse (water systems) → Building (overall vision).
- **As you scroll, water flows down the pipe.** Its leading edge stays level with the middle of the screen, with droplets running into it. When it reaches a stage, the stage lights up: a copper ring appears, its small drawing turns copper, and the copper rule under that section's label draws in. Scrolling back drains it again.
- **The storage tank fills** as the water travels on from it to the next stage.
- **On wide screens** each stage shows a small drawing (rain on a roof, a filter, a tank, a return loop, a building). Above 1536 px the stage names also appear beside the pipe. On phones the stages are simple dots, with half the droplets.
- **6.57 million litres** is now set large in copper and counts up when it scrolls into view. Its width doesn't change while counting.
- **500 small houses**, one per household, sit under the figure and fill from steel to copper in a diagonal wave.
- **Population chart:** a small line chart under "65–67 million" draws as you scroll, ending in a copper point at 2030. The site gives only the 2030 figure, so the line is an illustrative rising trend with no other values on it.
- **Without JavaScript or with reduced motion** you see the finished picture: pipe full, every stage lit, all houses copper, the final number.
- **No content changed.** The stage names come from the brief. The sections gained a full-width wrapper so the pipe can line up with them.
- **Small download cost:** the page's motion file is 1.2 KB gzipped and loads only on this page. The first-load bundle is unchanged.
- **Tested in Chrome and Firefox, at 1440 px and 390 px:**
  - Each stage lights exactly when the water reaches it, and only up to that stage.
  - The leading edge tracks mid-screen to the pixel, and the pipe ends at the last stage.
  - The tank is half full halfway to the next stage. The counter, house wave and chart behave as described.
  - Reduced motion and no-JS show the finished picture.
  - CLS 0 over the whole scroll.
  - Site-wide: axe 0 violations on 14 pages at both widths, no console errors or CSP violations.

**Page-hero graphics and service-page 3D models (done)**

About, Services, the five service pages, Sustainability, Projects, Team and Contact now each have their own drawing beside the heading instead of the generic construction lines. Privacy and the 404 page keep the construction lines. The drawings are shown from xl (1280 px) up, in the same steel-and-copper style as the rest of the site, and are decorative (hidden from screen readers) unless noted. Details are in [DESIGN.md → Motif](DESIGN.md) and [DESIGN.md → Motion](DESIGN.md#motion).
- **About, "lifecycle":** one building drawn in section across four bays: detailing, design, supervision and commissioning ([AboutLifecycle.tsx](src/components/sections/AboutLifecycle.tsx)).
- **Services, "drawing sheet":** a building sheet with all five disciplines and a title block. Hovering over or tabbing to a service card lights that discipline in copper. Otherwise the disciplines take turns while the sheet is on screen. The title-block rows are real links. A caption box under them shows the lit discipline's number, name, project count and summary. Screen readers skip the caption, because it repeats the cards ([ServicesSheet.tsx](src/components/sections/ServicesSheet.tsx)).
- **Sustainability, "cutaway":** the building's water and energy cycle in section ([SustainabilityCutaway.tsx](src/components/sections/SustainabilityCutaway.tsx)).
- **Projects, "skyline":** an elevation of the building types the company works on (station, hospital, campus, airport, mall and factory) on one ground line, each with one copper detail that identifies it. It replaced an earlier per-project timeline ([ProjectSkyline.tsx](src/components/sections/ProjectSkyline.tsx)).
- **Team, "org board":** the leaders as larger figures at the top, a copper line down to a rail, and one branch per discipline ending in a trade icon (fan, gear, hard hat, set square, folder) with one figure per person under it. It's built from `team.ts`, so a new hire adds a figure ([TeamNetwork.tsx](src/components/sections/TeamNetwork.tsx)).
- **Contact, "circuit":** a single-line diagram from the visitor to the office. The switch closes and the line turns copper, as if sending a message closes a circuit ([ContactCircuit.tsx](src/components/sections/ContactCircuit.tsx)).
- **Service pages:** a larger version of each discipline's animated drawing sits beside the text, with finer lines and slower loops. Below xl the small drawing stays under the intro. To make this possible, the drawings' line widths and loop speeds are now set in CSS (`--sch-k`, `--sch-solid`, `--sch-t`) rather than in the SVG. At card size they look the same as before.
- **Service-page 3D models** ([ServiceModel.tsx](src/components/ui/ServiceModel.tsx) + [src/three/](src/three/), using three.js):
  - On screens 1280 px and wider with a mouse or trackpad, a 3D model of the discipline replaces the larger drawing once the page is idle. It fades in. The models are a busbar and breaker feeding a motor and a lamp, a meshing gear and pinion, a sprinkler spraying, a duct into a diffuser, and a tank filling through a valve.
  - **Entrance, "blueprint to reality":** the outlines draw in, the solids fade up through them, then the model tilts slightly towards the pointer and sways slowly.
  - **Download cost:** the 3D code is its own file of about 150 KB gzipped. It loads only on service pages, only on desktops with a mouse, and never with reduced motion or without WebGL. Phones, tablets and everyone else keep the SVG drawing and download nothing extra. The model renders only while it's on screen and the tab is visible, and it's cleaned up when you leave the page. If WebGL fails, the drawing comes back.
- `PageHero` gained an `aside` slot for these graphics. The pages without one still show the construction lines.
- **Tested:** `npm run build` passes, including the type check and the pre-render check for CSP-unsafe output. `npm audit`: 0 vulnerabilities.

**Still to do (motion pass):** project map · stats and details · Phase 7 cross-browser QA (including the 3D models in Safari) and a full "Motion system" README section.

### Rebrand to the approved logo

The client approved a new logo: a copper "S" ribbon sweeping past charcoal steel towers. The site is being re-themed to match, in four phases.

**Phase 1: audit and proposal (done).** The audit found 235 old colour references in 37 files and 8 files using the red slash motif. The colour scale and contrast table were approved, along with the plans for the transition and hero.

**Phase 2: colours and global look (done)**
- **The approved logo** is in `public/images/brand/`. The header, mobile menu and footer use resized copies of it; the artwork itself is unmodified. It's also the logo in the search-engine data.
- **New colours**, sampled from the logo: `ink` charcoal, `paper` off-white, and steel and copper scales, plus a separate error colour for forms. Every colour combination in use is checked against WCAG AA; see the [DESIGN.md](DESIGN.md#colour) contrast table.
- **Light and dark:** the old navy page headers are now light. The dark sections are the footer, the stats band and the mobile menu, plus About's mission and Sustainability's water-saving sections. Copper stands out against them.
- **Buttons and links:** buttons are copper with white text, and secondary buttons have a steel outline. Focus rings are copper. Form fields have steel borders, and errors show in their own colour with an icon and text.
- **Typography:** big headings are heavier (800) to match "PRO". Section labels are widely spaced capitals, like "CONSULTING ENGINEERS".
- **Text no longer jumps when the font loads.** There is now a size-matched fallback font for each weight, so text wraps the same before and after Montserrat arrives.
- **Favicon, app icons, browser theme colour and social share image** are rebuilt in the new palette. The favicon's simplified "S" mark is a placeholder that needs client approval.
- **Zero old colour references** remain in the code (`src/`, `index.html`, `public/`). [DESIGN.md](DESIGN.md) is rewritten: palette, contrast, typography, logo usage rules and motif rules.
- **Tested:** axe found 0 accessibility violations on every page at 390 and 1440 px. No console errors or CSP violations, and no layout shift above 0.001.

**Phase 3: graphics and motion (done).** The red slash is gone everywhere. In its place are elements taken from the logo:
- **Home hero, "Blueprint to Reality":** a hand-drawn line drawing. First the construction lines draw: a circle, crosshairs, dimension ticks and a ground line. Then the steel towers rise and the copper S ribbon sweeps past them. The fire, HVAC, water and electrical runs appear inside the towers, and the four service callouts pop in with leader lines.
- **Page transition:** a copper ribbon sweeps across the screen along an S-curve, then pulls away to reveal the next page (about 0.6 s).
- **First-visit intro:** draws the logo's construction lines and copper S, then the towers rise and the panel lifts away.
- **Section labels:** a thin copper rule underneath and a small steel crosshair, drawn on as you scroll.
- **Interior pages and the 404 page:** quiet steel construction lines in the header.
- **Copper sweep divider:** above the call-to-action band, on the dark home-page panel and at the foot of the mobile menu.
- **Smaller details:** a curved image-reveal wipe, a plain copper scroll-progress rule, and a copper arc on the team initials tiles.
- **Built to draw safely:** graphics above the fold draw with CSS, so they need no JavaScript and can't flicker. Below the fold, GSAP DrawSVG draws them. With reduced motion, everything appears complete straight away.
- **Small download cost:** +1.2 KB on first load and +1.5 KB in the motion file. The hero drawing is about 2 KB.
- **Tested:**
  - axe: 0 accessibility violations on every page at 390 and 1440 px.
  - No console errors, no CSP violations, and no layout shift above 0.001.
  - The page transition finishes in under 0.7 s, and focus moves to the new page's heading.
  - The drawings complete with JavaScript turned off.

**Phase 4: QA (done).** Tested against a local server that behaves like Netlify, with compression and the real security headers.
- **Old branding:** zero references to the old navy and red colours, and none to the slash, anywhere in the code.
- **Accessibility:** axe (WCAG 2.2 AA, including colour contrast) found 0 violations on all 14 pages at 390 and 1440 px. Keyboard focus rings are copper: copper-500 on light backgrounds, copper-300 on dark.
- **Lighthouse (mobile, median of 3 runs):**
  - Performance is 98–99 on Home, About, Electrical, Sustainability, Projects and Contact, with CLS 0 everywhere. Every run plays the first-visit intro, so this is the worst case.
  - Accessibility and SEO are 100 on every page.
  - Best Practices shows 81 only because antivirus on the test PC (Kaspersky) inserts an `http://` script into every page. That won't happen on Netlify.
- **Layout shift:** 0.001 or less on every page, scrolled top to bottom.
- **Reduced motion:** with the device setting on, all 14 pages show everything at once, with no intro and no smooth scrolling. The footer switch does the same and is remembered.
- **Browsers:** Chrome and Firefox 159 both pass. In both:
  - Drawings complete on every page.
  - The intro plays and clears.
  - The page transition finishes and focus moves to the heading.
  - The reduce-motion switch works.
  - No console errors and no security-policy violations.
- **Not tested:** Safari and iOS Safari, which don't run on Windows. Check them on a real iPhone and Mac on the Netlify deploy preview.
- **Page transition:** about 0.55–0.63 s from click to the new page fully showing, with a worst case of 0.68 s, under the 0.7 s budget. To get there, the page now swaps as soon as the copper ribbon covers the screen, and all three ribbons pull away together.

### Changes on 24–25 November 2026

A summary of the latest session. The details are in the sections above and in [DESIGN.md](DESIGN.md).

- **Home hero:** the "Blueprint to Reality" building is redrawn in 3D like the logo, and it now fills with colour on its own after loading rather than on scroll ([Phase 2](#motion--effects-pass)). The empty space between the header and the first line of text is reduced: the top padding is now 32 px on phones, 40 px on tablets and 48 px on desktop, down from 80, 112 and 128 px.
- **Service pages:** the construction lines beside the heading are replaced by a larger version of each discipline's animated drawing. On desktops with a mouse, a three.js 3D model of the discipline then replaces the drawing: busbar to motor and lamp, meshing gears, sprinkler spray, duct and diffuser, and a filling tank. The 3D code is a separate download of about 150 KB, loaded only there. Phones, tablets, reduced motion and browsers without WebGL keep the drawing.
- **Hero drawings on the other pages:** About (lifecycle), Services (drawing sheet with links), Sustainability (cutaway), Projects (skyline), Team (org board) and Contact (circuit).
- **Contact page:** redesigned, with a dark office panel, service chips on the form, a character count and a click-to-load map.
- **Team page:** an optional LinkedIn button per person (shown for S. Pietersen).
- **Docs:** [DESIGN.md](DESIGN.md) updated for all of the above.
- **Tested:** `npm run typecheck` and `npm run build` pass (all 14 pages pre-render with no CSP-unsafe output). The 3D models were checked in headless Chrome: they load with no console errors, aren't downloaded on narrow screens or with reduced motion, and fall back to the drawing if WebGL fails. Not yet tested in Safari or on real phones and tablets.

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
    sections/           page hero, CTA band, stats band, project card, page-hero drawings
    contact/            contact form, validation, click-to-load map
    ui/                 small building blocks (logo, label, sketch lines, copper sweep, tags, avatars, 3D model host…)
  motion/             all animation: tokens, GSAP hooks, page transition, intro, reduce-motion switch
  three/              service-page 3D models (three.js): stage.ts (renderer, lazy-loaded), kit.ts, models/
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

**LinkedIn (optional):** add `linkedin: 'https://www.linkedin.com/in/…'` to show a "LinkedIn profile" link under the person's name. It opens in a new tab. S. Pietersen's profile is linked this way.

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
- Contrast rules are in [DESIGN.md](DESIGN.md#contrast-wcag-22-aa--measured). `copper-500` is for large text, rules and graphics only; `steel-500` is never used for text on `ink`.

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
| Three.js hero (optional) | Not used | The hand-drawn SVG blueprint hero carries the brand without adding about 150 KB of JavaScript. |
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

- [x] **Approved S-PRO logo** in place: `public/images/brand/SPRO_logo_clean.png` (original), resized copies used by [Logo.tsx](src/components/ui/Logo.tsx), and `logo` in the JSON-LD ([schema.ts](src/content/schema.ts)).
- [ ] **TODO: request vector logo (SVG/AI/EPS) from client.** The supplied logo is a raster PNG, so it can't be shown larger than its native size.
- [ ] **TODO: reversed logo from designer** for dark backgrounds. Until then the footer and mobile menu show the full-colour logo on a white panel.
- [ ] **Favicon and app icons** from the new brand: [favicon.svg](public/favicon.svg) is still the old placeholder; add `apple-touch-icon.png` (180×180) and `favicon.ico` ([index.html](index.html)). Any simplified "S" mark needs client approval.
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
