# Zoomable Portfolio — Project Handoff and Agent Instructions

## What this is
Chengchang Qian's personal design portfolio. React + Vite, Framer Motion, GitHub Pages.
URL: https://sherlocq.github.io/zoomable-portfolio/

## Commands
```
npm run dev -- --port 5174  # preferred local URL: http://127.0.0.1:5174/
npm run build    # production build → dist/
npm run lint     # eslint .
npm run preview  # preview the production build locally
```
There is no `deploy` script and no test suite. Deployment is automatic: pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages. **Never push to `main`** unless the user explicitly says so.

## Standing instructions
- **Never push to `main`** (which triggers deployment) unless the user explicitly says so
- Whenever the user explicitly asks to **push GitHub**, update both `CLAUDE.md` and `DESIGN.md` first with the durable decisions and current project progress from that work, then build, commit, and push
- Do not add or replace Build/Vibe projects unless the user explicitly asks. Several entries are intentional placeholders; preserve them rather than inferring content.
- Always use exact Linear design tokens — see `DESIGN.md` for the full system
- At the start of a new task, run `git status --short` and preserve all existing user changes. Do not stage unrelated files.

## Content source of truth
- Direct corrections and approved wording from the user have highest priority.
- For employment history, titles, dates, and team context, use Chengchang's LinkedIn experience as the primary external source. The longer biography supplied during the Hero discussion is supporting context and explicitly has lower priority than LinkedIn.
- `public/resume.pdf` is the local résumé reference. The approved Hero intro and journey copy in `src/data/portfolio.js` are the current on-site source of truth unless the user asks to revise them.
- For legacy project case-study copy, illustrations, and Craft media, use the complete Webflow archive at `../site-mirror/chengchangqian.webflow.io/`. Match its wording and assets; do not silently AI-summarize, rewrite, or fabricate project facts. The user may explicitly approve targeted simplification, such as the condensed Annie prototype narrative in LinkedIn Design Challenge.
- Account IQ is a LinkedIn Sales Solutions project, not a separate employer. LinkedIn Business Platform (LBP) and LinkedIn Sales Solutions (LSS) both belong to the 2020–2024 LinkedIn period. The current role is ServiceNow in Santa Clara from 2024–present.
- Projects omitted from the new site may be intentionally hidden. Projects present only on the new site may be planned future work. Never add/remove projects merely to force parity with the mirror.
- All production assets must remain local. Do not introduce Webflow CDN dependencies.

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
| `src/components/ResumeGlobe.jsx` | Responsive canvas globe, journey state, routes, and native scroll coordination |
| `src/components/ScrollCue.jsx` | Shared animated scroll indicator for Hero and project heroes |
| `src/transitions.js` | Animation constants — `fadeUp` uses `custom` as stagger index (delay = custom × 0.05s + 0.14s) |
| `src/utils/asset.js` | Prepends BASE_URL to image paths |
| `DESIGN.md` | Canonical design tokens, responsive rules, component behavior, and interaction decisions |
| `../site-mirror/chengchangqian.webflow.io/` | Read-only legacy Webflow source for project copy and original media |

