# S-PRO Design System

Source of truth for the website's visual language. Tokens live in
[`tailwind.config.ts`](tailwind.config.ts); this document explains how to use them.

Derived from the S-PRO Company & Sustainability Profile (PDF). Tagline:
**Sustainable Innovation — Engineering Solutions.**

Tone: confident, technical, clean, corporate — a premium engineering consultancy,
not a template.

---

## Colour

| Token | Hex | Role |
|---|---|---|
| `navy` / `navy-700` | `#252B72` | Primary. Headings, dark sections, header/footer. *Approximate — TODO confirm against the vector logo.* |
| `crimson` / `crimson-600` | `#D92B25` | Accent. Primary buttons, focus rings, the slash motif. |
| `crimson-700` | `#B5221D` | Primary button hover. |
| `maroon` | `#8B2323` | Secondary accent. Eyebrow labels, second slash band. |
| `ink` | `#141840` | Body text on light. |
| `ink-muted` | `#4A4F6A` | Secondary text on light. |
| `surface` / `surface-subtle` / `surface-muted` | `#FFFFFF` / `#F4F5F8` / `#E8EAF0` | Backgrounds, cards, borders. |
| `navy-50…950` | scale | Tints for text on navy (`navy-100`, `navy-200`) and borders. |

### Contrast rules (WCAG 2.2 AA)

| Combination | Ratio | Use |
|---|---|---|
| navy on white | ≈ 12.6 : 1 | ✅ any text |
| ink-muted on white | ≈ 8 : 1 | ✅ any text |
| maroon on white | ≈ 8.9 : 1 | ✅ any text |
| crimson on white | ≈ 4.9 : 1 | ✅ text ≥ 14px; prefer for links, eyebrows, small accents |
| white on crimson | ≈ 4.9 : 1 | ✅ button labels |
| white / navy-100 / navy-200 on navy | ≥ 6.6 : 1 | ✅ any text |
| **crimson on navy** | ≈ 2.6 : 1 | ❌ **never for text or icons.** Decorative shapes only (slashes, rules). |
| **maroon on navy** | ≈ 1.5 : 1 | ❌ decorative only |

On dark (navy) surfaces, add the `on-dark` class so focus rings switch from crimson to white.

---

## Typography

Montserrat Variable, self-hosted via `@fontsource-variable/montserrat` (no font CDN, so the CSP stays strict).

| Token | Size | Use |
|---|---|---|
| `text-display` | clamp(2.5rem → 4.75rem), 700 | Home hero only |
| `text-h1` | clamp(2rem → 3.25rem), 700 | One per page |
| `text-h2` | clamp(1.625rem → 2.375rem), 700 | Section headings |
| `text-h3` | 1.25rem, 600 | Card / sub-section headings |
| `text-eyebrow` | 0.75rem, 600, +0.18em tracking, uppercase | Labels above headings (`.eyebrow` = maroon) |
| body | 1rem / 1.125rem, 400, relaxed leading | Max line length `max-w-prose` (42rem) |

Hero secondary lines use weight 300 (`font-light`), echoing the profile cover's
"ENGINEERING SOLUTIONS" line.

---

## Motif: the diagonal slash

The profile's signature is a bold **crimson band with a maroon band beside it**,
cutting diagonally across the page. On the web we redraw it as geometry, not
stock-photo overlays:

- Two parallel bands: crimson in front, maroon behind/below, separated by a small gap.
- Angle: **-18° to -24°** (rising left to right), consistent within a page.
- Built with rotated `div`s or `clip-path` / inline SVG. Always `aria-hidden="true"` and `pointer-events-none`.
- Used once per major section at most: page heroes, footer, mobile drawer, 404, CTA bands.
- Over photography: the slash crops the image (clip-path), it doesn't sit on it as a translucent overlay.
- Never put text on top of a slash band.

---

## Layout

- Container: `.container-page` (max 76rem, 16px gutter at mobile, 24px at `sm`, 32px at `lg`).
- Breakpoints: Tailwind defaults; the design is checked from **360px** upward.
- Vertical rhythm: sections `py-16` (mobile) to `py-24` (desktop).
- Corners: square or `rounded-sm` — engineering-precise, never pill-shaped.
- Elevation: `shadow-card` only; prefer borders (`surface-muted`) over shadows.

## Components

