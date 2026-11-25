# S-PRO Design System

Source of truth for the website's visual language. Tokens live in
[`tailwind.config.ts`](tailwind.config.ts); this document explains how to use them.

Derived from the approved S-PRO logo ([`public/images/brand/SPRO_logo_clean.png`](public/images/brand/SPRO_logo_clean.png)):
a copper ribbon forming an "S" sweeping past charcoal steel towers, over architectural
sketch lines, with "PRO" in heavy charcoal and "CONSULTING ENGINEERS" in widely tracked
capitals above a thin copper rule. Tagline: **Sustainable Innovation — Engineering Solutions.**

Feel: warm metallic copper against cool charcoal steel. Architectural, premium, calm —
an architect's drawing set and brushed metal.

---

## Colour

Sampled from the logo (charcoal `#2F373C`, steel `#5D6771`, copper `#7C5234`–`#D3AA80`)
and set to the approved values below.

| Token | Hex | Role |
|---|---|---|
| `ink` | `#2B3238` | Primary text; dark sections (footer, stats band, mobile menu) |
| `paper` | `#F7F5F2` | Page background |
| `white` | `#FFFFFF` | Cards, heroes, contrast sections |
| `steel-700` | `#4D5B68` | Headings on light backgrounds, secondary buttons |
| `steel-600` | `#586572` | Secondary text on light |
| `steel-500` | `#636F7B` | Icons, sketch hairlines |
| `steel-400` | `#828C95` | Form field borders (non-text, 3.42 : 1) |
| `steel-200` | `#D5DADF` | Hairlines, dividers, card borders |
| `copper-700` | `#88542F` | Small copper text and links on light; primary button background |
| `copper-600` | `#9E683C` | Primary button hover |
| `copper-500` | `#B37B48` | Main brand accent: large headings, rules, graphics, focus ring |
| `copper-300` | `#CB9C70` | Accents and labels on `ink`; focus ring on dark |
| `copper-100` | `#D8B492` | Thin rules, text selection, subtle fills |
| `water` / `water-300` | `#7E97A9` / `#B4C4D0` | Graphics that must read as water only (tank levels, the Sustainability pipe); never text |
| `linkedin` | `#0A66C2` | LinkedIn's brand blue — only inside the LinkedIn "in" logo (Team page profile button) |
| `error` / `error-50` | `#A33A2B` / `#F9ECEA` | Form errors only — always with an icon and text |

`steel` and `copper` each have a full 50–900 scale in the Tailwind theme.

### Contrast (WCAG 2.2 AA) — measured

| Combination | Ratio | Use |
|---|---|---|
| ink on white / paper | 12.99 / 11.94 : 1 | ✅ any text |
| steel-700 on white / paper | 6.97 / 6.41 : 1 | ✅ any text |
| steel-600 on white / paper | 5.97 / 5.48 : 1 | ✅ any text |
| steel-500 on white / paper | 5.13 / 4.72 : 1 | ✅ any text (prefer steel-600 for body) |
| copper-700 on white / paper | 6.26 / 5.75 : 1 | ✅ small copper text and links |
| **copper-500 on white / paper** | 3.59 / 3.30 : 1 | ⚠️ **large text only** (24px+, or 19px bold+), rules, icons, graphics. Never body text or small links. |
| white on copper-700 | 6.26 : 1 | ✅ primary button |
| white on copper-600 | 4.67 : 1 | ✅ primary button hover |
| **white on copper-500** | 3.59 : 1 | ❌ not for button labels |
| white / steel-200 on ink | 12.99 / 9.23 : 1 | ✅ any text |
| copper-300 / copper-100 on ink | 5.28 / 6.72 : 1 | ✅ accents, labels, figures on dark |
| **steel-500 on ink** | 2.53 : 1 | ❌ never text on dark |
| error on white / paper / error-50 | 6.57 / 6.04 / 5.70 : 1 | ✅ error messages |
| ink on copper-100 | 6.72 : 1 | ✅ text selection |
| Focus ring: copper-500 on paper / copper-300 on ink | 3.30 / 5.28 : 1 | ✅ non-text 3 : 1 |

