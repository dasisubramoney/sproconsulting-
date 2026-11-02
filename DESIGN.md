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

- Easing: `ease-brand` = `cubic-bezier(0.22, 1, 0.36, 1)` (GSAP: `power3.out`). Durations 200ms (UI) to 1.1s (slash draw-in).
- **Above the fold — CSS keyframes** (`src/styles/index.css`), so they run before any JS:
  - `data-reveal` / `data-reveal="1|2|3"`: hero text rises in, staggered 80ms per step.
  - `<SlashBands intro>`: hero bands draw in from the right, maroon 150ms after crimson.
- **Below the fold — GSAP + ScrollTrigger**, lazy-loaded by `useScrollMotion` after the page renders:
  - `data-reveal-item`: cards, list items and section headings fade up in staggered batches.
  - `<SlashBands>` (no `intro`): bands draw in when scrolled into view.
  - Hero bands drift slightly (parallax) as the hero scrolls away.
  - `data-stat`: numbers count up once, then settle on the exact source text.
  - Only elements that start below the viewport are animated, so nothing visible ever blinks out.
- **Framer Motion** (`LazyMotion` + `m.*` components only): mobile drawer, project-filter fade-ins.
- **Lenis**: smooth scrolling, wired to ScrollTrigger.
- **`prefers-reduced-motion: reduce`** disables Lenis, GSAP scroll effects and Framer transitions (duration 0). Content must never depend on an animation running to become visible.
- CSP: animate through the CSSOM only (Framer/GSAP do this). Do not inject `<style>` tags. Avoid `AnimatePresence mode="popLayout"`.
- **No `style={…}` props, and no Framer `initial` on pre-rendered elements.** Pages are pre-rendered to static HTML, where these become `style=""` attributes that the CSP blocks (and React never re-applies on hydration). Use Tailwind classes or CSS keyframes instead. `npm run build` fails if a page contains a `style` attribute or inline script.

## Imagery

- WebP/AVIF with explicit `width`/`height`, `srcset`, and `loading="lazy"` below the fold.
- Photography: real S-PRO projects and plant (water tanks, purification skids, airports). TODO: source from client.
- Staff photos only with written consent (POPIA).

## Dark mode

Not in scope for v1. Tokens are named semantically (`ink`, `surface`) so a dark theme can be added later.
