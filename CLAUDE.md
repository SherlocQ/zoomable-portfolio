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

## Icons & illustrations
- Root grid tiles get a theme-adaptive SVG via `item.illustration` (key into `ILLUSTRATIONS` map in `GridItem.jsx`) — these are React components with `fill="var(--ink)"`/`var(--surface-1)"` so they recolor automatically per theme.
- The hero tile additionally has `item.portrait`, a plain static SVG path (not a token-recolored component) rendered as `<img className="grid-item-portrait">`, bottom-right anchored and clipped by the tile's `overflow: hidden`. Used for genuinely multi-tone/shaded artwork where flattening to 2 tokens would destroy the shading — don't reuse this pattern for simple icons, use `illustration` for those.

## Images
All project/craft images are in `public/images/`. Referenced via `asset()` helper.
Hero images live at `public/images/projects/*-hero.{jpg,png}`.