## Architecture
- Root grid items order: `hero → projects → process → build → craft → contact`
- `projects` is a nested grid with 8 project pages: AI-Native Vision, Account IQ, Configurable checkout, LinkedIn Design Challenge, Scenario Listing, Lighthouse, Dream Hatcher, and Neustar Academy (`tone: 'base'`). Account IQ and Configurable checkout are adjacent 1×1 cards, and that order also drives previous/next navigation.
- Path `['projects', 'project-account-iq']` → overlayStack: [projects grid, account-iq page]
- `navigateTo` appends to path; `navigateReplace` replaces last segment (prev/next project nav)
- Page overlays use `card-{tone}` CSS class → project pages have `background: var(--surface-1)`
- Every `page` node's `content.type` (`hero`, `about`, `project`, `process`, `contact`, `craft`, `image`, `comparison`) selects which sub-component `PageView.jsx` renders (`HeroContent`, `AboutContent`, `ProjectContent`, etc.) — adding a new content shape means adding both the data and a matching branch/component in `PageView.jsx`
- Lightboxes (single image and before/after comparison) are synthetic `page` nodes built on the fly in `App.jsx` (`openLightbox` / `openComparisonLightbox`), not part of `portfolio.js`
- Within a project's `content.sections`, section `type: 'video'` accepts an optional `aspectRatio` (e.g. `'330/240'`) for embeds that aren't 16:9 — drives `.section-video-wrap`'s CSS `aspect-ratio`, defaults to `16/9`. `type: 'columns'` renders a 3-col desktop / 1-col mobile grid of heading+body+image cards (see Lighthouse's "Be Transparent/Effective/Delightful"). `type: 'design-goal'` renders the reusable neutral goal card with an eyebrow label, optional local image, and preserved Lightbox behavior.
- `type: 'case-study'` renders the centered protected-work card used by Account IQ and Configurable checkout. It contains an external Figma CTA, a compact Figma mark, pointer-follow tilt/glare, and a reduced-motion fallback. The public site never stores or validates an NDA password; Figma owns the password gate after the visitor opens the presentation.
- `BodyText` converts bullet-shaped and numbered source blocks into semantic `<ul>` / `<ol>` markup. Project headings and both desktop/mobile table-of-contents labels share `sentenceCaseHeading()`; preserve registered product names, personal names, and acronyms in its canonical-term map.
- Project table-of-contents behavior is responsive. Desktop uses a fixed right-center line menu that remains hidden over the hero and appears when project content reaches the scroll viewport. Mobile uses a full-width top-sticky glass dropdown placed after the hero; a zero-height sentinel triggers its slide/fade entrance only when the dropdown's natural position reaches the top. Keep the dropdown inert while hidden, open its list downward, and derive its breakout width from `--page-inline-gutter` rather than a hardcoded breakpoint value.
- The `/hero` page is an interactive resume globe, rendered by `ResumeGlobe.jsx`. Its copy, dates, locations, and coordinates live in `portfolioData.hero.content.journey`; keep factual edits in the data file rather than the renderer. Journey tags are intentionally not rendered.
- `ResumeGlobe` uses `d3-geo`, `topojson-client`, and the local `world-atlas` package. It draws a high-DPI canvas, supports light/dark themes, and scrolls through Beijing → Ann Arbor → Los Angeles → Sunnyvale (LBP) → Sunnyvale (LSS) → Santa Clara. The intro has no location marker; the final Santa Clara scene has a single pulsing marker and no outgoing route.
- On desktop, resume copy stays left and the globe stays sticky on the right. At ≤768px the viewport is split 50/50: scrollable copy above, large globe below, with no content/globe overlap.
- Hero uses native browser scrolling and momentum with scoped CSS scroll snap on the Hero page and its mobile copy panel. Scenes use `scroll-snap-align: start` and `scroll-snap-stop: normal`, allowing sustained input to continue across multiple scenes before settling naturally. Never globally intercept desktop wheel input, discard events during animation, or restore a JavaScript scene-pagination lock. On stacked layouts only, gestures beginning over the globe are forwarded to the sibling copy scroller so both halves remain interactive.
- Keep `.resume-step` snap geometry immutable across active states: no transform, size, padding, or position animation on the section itself. Its active transition is opacity-only so native snap never performs a second end-position correction.
- `ScrollCue.jsx` is the shared top-of-page scroll affordance for the Hero and every project-detail hero. It uses a compact 20×34px mouse outline and animated 3.5px dot. Both variants are viewport-centered with a 16px bottom inset; compensate for the About page's one-sided 48px/32px desktop/tablet gutter, reset to true 50% at the stacked breakpoint, and reserve 72px beneath mobile project hero metadata. Normal surfaces use `--scroll-cue-color` (`ink-tertiary`) so light/dark modes adapt automatically; image heroes use muted `--scroll-cue-media-color`, which stays subordinate to white hero text. Both instances are visible only while their own native scroll container is at `scrollTop <= 2`; do not restore the former `Scroll to explore` label/arrow or leave the cue visible after scrolling.