- Buttons: `.btn-primary` (crimson), `.btn-secondary` (navy outline), `.btn-on-dark` (white outline on navy). Min height 44px (target size).
- Links in body copy: navy, underlined; crimson on hover.
- Icons: `lucide-react`, 1.5–2px stroke, always `aria-hidden` with a text label nearby.
- Team avatars: initials on a navy tile with a crimson corner slash, until consented photos are supplied.

## Motion

Motion tells the S-PRO story — **design on paper → built reality**, and **systems that flow**.
It should feel precise, confident and engineered: crisp eases, no bounce, nothing playful.
Everything lives in [`src/motion/`](src/motion/).

### Tokens — [`src/motion/tokens.ts`](src/motion/tokens.ts)

| Token | Value | Use |
|---|---|---|
| `duration.ui` | 200 ms | Hover, focus, toggles |
| `duration.wipe` | 240 ms | One slash band crossing the screen (route transition) |
| `duration.reveal` | 700 ms | Content fading up |
| `duration.heading` | 900 ms | Heading lines rising from their mask |
| `duration.draw` | 1.1 s | Slash bands and image wipes drawing in |
| `duration.count` | 1.6 s | Number count-ups |
| `ease.out` / `bezier.out` | `power3.out` / `cubic-bezier(0.22, 1, 0.36, 1)` | Default for entrances (= Tailwind `ease-brand`) |
| `ease.expo` | `expo.out` | Heading lines, image wipes |
| `ease.inOut` / `bezier.inOut` | `power3.inOut` / `cubic-bezier(0.65, 0, 0.35, 1)` | Wipes that cover and uncover the screen |
| `stagger.items` / `.lines` / `.bands` | 80 / 80 / 50 ms | Delay between siblings |
| `distance.reveal` | 32 px | How far content rises |
| `revealStart` | `top 88%` | When scroll reveals fire |
| `slashAngle` | 20° | The slash, rising left to right |

CSS keyframes in `src/styles/index.css` mirror these values; change both together.

### Hooks (GSAP, inside `useGSAP` so they are reverted on unmount)

All take a scope ref and the reduced-motion flag, and react to data attributes, so pages stay free of animation code.

| Hook | Attribute | Effect |
|---|---|---|
| `useReveal` | `data-reveal-item` | Fades up in staggered batches |
| | `data-reveal-image` | Revealed through an angled clip-path wipe (the slash angle) |
| | `data-slash` | Section slash bands draw in, maroon after crimson |
| `useSplitHeading` | `data-split` | Heading rises line by line from a mask (SplitText `lines` + `mask`), then reverts to plain text. Static text only. |
| `useCountUp` | `data-stat` | Number counts up once, then settles on the exact source text |
| `useParallax` | `data-parallax="18"` | Layer drifts by that % as its section scrolls away. Put it on an untransformed wrapper. |
| `useReducedMotion` | — | OS setting OR the footer toggle (safe in eager code) |

Only elements that **start below the viewport** get scroll reveals, so nothing visible ever blinks out.

### Site-wide effects

- **First-visit intro** (`IntroOverlay`): the tower mark draws as blueprint line art, fills with brand colour, and the panel wipes away on the diagonal — about 1.2 s, once per browser session, skipped by any key or tap. Pure CSS, started before first paint by `public/motion-gate.js`; the page renders underneath, so it never delays LCP.
- **Route transition** (`PageTransition`): a crimson band then a maroon band sweep up across the screen (clip-path), the page swaps underneath, and they sweep off the top — about 650 ms. Scroll resets and focus moves to the new page's `<h1>` while covered.
- **Scroll progress** (`ScrollProgress`): a 4 px crimson bar with an angled leading edge along the top.
- **Smooth scroll**: Lenis, driven by `gsap.ticker` and feeding `ScrollTrigger.update`.
- **Hero entrance**: CSS keyframes (`data-reveal="1|2|3"`, `<SlashBands intro>`), so it runs before any JS. During the intro it waits for the panel to clear.

### Loading

- GSAP, ScrollTrigger, SplitText, `@gsap/react` and Lenis are in one lazy chunk (`runtime.tsx`), fetched after hydration. **Import `src/motion/gsap.ts` and the hooks only from lazily loaded modules**, never from eager code.
- Page-specific plugins (DrawSVG, MorphSVG, Flip) are registered in the page modules that use them.
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

Not in scope for v1. Tokens are named semantically (`ink`, `surface`) so a dark theme can be added later.
