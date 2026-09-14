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
- Within a project's `content.sections`, section `type: 'video'` accepts an optional `aspectRatio` (e.g. `'330/240'`) for embeds that aren't 16:9 — drives `.section-video-wrap`'s CSS `aspect-ratio`, defaults to `16/9`. `type: 'columns'` renders a 3-col desktop / 1-col mobile grid of heading+body+image cards (see Lighthouse's "Be Transparent/Effective/Delightful"). `type: 'design-goal'` renders the reusable neutral goal card with an eyebrow label, optional local image, and preserved Lightbox behavior.
- `BodyText` converts bullet-shaped and numbered source blocks into semantic `<ul>` / `<ol>` markup. Project headings and both desktop/mobile table-of-contents labels share `sentenceCaseHeading()`; preserve registered product names, personal names, and acronyms in its canonical-term map.
- Project table-of-contents behavior is responsive. Desktop uses a fixed right-center line menu that remains hidden over the hero and appears when project content reaches the scroll viewport. Mobile uses a full-width top-sticky glass dropdown placed after the hero; a zero-height sentinel triggers its slide/fade entrance only when the dropdown's natural position reaches the top. Keep the dropdown inert while hidden, open its list downward, and derive its breakout width from `--page-inline-gutter` rather than a hardcoded breakpoint value.
- The `/hero` page is an interactive resume globe, rendered by `ResumeGlobe.jsx`. Its copy, dates, locations, and coordinates live in `portfolioData.hero.content.journey`; keep factual edits in the data file rather than the renderer. Journey tags are intentionally not rendered.
- `ResumeGlobe` uses `d3-geo`, `topojson-client`, and the local `world-atlas` package. It draws a high-DPI canvas, supports light/dark themes, and scrolls through Beijing → Ann Arbor → Los Angeles → Sunnyvale (LBP) → Sunnyvale (LSS) → Santa Clara. The intro has no location marker; the final Santa Clara scene has a single pulsing marker and no outgoing route.
- On desktop, resume copy stays left and the globe stays sticky on the right. At ≤768px the viewport is split 50/50: scrollable copy above, large globe below, with no content/globe overlap.
- Hero wheel input is directional pagination with no distance threshold: the first vertical delta of a wheel/trackpad gesture immediately starts one 480–640ms smoothstep animation to the adjacent scene, and the remaining momentum events in that gesture are consumed so they cannot create a second correction. The curve must accelerate gently and decelerate through the final pixel—do not replace it with an aggressive ease-out. Touch remains directly draggable and completes to the adjacent scene on release. Do not restore CSS scroll snap or prepend a native free-scroll phase; both reintroduce the visible end jump.

## Motion and media behavior
- Project image carousels and their Lightbox views share `useSwipeNavigation` in `PageView.jsx`.
- Carousel navigation is a three-panel, full-width track: at rest only the current image is visible; while dragging, the previous/next image follows the pointer into view. Arrow clicks use the exact same transition as swipe completion.
- Inline carousel images use `object-fit: contain` inside the responsive fixed-ratio stage. The stage background is transparent so unused space exactly matches the current page surface in either theme; do not restore `cover`, which clips UI content after viewport resize.
- Animate the track only with native WAAPI `transform: translate3d(...)` — never animate image width, height, or opacity. A completed transition travels exactly one track width, uses the `cubic-bezier(0.32, 0.72, 0, 1)` curve, and caps at 280ms. Reset the physical track before the `flushSync` index update; stable offset keys and eager adjacent-image decoding prevent a visible bounce, white flash, or black frame.
- Lightbox distance must be measured from `.lightbox-swipe-track`, not the padded `.img-page-scroll` container. Inline distance likewise comes from `.carousel-swipe-track`.
- Swipe activation uses either a 50px distance or a fast gesture of at least 28px / 400px/s. Insufficient gestures ease back without bounce. `touch-action: pan-y` preserves vertical page scrolling.
- Craft GIF thumbnails render as real `<img>` elements, not CSS backgrounds, so they animate reliably on mobile. Adjacent carousel assets are preloaded in memory.
- Craft entry covers use `cover`, while individual Motion & Animation and Print & Visual artwork uses intrinsic-ratio `contain` thumbnails so the complete work remains visible. Every Craft item retains its Webflow source-of-truth backdrop (`bg` / `bgImage`) in the image page; thumbnail-only corrections use `previewBg` and must never alter the Lightbox backdrop. Bifold Design uses `#d0d0d0` and Signing Wall uses `#f2f2f2` only at thumbnail size to blend their neutral image edges.
- Craft cards share the Projects bottom-vignette geometry and white label treatment. Fine-detail GIF/print thumbnails intentionally omit the progressive backdrop blur so raster lines remain crisp; project previews retain the 1px progressive blur. Data Visualization uses the standard project-card treatment at entry and the standard 2px progressive-blur project hero in its detail page.
- Lightbox swipe handlers live on `.lightbox-swipe-track`. `ResizeObserver` plus the active image's natural dimensions select one of two automatic layouts: viewport-fit images use a centered contain stage; width-fit images taller than the available viewport use `.img-page-scroll--long` with a natural vertical scroll region. Initial and slide-change measurement runs in `useLayoutEffect` before paint to prevent a one-frame fit-to-long jump; remeasure on resize and reset a new slide to the top.
- Lightbox open/close uses a 560ms Framer Motion shared `layoutId` transition with the standard `EASE` curve between the clicked inline image/carousel/comparison stage and its Lightbox frame; the overlay separately fades over 380ms. Fit images dismiss on vertical input. Long images consume vertical input until their top/bottom, then require 28px outward overscroll before dismissal and handoff to the stable underlying `.page-body`. Wheel deltas are coalesced once per animation frame; touch direction uses a 10px dead zone and 1.25× axis lock; horizontal gestures continue to drive image swipe navigation. Close, Escape, and genuine backdrop clicks always dismiss.
- Keep media opacity independent from the scrim: `.lightbox-scrim` fades, while shared media pairs use `layoutCrossfade={false}` and the Lightbox shell/image stays opaque until the final exit frame. Shared geometry belongs on the visible `motion.img` for project singles, galleries, GIF craft tiles, and active carousel slides (`item-img-*` / `carousel-img-*`), never on a card wrapper, `.img-carousel-stage`, track, caption, or controls. Source media must use an intrinsic-ratio layout box (`width/height: auto`, constrained by `max-width/max-height`) rather than a stage-sized `100% × 100%` object-fit box; otherwise Framer interpolates unequal width and height scales and visibly stretches the image open.
- Local project Lottie files live under `public/animations/projects/` and render through `lottie-web`. Related Lighthouse pain-point illustrations share a consistent responsive stage height and replay according to viewport presence.