## Motion and media behavior
- Project image carousels and their Lightbox views share `useSwipeNavigation` in `PageView.jsx`.
- Carousel navigation is a three-panel, full-width track: at rest only the current image is visible; while dragging, the previous/next image follows the pointer into view. Arrow clicks use the exact same transition as swipe completion.
- Inline carousel images use `object-fit: contain` inside the responsive fixed-ratio stage. The stage background is transparent so unused space exactly matches the current page surface in either theme; do not restore `cover`, which clips UI content after viewport resize.
- Animate the track only with native WAAPI `transform: translate3d(...)` — never animate image width, height, or opacity. A completed transition travels exactly one track width, uses the `cubic-bezier(0.32, 0.72, 0, 1)` curve, and caps at 280ms. Reset the physical track before the `flushSync` index update; stable offset keys and eager adjacent-image decoding prevent a visible bounce, white flash, or black frame.
- Lightbox distance must be measured from `.lightbox-swipe-track`, not the padded `.img-page-scroll` container. Inline distance likewise comes from `.carousel-swipe-track`.
- Swipe activation uses either a 50px distance or a fast gesture of at least 28px / 400px/s. Insufficient gestures ease back without bounce. `touch-action: pan-y` preserves vertical page scrolling.
- Craft GIF thumbnails render as real `<img>` elements, not CSS backgrounds, so they animate reliably on mobile. Adjacent carousel assets are preloaded in memory.
- Craft entry covers use `cover`, while individual Motion & Animation and Print & Visual artwork uses intrinsic-ratio `contain` thumbnails so the complete work remains visible. Every Craft item retains its Webflow source-of-truth backdrop (`bg` / `bgImage`) in the image page; thumbnail-only corrections use `previewBg` and must never alter the Lightbox backdrop. Bifold Design uses `#d0d0d0` and Signing Wall uses `#f2f2f2` only at thumbnail size to blend their neutral image edges.
- Craft entry cards and all Motion & Animation / Print & Visual child cards share the Projects compact vignette and lower-34% blur geometry. Static media uses the same four independent image bands (0.35–2.5px). Animated GIF cards use one 2.5px masked backdrop blur instead of four duplicate GIF layers and load lazily, preserving the visual treatment without multiplying mobile Safari decoding cost. Project heroes use six independent image bands (0.35–5px) in the lower 24%. Data Visualization uses the same project-card and project-hero treatment.
- Lightbox swipe handlers live on `.lightbox-swipe-track`. `ResizeObserver` plus the active image's natural dimensions select one of two automatic layouts: viewport-fit images use a centered contain stage; width-fit images taller than the available viewport use `.img-page-scroll--long` with a natural vertical scroll region. Initial and slide-change measurement runs in `useLayoutEffect` before paint to prevent a one-frame fit-to-long jump; remeasure on resize and reset a new slide to the top.
- Lightbox open/close uses a 560ms Framer Motion shared `layoutId` transition with the standard `EASE` curve between the clicked inline image/carousel/comparison stage and its Lightbox frame; the overlay separately fades over 380ms. Vertical wheel, trackpad, and touch input never dismisses or zooms out a Lightbox. Fit media stays stationary, while long media scrolls natively inside the Lightbox and remains open at its boundaries. Horizontal gestures continue to drive image swipe navigation. Close, Escape, and genuine backdrop clicks dismiss.
- Keep media opacity independent from the scrim: `.lightbox-scrim` fades, while shared media pairs use `layoutCrossfade={false}` and the Lightbox shell/image stays opaque until the final exit frame. Shared geometry belongs on the visible `motion.img` for project singles, galleries, GIF craft tiles, and active carousel slides (`item-img-*` / `carousel-img-*`), never on a card wrapper, `.img-carousel-stage`, track, caption, or controls. Source media must use an intrinsic-ratio layout box (`width/height: auto`, constrained by `max-width/max-height`) rather than a stage-sized `100% × 100%` object-fit box; otherwise Framer interpolates unequal width and height scales and visibly stretches the image open.
- Lightbox footer copy, the previous-carousel control, and the mirrored next/dismiss controls share `--lightbox-chrome-inset: 16px` at every breakpoint; do not reintroduce separate desktop/mobile edge values.
- Project and Craft image Lightbox footers use the same Framer Motion entrance/exit: `opacity 0 → 1` with `y: 10 → 0` on open and the reverse on close. Footer motion is independent from the shared media zoom and must not also receive the CSS `lightbox-chrome-in` animation; reduced-motion mode removes translation.
- Local project Lottie files live under `public/animations/projects/` and render through `lottie-web`. Related Lighthouse pain-point illustrations share a consistent responsive stage height and replay according to viewport presence.
- Across every project `metrics` section, labels use concise sentence-case noun phrases that name the measure directly. Do not use sentence-like labels ending in “is,” “reached,” or “spend,” and do not alter the underlying value or unit merely to restyle its label.