On dark (`ink`) surfaces, add the `on-dark` class so focus rings switch to `copper-300`.
Use dark sections sparingly — footer, stats band, mobile menu, and at most one or two
high-impact sections per page. Copper should glow against them.

---

## Typography

Montserrat Variable, self-hosted via `@fontsource-variable/montserrat` (no font CDN, so the
CSP stays strict). Its heavy weights match the logo's "PRO".

| Token | Size | Use |
|---|---|---|
| `text-display` | clamp(2.5rem → 4.75rem), **800** | Home hero only |
| `text-h1` | clamp(2rem → 3.25rem), **800** | One per page |
| `text-h2` | clamp(1.625rem → 2.375rem), 700 | Section headings (`steel-700`) |
| `text-h3` | 1.25rem, 600 | Card / sub-section headings |
| `text-eyebrow` | 0.75rem, 600, **+0.3em** tracking, uppercase | Section labels, like "CONSULTING ENGINEERS" (`.eyebrow` = copper-700) |
| body | 1rem / 1.125rem, 400, relaxed leading | Max line length `max-w-prose` (42rem) |

Hero secondary lines use weight 300 (`font-light`) in `copper-500` — allowed because they
are display size.

**Loading (zero layout shift):** Montserrat is declared in `src/styles/index.css` with
`font-display: optional` and preloaded (`scripts/prerender.mjs`). If the font isn't ready
within ~100 ms the page uses `Montserrat Fallback` — Arial / Arial Bold scaled per weight
band (400, 600, 700, 800) — and never swaps, so text can't move. Trade-off, measured: on a
first visit over mobile data the whole visit renders in the fallback (the site navigates
without reloading); once the font is cached, every later visit uses Montserrat. Keep the
fallback metrics tuned so the fallback still looks right.

---

## Logo

- Use the approved file only: [`SPRO_logo_clean.png`](public/images/brand/SPRO_logo_clean.png),
  through the `<Logo>` component, which serves trimmed, resized WebP/PNG copies with `srcset`.
- **Never redraw, recolour, stretch or crop into the artwork.** It is raster: never show it
  above its native size (largest web copy is 230 × 192).
- Sizes: header 48px tall (mobile) / 64px (desktop); mobile menu 48px; footer 96px.
- Clear space: at least the height of the "O" in "PRO" on every side.
- On dark (`ink`) backgrounds, show it on a white panel (`<Logo onDark>`).
  TODO: reversed logo from designer.
- TODO: request vector logo (SVG/AI/EPS) from client.
- The favicon and app icons use a **simplified copper "S" ribbon** (`public/favicon.svg`) —
  a placeholder awaiting client approval, not part of the logo.
- Social share image: `public/images/brand/og-image.jpg` (logo on paper, copper rule).

---

## Motif

The old red/maroon diagonal slash is **retired**. Elements taken from the logo replace it
(built in rebrand phase 3; components in `src/components/ui/` and `src/components/sections/`):

- **The copper sweep:** a curved ribbon based on the logo's "S", used for the page transition,
  section dividers and image-mask edges.
- **Sketch construction lines:** thin `steel-500` hairlines at low opacity — partial circles,
  crosshair marks, dimension ticks, ground lines that overshoot their edges. Quiet background
  detail on the hero and section headings, drawn on with DrawSVG.
- **The copper rule:** a thin copper line under section labels, echoing the line under
  "CONSULTING ENGINEERS".
- **Tracked capitals:** section labels at +0.3em (`text-eyebrow`).

Rules: use with restraint; hairlines never compete with content; never put text on a
graphic; always `aria-hidden="true"` and `pointer-events-none`.