## Current project status — 2026-09-13
- Hero résumé globe is responsive, theme-aware, high-DPI, natively scrollable with one custom smooth settle, and uses body typography for descriptions with no journey tags.
- Project-detail reading follows a Linear Docs rhythm: a centered 700px prose column, 24px H2, 20px H3, 16px/24px body, 56px chapter spacing, semantic lists, and sentence-case headings/TOC labels. Desktop navigation is a compact right-edge line menu; mobile navigation is a viewport-width sticky glass dropdown that appears only after the hero.
- Message bubbles, metrics, insight/highlight cards, and design-goal cards share a neutral `surface-3` shell with a subtle hairline border and 16px radius. Message bubbles remain content-hugging, alternate sides, and reversibly fade/slide with viewport entry.
- Academy, Lighthouse, and LinkedIn Design Challenge use the reusable `design-goal` component. Account IQ outcomes use semantic bullets and restored external media-coverage links.
- Project preview cards use a progressive 1px backdrop blur plus a bottom vignette. Project detail hero images use a shorter progressive 2px blur that clears by 48% of image height plus a broader vignette. Media text uses high-contrast white without text shadows in both themes.
- Craft media is fully local and matches the mirrored Webflow originals. Motion & Animation and Print & Visual entry covers fill their cards; child artwork remains uncropped, uses the original per-item background in image view, and zooms with an intrinsic-ratio shared transition. Craft thumbnails use the shared vignette without blur for maximum sharpness.
- Inline carousels and Lightboxes support swipe and arrow navigation with the same transform-only animation. Lightboxes automatically preserve viewport-fit media or give long images a readable width-fit scrolling canvas.
- Image Lightboxes open and close with a Linear Docs-style shared-position zoom. Fit media scroll-dismisses immediately; long media scrolls internally and dismisses only after outward boundary intent, then returns directly to the project reading flow.
- Theme defaults to live browser/system `prefers-color-scheme` with a pre-React no-flash bootstrap. Only explicit light/dark selections persist under `theme-preference`; browser `color-scheme` and `theme-color` stay synchronized.

## Icons & illustrations
- Root grid tiles get a theme-adaptive SVG via `item.illustration` (key into `ILLUSTRATIONS` map in `GridItem.jsx`) — these are React components with `fill="var(--ink)"`/`var(--surface-1)"` so they recolor automatically per theme.
- The hero tile additionally has `item.portrait`, a plain static SVG path (not a token-recolored component) rendered as `<img className="grid-item-portrait">`, bottom-right anchored and clipped by the tile's `overflow: hidden`. Used for genuinely multi-tone/shaded artwork where flattening to 2 tokens would destroy the shading — don't reuse this pattern for simple icons, use `illustration` for those.

## Images
All project/craft images are in `public/images/`. Referenced via `asset()` helper. Keep production media local; do not introduce Webflow CDN dependencies.
Hero images live at `public/images/projects/*-hero.{jpg,png}`.