## Current project status — 2026-09-15
- Hero résumé globe is responsive, theme-aware, high-DPI, and uses native browser scrolling with scoped CSS snap—there is no JavaScript smooth-settle pagination. Descriptions use body typography and journey tags remain hidden.
- The old Scroll World / Higgsfield direction has been abandoned. Its generated previews, prompts, code references, and `public/images/scroll-world/` directory were removed. Do not recreate them unless the user explicitly changes direction; the current globe résumé is the approved replacement.
- Hero and all project heroes use the shared 20×34px tertiary `ScrollCue`: visual-viewport centered, 16px from the relevant bottom edge, hidden after leaving scroll top, restored at top, and responsive across the 50/50 mobile Hero layout.
- Project-detail reading follows a Linear Docs rhythm: a centered 700px prose column, 24px H2, 20px H3, 16px/24px body, 56px chapter spacing, semantic lists, and sentence-case headings/TOC labels. Desktop navigation is a compact right-edge line menu; mobile navigation is a viewport-width sticky glass dropdown that appears only after the hero.
- Message bubbles, metrics, insight/highlight cards, and design-goal cards share a neutral `surface-3` shell with a subtle hairline border and 16px radius. Message bubbles remain content-hugging, alternate sides, and reversibly fade/slide with viewport entry.
- Academy, Lighthouse, and LinkedIn Design Challenge use the reusable `design-goal` component. Account IQ outcomes use semantic bullets and restored external media-coverage links.
- Every metrics card label is a concise sentence-case noun phrase. Compact units remain forms such as `11m 34s` and `9m 4d`. The LinkedIn Design Challenge Annie prototype story is intentionally condensed to three paragraphs while preserving her goal, topic discovery, anonymous Figma question, connections, and professional-profile outcome.
- Project media uses Frostline-inspired independently masked copies of the source image rather than stacked `backdrop-filter` layers. This prevents each band from re-blurring the previous result. Preview cards use four bands in the lower 34% with a compact vignette clearing by 72%; detail heroes use six bands in the lower 24% with a vignette clearing by 66%. Blur and vignette remain independent: blur removes detail while the dark media scrim guarantees high-contrast white text without shadows in both themes.
- Hero base media and progressive-blur copies share one opacity entrance container and exact image geometry. Do not give the blur layer its own delayed fade or overscan/scale, which causes late appearance and doubled details at mask boundaries.
- Craft media is fully local and matches the mirrored Webflow originals. Motion & Animation and Print & Visual entry covers fill their cards; child artwork remains uncropped, uses the original per-item background in image view, and zooms with an intrinsic-ratio shared transition. Craft thumbnails use the shared Projects vignette and blur treatment, with a single masked backdrop blur reserved for animated GIFs.
- Inline carousels and Lightboxes support swipe and arrow navigation with the same transform-only animation. Lightboxes automatically preserve viewport-fit media or give long images a readable width-fit scrolling canvas.
- Image Lightboxes open and close with a Linear Docs-style shared-position zoom. Scrolling never closes them: fit media stays stationary and long media scrolls internally without boundary dismissal.
- Theme defaults to live browser/system `prefers-color-scheme` with a pre-React no-flash bootstrap. Only explicit light/dark selections persist under `theme-preference`; browser `color-scheme` and `theme-color` stay synchronized.
- Account IQ and Configurable checkout now expose only a public overview, contribution summary, and centered `Full case study` CTA before handing off to their password-protected Figma presentations. Configurable checkout uses the local `public/images/projects/configurable-checkout-hero.png` cover, the approved tagline “Design vision and strategy to unify LinkedIn's checkout experience,” and the approved role “Lead designer” (May–Aug. 2023; 1 designer and 1 researcher).
- In both confidential `Full case study` cards, only the words “contact me” are a styled `mailto:` link to `chengchangqian@gmail.com`; prefill the subject exactly as “Request case study access.” Keep the Figma CTA separate below it.
- The Contact page uses `assets/contact-envelope-paper-airplane.svg`. It has no eyebrow, uses only the short invitation sentence, and inverts in dark mode so its black/white Ink treatment matches the theme-aware homepage illustrations. Its heading uses the Hero display treatment at 36–48px desktop and 30–40px mobile. Desktop places the 170px image above the copy and translates it 16% left to compensate for built-in transparent space. At ≤640px, all text remains in the left grid column while the 130px image occupies the right column beginning on the description row, so its visible top aligns with “Whether you have a role…” rather than the title. Translate the image 6% upward to compensate for its transparent top margin. Text and email links may wrap but must never clip.

## Icons & illustrations
- Root grid tiles get a theme-adaptive SVG via `item.illustration` (key into `ILLUSTRATIONS` map in `GridItem.jsx`) — these are React components with `fill="var(--ink)"`/`var(--surface-1)"` so they recolor automatically per theme.
- The hero tile additionally has `item.portrait`, a plain static SVG path (not a token-recolored component) rendered as `<img className="grid-item-portrait">`, bottom-right anchored and clipped by the tile's `overflow: hidden`. Used for genuinely multi-tone/shaded artwork where flattening to 2 tokens would destroy the shading — don't reuse this pattern for simple icons, use `illustration` for those.

## Images
All project/craft images are in `public/images/`. Referenced via `asset()` helper. Keep production media local; do not introduce Webflow CDN dependencies.
Hero images live at `public/images/projects/*-hero.{jpg,png}`.

## New-chat handoff checklist
1. Read this file and the relevant component section in `DESIGN.md` before editing.
2. Run `git status --short`; assume any existing modification belongs to the user or a previous approved turn.
3. Inspect `src/data/portfolio.js` before changing copy, routes, project visibility, media paths, or résumé facts.
4. For legacy-content questions, compare against `../site-mirror/chengchangqian.webflow.io/`; for career facts, prefer LinkedIn/user corrections as described above.
5. Implement only the requested scope, then run `npx eslint src`, `npm run build`, and `git diff --check`.
6. Do not commit or push unless explicitly requested. On a push request, update both memory files, stage only intended files, commit, push `origin main`, and verify `git status --short` afterward.
