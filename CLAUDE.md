# Zoomable Portfolio — Claude Code Instructions

## What this is
Chengchang Qian's personal design portfolio. React + Vite, Framer Motion, GitHub Pages.
URL: https://sherlocq.github.io/zoomable-portfolio/

## Commands
```
npm run dev      # dev server at localhost:5174
npm run build    # production build → dist/
npm run lint     # eslint .
npm run preview  # preview the production build locally
```
There is no `deploy` script and no test suite. Deployment is automatic: pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages. **Never push to `main`** unless the user explicitly says so.

## Standing instructions
- **Never push to `main`** (which triggers deployment) unless the user explicitly says so
- Whenever the user explicitly asks to **push GitHub**, update both `CLAUDE.md` and `DESIGN.md` first with the durable decisions and current project progress from that work, then build, commit, and push
- **Never populate the `build` card** — it's an intentional placeholder
- Always use exact Linear design tokens — see `DESIGN.md` for the full system

## Design system
This project uses Linear's token system (NOT Anthropic's). Key values:
- Font weight semibold: `590` (not 600)
- Accent: `#5e6ad2` (lavender) — used for CTAs, not neutral UI states
- Active/selected states (OTP sidebar bar, etc.): `var(--ink)` neutral, never accent blue
- Surface ladder: `--canvas #010102 → --surface-1 #0f1011 → --surface-2 #141516`
- Full token reference: `DESIGN.md`

## Key files
| File | Role |
|------|------|
| `src/App.jsx` | Root — URL routing, nav callbacks, overlay stack |
| `src/App.css` | All styles — tokens, layout, components |
| `src/data/portfolio.js` | All content — grid structure, project data |
| `src/components/PageView.jsx` | Page overlay renderer (all content types) |
| `src/components/GridItem.jsx` | Individual grid card |
| `src/transitions.js` | Animation constants — `fadeUp` uses `custom` as stagger index (delay = custom × 0.05s + 0.14s) |
| `src/utils/asset.js` | Prepends BASE_URL to image paths |

## Architecture
- Root grid items order: `hero → projects → process → build → craft → contact`
- `projects` is a nested grid with 6 project pages (`tone: 'base'`)
- Path `['projects', 'project-account-iq']` → overlayStack: [projects grid, account-iq page]
- `navigateTo` appends to path; `navigateReplace` replaces last segment (prev/next project nav)
- Page overlays use `card-{tone}` CSS class → project pages have `background: var(--surface-1)`
- Every `page` node's `content.type` (`hero`, `about`, `project`, `process`, `contact`, `craft`, `image`, `comparison`) selects which sub-component `PageView.jsx` renders (`HeroContent`, `AboutContent`, `ProjectContent`, etc.) — adding a new content shape means adding both the data and a matching branch/component in `PageView.jsx`
- Lightboxes (single image and before/after comparison) are synthetic `page` nodes built on the fly in `App.jsx` (`openLightbox` / `openComparisonLightbox`), not part of `portfolio.js`
- Within a project's `content.sections`, section `type: 'video'` accepts an optional `aspectRatio` (e.g. `'330/240'`) for embeds that aren't 16:9 — drives `.section-video-wrap`'s CSS `aspect-ratio`, defaults to `16/9`. `type: 'columns'` renders a 3-col desktop / 1-col mobile grid of heading+body+image cards (see Lighthouse's "Be Transparent/Effective/Delightful").
- The `/hero` page is an interactive resume globe, rendered by `ResumeGlobe.jsx`. Its copy, dates, locations, and coordinates live in `portfolioData.hero.content.journey`; keep factual edits in the data file rather than the renderer. Journey tags are intentionally not rendered.
- `ResumeGlobe` uses `d3-geo`, `topojson-client`, and the local `world-atlas` package. It draws a high-DPI canvas, supports light/dark themes, and scrolls through Beijing → Ann Arbor → Los Angeles → Sunnyvale (LBP) → Sunnyvale (LSS) → Santa Clara. The intro has no location marker; the final Santa Clara scene has a single pulsing marker and no outgoing route.
- On desktop, resume copy stays left and the globe stays sticky on the right. At ≤768px the viewport is split 50/50: scrollable copy above, large globe below, with no content/globe overlap.
- Hero scrolling is native browser scrolling with CSS `scroll-snap-type: y mandatory`; do not reintroduce global wheel thresholds, gesture locks, or fixed JavaScript scene jumps. On mobile, gestures beginning over the globe are forwarded continuously to the copy scroller, then settle to the nearest scene.

## Motion and media behavior
- Project image carousels and their Lightbox views share `useSwipeNavigation` in `PageView.jsx`.
- Carousel navigation is a three-panel, full-width track: at rest only the current image is visible; while dragging, the previous/next image follows the pointer into view. Arrow clicks use the exact same transition as swipe completion.
- Animate the track only with native WAAPI `transform: translate3d(...)` — never animate image width, height, or opacity. A completed transition travels exactly one track width, uses the `cubic-bezier(0.32, 0.72, 0, 1)` curve, and caps at 280ms. Reset the physical track before the `flushSync` index update; stable offset keys and eager adjacent-image decoding prevent a visible bounce, white flash, or black frame.
- Lightbox distance must be measured from `.lightbox-swipe-track`, not the padded `.img-page-scroll` container. Inline distance likewise comes from `.carousel-swipe-track`.
- Swipe activation uses either a 50px distance or a fast gesture of at least 28px / 400px/s. Insufficient gestures ease back without bounce. `touch-action: pan-y` preserves vertical page scrolling.
- Craft GIF thumbnails render as real `<img>` elements, not CSS backgrounds, so they animate reliably on mobile. Adjacent carousel assets are preloaded in memory.
- Lightbox swipe handlers live on `.lightbox-swipe-track`; all Lightbox image elements fill one fixed-height contain-fit stage so mixed source aspect ratios do not resize the viewer.

## Current project status — 2026-09-12
- Hero résumé globe is responsive, theme-aware, high-DPI, native-scroll snapped, and uses body typography for descriptions with no journey tags.
- Project typography is unified: project title → H2 → H3 → 16px body; project body variants use `var(--ink-muted)` consistently.
- Project preview cards use a progressive 1px backdrop blur plus a bottom vignette. Project detail hero images use a progressive 3px backdrop blur plus a broader vignette. Media text uses high-contrast white without text shadows in both themes.
- Inline carousels and Lightboxes support swipe and arrow navigation with the same transform-only animation; Lightbox image height is stable.

## Icons & illustrations
- Root grid tiles get a theme-adaptive SVG via `item.illustration` (key into `ILLUSTRATIONS` map in `GridItem.jsx`) — these are React components with `fill="var(--ink)"`/`var(--surface-1)"` so they recolor automatically per theme.
- The hero tile additionally has `item.portrait`, a plain static SVG path (not a token-recolored component) rendered as `<img className="grid-item-portrait">`, bottom-right anchored and clipped by the tile's `overflow: hidden`. Used for genuinely multi-tone/shaded artwork where flattening to 2 tokens would destroy the shading — don't reuse this pattern for simple icons, use `illustration` for those.

## Images
All project/craft images are in `public/images/`. Referenced via `asset()` helper. Keep production media local; do not introduce Webflow CDN dependencies.
Hero images live at `public/images/projects/*-hero.{jpg,png}`.