Where they appear: `<HeroBlueprint>` (home hero), `<SketchLines>` (interior heroes except About, Services, the service pages, Sustainability, Projects and Team; 404), `<AboutLifecycle>` (About hero: one building in section across four bays, detailing, design, supervision and commissioning), `<ServicesSheet>` (Services hero), `<SustainabilityCutaway>` (Sustainability hero: the building's water and energy cycle in section), `<ProjectTimeline>` (Projects hero: one copper square per project, stacked by year on a ground line from the first project year to the last, with steel hairlines back to the start year for multi-year projects; built from `projects.ts`), `<TeamNetwork>` (Team hero: the team as an electrical single-line diagram, leadership as the supply transformer feeding a copper busbar, one branch per discipline with a breaker, one load node per person; built from `team.ts`), `<Eyebrow>` (every section label: copper rule plus a steel registration crosshair), `<SweepDivider>` (call-to-action band, mobile menu, dark panels), the S-sweep page transition, the intro and team avatars. Above the fold they draw with CSS; below the fold with GSAP (DrawSVG / scaleX).

---

## Layout

- Container: `.container-page` (max 76rem, 16px gutter at mobile, 24px at `sm`, 32px at `lg`).
- Breakpoints: Tailwind defaults; the design is checked from **360px** upward.
- Vertical rhythm: sections `py-16` (mobile) to `py-24` (desktop).
- Corners: square or `rounded-sm` — engineering-precise, never pill-shaped.
- Elevation: `shadow-card` only; prefer borders (`steel-200`) over shadows.

## Components

- Buttons: `.btn-primary` (copper-700, white text; hover copper-600), `.btn-secondary` (steel-700 outline on white), `.btn-on-dark` (copper-300 outline on ink). Min height 44px (target size).
- Links in body copy: steel-700, underlined; copper-800 on hover.
- Form fields (`.field`): steel-400 border on a steel-50 tint, copper-700 border plus the focus ring on focus, optional decorative leading icon; errors in `error` with an icon and text. Single-choice options with icons use radio tiles (copper-700 border, copper-50 fill and a copper corner when checked).
- Contact page: the form and an `ink` "office" panel sit in one card that overlaps the hero; contact rows on the panel are tiles whose link covers the whole tile (`.tile-link`).
- Icons: `lucide-react`, 1.5–2px stroke, always `aria-hidden` with a text label nearby.
- Team avatars: initials on an `ink` tile with a copper/steel corner band, until consented photos are supplied.
- Selection: `copper-100` background, `ink` text.

## Motion

Motion tells the S-PRO story — **design on paper → built reality**, and **systems that flow**.
It should feel precise, confident and engineered: crisp eases, no bounce, nothing playful.
Everything lives in [`src/motion/`](src/motion/).

### Tokens — [`src/motion/tokens.ts`](src/motion/tokens.ts)

| Token | Value | Use |
|---|---|---|
| `duration.ui` | 200 ms | Hover, focus, toggles |
| `duration.wipe` | 240 ms | The copper S-sweep crossing the screen (route transition) |
| `duration.reveal` | 700 ms | Content fading up |
| `duration.heading` | 900 ms | Heading lines rising from their mask |
| `duration.draw` | 1.1 s | Sketch lines, rules and image wipes drawing in |
| `duration.count` | 1.6 s | Number count-ups |
| `ease.out` / `bezier.out` | `power3.out` / `cubic-bezier(0.22, 1, 0.36, 1)` | Default for entrances (= Tailwind `ease-brand`) |
| `ease.expo` | `expo.out` | Heading lines, image wipes |
| `ease.inOut` / `bezier.inOut` | `power3.inOut` / `cubic-bezier(0.65, 0, 0.35, 1)` | Wipes that cover and uncover the screen |
| `stagger.items` / `.lines` / `.bands` | 80 / 80 / 50 ms | Delay between siblings |
| `distance.reveal` | 32 px | How far content rises |
| `revealStart` | `top 88%` | When scroll reveals fire |
| `--d` / `--dur` (CSS) | classes `[--d:0.3s]` / `[--dur:0.45s]` | Delay / duration for the CSS draw classes `draw`, `draw-fill`, `draw-rise`, `draw-pop`, `rule-intro` (index.css) |

CSS keyframes in `src/styles/index.css` mirror these values; change both together.

### Hooks (GSAP, inside `useGSAP` so they are reverted on unmount)

All take a scope ref and the reduced-motion flag, and react to data attributes, so pages stay free of animation code.

| Hook | Attribute | Effect |
|---|---|---|
| `useReveal` | `data-reveal-item` | Fades up in staggered batches |
| | `data-reveal-image` | Revealed through a curved clip-path wipe (a circle growing from the bottom-left, after the copper sweep); a `data-reveal-mark` crosshair flashes at the corner. Use `<RevealImage>`. |
| | `data-rule` | A copper rule or sweep, drawn from the left (scaleX) |
| `useDrawLines` | `data-sketch` | An `<svg>` of construction lines (crosshairs, arcs, ticks) drawn on with DrawSVG |
| `useInViewPlay` | `data-schematic` | Sets `data-inview` while on screen, so discipline schematics loop only when visible |
| `useTilt` | `data-tilt` | Card follows the pointer in 3D, max 6° (desktop, fine pointer); clears on leave so the CSS focus tilt applies |
| `useSplitHeading` | `data-split` | Heading rises line by line from a mask (SplitText `lines` + `mask`), then reverts to plain text. Static text only. |
| `useCountUp` | `data-stat` | Number counts up once, then settles on the exact source text |
| `useParallax` | `data-parallax="18"` | Layer drifts by that % as its section scrolls away. Put it on an untransformed wrapper. |
| `useReducedMotion` | — | OS setting OR the footer toggle (safe in eager code) |

Only elements that **start below the viewport** get scroll reveals, so nothing visible ever blinks out.

### Site-wide effects

- **First-visit intro** (`IntroOverlay`): drawn from the logo's elements — construction circle, crosshair, ticks and ground line draw on, the copper S ribbon traces in, steel towers rise from the ground line, then the paper panel lifts away — about 1.2 s, once per browser session, skipped by any key or tap. Pure CSS, started before first paint by `public/motion-gate.js`; the page renders underneath, so it never delays LCP.
- **Route transition** (`PageTransition`): the copper S-sweep — a copper ribbon draws across the screen along an S-curve (a full-screen SVG path animated with `pathLength`), a steel ribbon and copper highlight following it; the page swaps underneath and all three ribbons pull away together along the same S — about 0.55–0.63 s from click to fully revealed (page swaps as soon as the copper covers the screen). Scroll resets and focus moves to the new page's `<h1>` while covered.
- **Scroll progress** (`ScrollProgress`): a 3 px copper rule (copper-500 → copper-300) along the top, with a small steel crosshair marking its leading end.
- **Home hero — "Blueprint to Reality"** (`HeroBlueprint` + lazy `HeroMotion`, home page only):
  - A drafting grid (steel-200 on paper) drifts with the mouse (desktop, fine pointer) and on scroll.
  - 3D, after the logo: three extruded towers (oblique depth DX 22 / DY −12: front face with a steel or copper gradient, darker side face, lit top, panel divisions) and the copper S ribbon as a solid band (copper-700 → copper-300 face over a steel-800 underside).
  - On load (CSS): steel construction hairlines, the towers' 3D wireframe and hairline outlines of the ribbon band draw; callouts pop in on copper leader lines; the tagline rises word by word.
  - Then, on a timer (pure CSS `build-*` classes in index.css, ~1.3–4.2 s after first paint, +0.9 s on a first visit via `--build-hold`): the SVG swings square from rotateY −24° / rotateX 10°, each tower fills with colour from the ground line up (`build-rise`), the copper ribbon draws along the S (`build-draw`), the plate and services fade in, and the wireframe fades back to 35 %. CSS, so it never waits on JS or the scroll position (it also runs with JS off); reduced motion collapses it to the finished drawing. TODO: client project render/photo for the plate.
  - 3D tilt (desktop, fine pointer): the drawing tilts up to 6° towards the pointer.
  - Magnetic CTAs (`data-magnetic`, desktop): buttons lean up to 6 px towards the pointer.
- **Discipline schematics** (`<ServiceSchematic slug>`: home cards, Services cards, service-page heroes — on service pages an enlarged `size="feature"` version replaces the sketch lines beside the text from xl up, with lines at 0.4× weight, gear teeth at 0.7×, and loops 1.5× slower, and is the static fallback for the 3D model below; below xl a small one sits under the intro): steel-500 linework with the moving element in copper-500 — Electrical: current pulse with a copper-300 glow along busbar → breaker → load; Mechanical: meshing gears; Fire: sprinkler spray (half the droplets on small screens); HVAC: airflow through a duct curling out of a diffuser; Wet services: flow into a tank whose level rises (water tint). CSS loops on transform / opacity / stroke-dashoffset, attached only while playing (in view, or card hovered / focused); the markup is a complete static frame for no-JS and reduced motion.
- **Service-page 3D models** (`<ServiceModel>` + lazy `src/three/stage.ts`, three.js, service pages only): from xl up on devices with a mouse or trackpad (`hover: hover` and `pointer: fine`, so not tablets), with motion on and WebGL available, a three.js model replaces the enlarged schematic once the browser is idle (and after the first-visit intro), cross-fading in on its first frame. Procedural geometry in brand materials — matte steel (steel-500/700), brushed copper (copper-500), a light plinth (steel-300), see-through shells, water in the `water` tint; the moving element stays copper (current pulse, airflow), except real water (spray, stream), which is `water`/`water-300`.
  - Electrical: busbar → breaker → finned motor with a turning fan, and a lamp feeder; copper pulses run the feeders and the lamp brightens as one arrives. Mechanical: steel gear and copper pinion that truly mesh (same tooth size, phased). Fire: branch line, pendent sprinkler (frame arms, glass bulb, deflector), an umbrella of droplets under gravity. HVAC: see-through duct elbowing into a louvred diffuser; copper airflow streaks travel the duct and fan out. Wet services: inlet with a gate valve into a see-through tank; a stream falls, ripples spread, the level rises and falls, tracked by a copper marker on the sight gauge.
  - Entrance ("blueprint to reality"): steel-700 outlines draw in, the solids fade up through them (0.45–1.35 s), the outlines settle to a faint hairline (the see-through duct keeps its outline at full strength). Then the model tilts up to ~12° towards the pointer (fine pointers only) and sways slowly.
  - Budget: own chunk (~150 KB gzip), never preloaded, never on phones, tablets, reduced motion or without WebGL (the SVG stays; a lost context brings it back, still animating — it stays mounted, hidden with its loops paused, while the model is live). Renders only while on screen and the tab is visible; pixel ratio capped at 2; everything disposed on unmount.
- **Sustainability — "Follow the Water"** (`<WaterRail>` / `<WaterStage>` in `WaterNetwork.tsx` + lazy `WaterMotion`, that page only):
  - A steel-500 pipe in the left gutter (same x for pipe and nodes: the middle of the gutter, 7 px on phones) runs through five stages, one per section, ending at the last.
  - Water (`water` with a `water-300` shimmer, clip-path reveal) is scrubbed so its leading edge sits at mid-viewport; droplets run into it (2 on phones, 4 on desktop). Shimmer and droplets loop only while the pipe is on screen (`data-flowing`).
  - A stage lights (`data-lit`) when the water reaches its node: copper-300 ring, the drawing's stroke turns copper (steel → copper-500, or copper-300 on ink), and the section's eyebrow rule draws (these rules are skipped by `useReveal`). The storage-tank level scales up between its node and the next.
  - Unlit / empty states are CSS gated on `html[data-js]:not([data-reduce-motion])`, so no-JS and reduced motion show the finished drawing.
  - `<HouseRow>`: one house per household (50 per row), steel-200 base pattern with copper-500 copies grouped by diagonal, faded in as a wave. `<PopulationChart>`: steel-700 line drawn on scroll (DrawSVG scrub), copper-500 end point; only the 2030 end point is data.
  - The 6.57 figure is copper-500, `tabular-nums`, and counts up with `data-stat`.
- **Service cards** (`.service-card` + `<CardDecor>`): on hover or keyboard focus the card tilts (max 6°), a copper rule draws along the top edge, steel corner crosshairs appear and the schematic plays. No tilt with reduced motion.
- **Primary button hover**: a copper-600 fill sweeps in along a curve from the bottom-left (CSS). copper-600, not copper-500: white text stays at 4.67 : 1.
- **Smooth scroll**: Lenis, driven by `gsap.ticker` and feeding `ScrollTrigger.update`.
- **Hero entrance**: CSS keyframes (`data-reveal="1|2|3"`, the `draw` classes on `<HeroBlueprint>`, `<SketchLines intro>` and `<Eyebrow intro>`), so it runs before any JS. During the intro it waits for the panel to clear (`--intro-hold`).

### Loading

- GSAP, ScrollTrigger, SplitText, `@gsap/react` and Lenis are in one lazy chunk (`runtime.tsx`), fetched after hydration. **Import `src/motion/gsap.ts` and the hooks only from lazily loaded modules**, never from eager code.
- DrawSVG is registered with the shared plugins (sketch lines appear on every page). Page-specific plugins (MorphSVG, Flip) are registered in the page modules that use them.
- Framer Motion (`LazyMotion` + `m.*` only) handles the route transition and the mobile drawer.

### Reduced motion

- Honoured from the OS setting and the footer **Reduce motion** toggle (stored in `localStorage` as `sp-reduce-motion`).
- `public/motion-gate.js` sets `html[data-reduce-motion]` before first paint, so CSS animations never start.
- With reduced motion: no intro, no route wipe (pages swap instantly), no Lenis, no scroll reveals, split headings, count-ups or parallax — content is simply there. Framer runs with `reducedMotion="always"`.
- Content must never depend on an animation to become visible. Initial (hidden) states are set from JS, never CSS, so content shows without JS or if the motion chunk fails.

### Rules (CSP and performance)

- Animate only `transform`, `opacity`, `clip-path` and SVG stroke properties — never layout properties. CLS must stay 0.
- Animate through the CSSOM only (Framer/GSAP do this). Do not inject `<style>` tags. Avoid `AnimatePresence mode="popLayout"`.
- **No `style={…}` props, and no Framer `initial`/`animate` on pre-rendered elements.** Pages are pre-rendered to static HTML, where these become `style=""` attributes that the CSP blocks (and React never re-applies on hydration). Use Tailwind classes or CSS keyframes, or render the element only after hydration (`useHydrated`). `npm run build` fails if a page contains a `style` attribute or inline script.
- No libraries that use `eval` / `new Function` (the CSP has no `unsafe-eval`), and no CDNs.
- Nothing flashes more than 3 times per second.
- Components above the page's Suspense boundary (providers, `Layout`) must not trigger a synchronous re-render of that boundary during hydration — React then discards the pre-rendered HTML (error #421). Use a leaf component or `startTransition`.

## Imagery

- WebP/AVIF with explicit `width`/`height`, `srcset`, and `loading="lazy"` below the fold.
- Photography: real S-PRO projects and plant (water tanks, purification skids, airports). TODO: source from client.
- Staff photos only with written consent (POPIA).

## Dark mode

Not in scope for v1. Tokens are named semantically (`ink`, `paper`, `steel`, `copper`) so a dark theme can be added later.
