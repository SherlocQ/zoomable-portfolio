---
version: alpha
name: Linear-design-analysis
description: "A near-black product-focused marketing canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray text (#f7f8f8), and the signature Linear lavender-blue (#5e6ad2) used as the single chromatic accent. The system reads as software-craft documentation: dense, technical, and quietly luxurious. Display type is set in the Linear custom sans (SF Pro Display fallback) at 500–700 with measured negative tracking. Cards live as charcoal panels (#0f1011) with hairline borders. The accent lavender appears on the brand mark, focus rings, and a few intentional CTAs — never decoratively. Page rhythm leans on product UI screenshots framed in dark panels rather than atmospheric color."

colors:
  primary: "#5e6ad2"
  on-primary: "#ffffff"
  primary-hover: "#828fff"
  primary-focus: "#5e69d1"
  ink: "#f7f8f8"
  ink-muted: "#d0d6e0"
  ink-subtle: "#8a8f98"
  ink-tertiary: "#62666d"
  canvas: "#010102"
  surface-1: "#0f1011"
  surface-2: "#141516"
  surface-3: "#18191a"
  surface-4: "#191a1b"
  hairline: "#23252a"
  hairline-strong: "#34343a"
  hairline-tertiary: "#3e3e44"
  inverse-canvas: "#ffffff"
  inverse-surface-1: "#f5f6f6"
  inverse-surface-2: "#f6f7f7"
  inverse-ink: "#000000"
  brand-secure: "#7a7fad"
  semantic-success: "#27a644"
  semantic-overlay: "#000000"

typography:
  display-xl:
    fontFamily: Linear Display
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -3.0px
  display-lg:
    fontFamily: Linear Display
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1.8px
  display-md:
    fontFamily: Linear Display
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -1.0px
  headline:
    fontFamily: Linear Display
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.6px
  card-title:
    fontFamily: Linear Display
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.4px
  subhead:
    fontFamily: Linear Display
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: -0.2px
  body-lg:
    fontFamily: Linear Text
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.1px
  body:
    fontFamily: Linear Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: -0.05px
  body-sm:
    fontFamily: Linear Text
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0
  caption:
    fontFamily: Linear Text
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  button:
    fontFamily: Linear Text
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0
  eyebrow:
    fontFamily: Linear Text
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.4px
  mono:
    fontFamily: Linear Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-primary-pressed:
    backgroundColor: "{colors.primary-focus}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-tertiary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-inverse:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  project-case-study-card:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    borderColor: "{colors.hairline}"
    padding: 48px 32px
  pricing-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  pricing-card-featured:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  feature-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  product-screenshot-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  testimonial-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: 32px
  customer-logo-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 16px
  text-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  text-input-focused:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  pricing-tab-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  pricing-tab-selected:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  cta-banner:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    padding: 48px
  changelog-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 24px 0
  status-badge:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xs}"
    height: 56px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
    padding: 64px 32px
---

## Overview

Linear's marketing canvas is the deepest dark surface in this collection — `{colors.canvas}` is #010102, essentially pure black with a faint blue tint. On top sits a four-step surface ladder (`{colors.surface-1}` through `{colors.surface-4}`) for cards, panels, and lifted tiles, with hairline borders running from `{colors.hairline}` (#23252a) up through `{colors.hairline-strong}` and `{colors.hairline-tertiary}`. Light gray text (`{colors.ink}` #f7f8f8) carries the body and headlines.

The single chromatic accent is **Linear lavender-blue** `{colors.primary}` (#5e6ad2) — used on the brand mark, focus rings, and the primary CTA button. A lighter hover state (`{colors.primary-hover}` #828fff) and a focus-tinted variant (`{colors.primary-focus}` #5e69d1) extend the same hue. Linear avoids saturated greens, oranges, reds, etc. on the marketing canvas — the only semantic color is `{colors.semantic-success}` (#27a644) for status pills and the rare success indicator.

Display type runs Linear's custom sans (with `SF Pro Display` fallback) at weight 500–700 with negative letter-spacing scaling from -3.0px at 80px down to 0 at body. The body family is Linear's text cut, and a Linear Mono is reserved for code snippets in product screenshots.

The page rhythm is **dense product screenshots** — Linear's marketing leads with high-fidelity captures of the product UI (issue list, project view, dashboard) framed in `{colors.surface-1}` panels with `{rounded.xl}` 16px corners. The chrome is intentionally minimal so the app screenshots can do the heavy lifting.

**Key Characteristics:**
- **Dark-canvas marketing system** — `{colors.canvas}` (#010102) is the deepest dark in this collection.
- **Lavender-blue brand accent** (`{colors.primary}` #5e6ad2) — used scarcely on brand mark, focus, and the primary CTA.
- Four-step surface ladder (canvas → surface-1 → surface-2 → surface-3 → surface-4) carries hierarchy without shadow.
- Display tracking pulls aggressively negative (-3.0px at 80px); body holds at -0.05px.
- Cards use `{rounded.lg}` 12px corners with 1px hairline borders — never pill, rarely 16px.
- **Product UI screenshots** dominate the page. The marketing chrome is a dark frame for the app.
- No second chromatic color. No atmospheric gradients. No spotlight cards.

## Colors

> Source pages: linear.app (home), /intake, /pricing, /contact/sales, /build.

### Brand & Accent
- **Lavender-Blue** ({colors.primary}): The signature Linear accent — primary CTA, brand mark, link emphasis.
- **Lavender Hover** ({colors.primary-hover}): Lighter lavender (#828fff) — hovered state of the primary CTA.
- **Lavender Focus** ({colors.primary-focus}): Focus-ring tint (#5e69d1) — focused inputs, focused buttons.
- **Brand Secure** ({colors.brand-secure}): Muted lavender-gray (#7a7fad) — used in "Linear Security" surfaces.

### Surface
- **Canvas** ({colors.canvas}): Default page background — #010102, near-pure black with a faint blue tint.
- **Surface 1** ({colors.surface-1}): One step above canvas — feature cards, pricing cards, product screenshot panels.
- **Surface 2** ({colors.surface-2}): Two steps above — featured pricing card, hovered cards.
- **Surface 3** ({colors.surface-3}): Three steps above — line-tertiary backgrounds, sub-nav.
- **Surface 4** ({colors.surface-4}): Four steps above — bg-level-3, deepest lifted surface.
- **Hairline** ({colors.hairline}): 1px borders on cards and dividers.
- **Hairline Strong** ({colors.hairline-strong}): Stronger 1px borders — input focus rings.
- **Hairline Tertiary** ({colors.hairline-tertiary}): Tertiary borders for nested surfaces.
- **Inverse Canvas** ({colors.inverse-canvas}): Pure white — surface of the inverse pill CTA on a small set of section openers.
- **Inverse Surface 1** ({colors.inverse-surface-1}): One step above inverse canvas.
- **Inverse Surface 2** ({colors.inverse-surface-2}): Two steps above inverse canvas.

### Text
- **Ink** ({colors.ink}): All headlines and emphasized body type — light gray #f7f8f8.
- **Ink Muted** ({colors.ink-muted}): Secondary type at #d0d6e0 — meta info on hero panels.
- **Ink Subtle** ({colors.ink-subtle}): Tertiary type at #8a8f98 — deselected pricing tabs, footer columns.
- **Ink Tertiary** ({colors.ink-tertiary}): Quaternary at #62666d — disabled, footnotes.

### Semantic
- **Success Green** ({colors.semantic-success}): Status pills, success indicators. The only semantic color on marketing.
- **Overlay** ({colors.semantic-overlay}): Pure black overlay scrim for modals.

## Typography

### Font Family

- **Linear Display** — Linear's custom display sans; fallback `SF Pro Display, -apple-system, system-ui, Segoe UI, Roboto`. Carries display-xl through subhead.
- **Linear Text** — Linear's custom text sans (a slightly different cut tuned for body sizes); same fallback stack. Carries body sizes, button labels, captions.
- **Linear Mono** — Linear's custom mono; fallback `ui-monospace, SF Mono, Menlo`. Used for code snippets in product screenshots and for status / ID tokens.

The marketing surface treats Display and Text as one continuous voice; the family change is silent.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 600 | 1.05 | -3.0px | Largest hero headline |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.8px | Section opener headlines |
| `{typography.display-md}` | 40px | 600 | 1.15 | -1.0px | Sub-section headlines |
| `{typography.headline}` | 28px | 600 | 1.20 | -0.6px | Pricing tier titles, CTA banner heading |
| `{typography.card-title}` | 22px | 500 | 1.25 | -0.4px | Feature card title |
| `{typography.subhead}` | 20px | 400 | 1.40 | -0.2px | Lead body, intro paragraphs |
| `{typography.body-lg}` | 18px | 400 | 1.50 | -0.1px | Hero subhead, lead paragraphs |
| `{typography.body}` | 16px | 400 | 1.50 | -0.05px | Default body |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Card body, footer columns |
| `{typography.caption}` | 12px | 400 | 1.40 | 0 | Captions, meta, status |
| `{typography.button}` | 14px | 500 | 1.20 | 0 | All button labels |
| `{typography.eyebrow}` | 13px | 500 | 1.30 | 0.4px | Section eyebrow (slight positive tracking) |
| `{typography.mono}` | 13px | 400 | 1.50 | 0 | Linear Mono for code in product screenshots |

### Principles

- **Aggressive negative tracking on display** (-3.0px at 80px ≈ 4% of size).
- **Single voice from display to body.** Display-xl at 600 → body at 400 — same family, narrower weights.
- **Eyebrow uses positive tracking** (+0.4px) — contrast against the negative-tracked display marks the eyebrow as taxonomy.
- **Mono only in code contexts.** Linear Mono lives inside product screenshots — not on marketing chrome.
- **Project hierarchy is fixed.** Project title uses 32–40px display type, H2 uses 24px, H3 uses 20px, and all project body/list/after-copy variants use `{typography.body}` with `{colors.ink-muted}`. On mobile, project titles scale to 28–32px and lead copy scales to 16px.
- **Documentation reading hierarchy.** Project-detail prose follows the measured rhythm of Linear Docs: H2 is 24px/32px at weight 590 with -0.012em tracking; H3 is 20px/28px at weight 590 with only slight negative tracking; body and list copy remain 16px/24px at weight 400. Headings use `{colors.ink}` and supporting copy uses `{colors.ink-muted}`.
- **Project headings use sentence case.** Apply sentence case consistently to project H1, H2, H3, desktop on-page navigation, and the mobile section selector. Preserve canonical acronyms and product names such as AI, GAI, HCI, UX, UI, MMM, MTA, B2B, Account IQ, LinkedIn, ServiceNow, Neustar, Figma, and FigJam. Display casing must not change the underlying section string or anchor ID.

### Note on Font Substitutes

Linear's custom typeface isn't publicly distributed; the documented fallback `SF Pro Display, -apple-system, system-ui` is the recommended substitute on macOS. For cross-platform implementation, **Inter** at weight 500 / 600 / 700 is the closest free substitute. **Geist Sans** is also viable. For mono, **JetBrains Mono** or **Geist Mono** at weight 400 closely approximates Linear Mono.

## Layout

### Spacing System

- **Base unit**: 4px.
- **Tokens (front matter)**: `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- Card interior padding: `{spacing.lg}` 24px on feature/pricing cards; `{spacing.xl}` 32px on testimonial cards; `{spacing.xxl}` 48px on CTA banners.
- Pill button padding: 8px vertical · 14px horizontal — Linear's compact button spec.
- Form input padding: 8px vertical · 12px horizontal.

### Project Detail Reading Rhythm

- The primary reading column is centered and capped at 700px. Desktop on-page navigation floats at the right-center viewport edge, so it remains reachable without shifting or stretching the prose column.
- Chapter-level H2 sections begin after 56px of vertical separation. Related H3 subsections use a compact 40px section rhythm.
- H2-to-body spacing is 12px; H3-to-body spacing is 8px. Paragraphs are separated by 16px. Avoid adding blank spacer elements between prose blocks.
- Media follows the preceding copy through that copy's 16px bottom rhythm; captions sit 10px below media. Split-layout copy and media remain top-aligned.
- On mobile, the same hierarchy is preserved in one column; page gutters reduce to 18px and card padding reduces without changing the 16px body size.

### Prose Lists

- Render list-shaped source content as semantic `<ul>` or `<ol>` elements; never leave bullet or numbered content as a newline-filled paragraph.
- Unordered lists use a standard disc marker. Ordered lists use decimal markers with tabular numerals. Both use 24px visual indentation (ordered lists may reserve 28px for two-digit alignment), 4px marker-to-copy breathing room, and 8px between items.
- Lists use the same 16px/24px body typography and `{colors.ink-muted}` as paragraphs. Markers step down to `{colors.ink-tertiary}` so the copy remains dominant.
- Keep 16px between a list and the next prose block. The final item has no extra bottom margin; the list container owns the external spacing.
- Outcome statements that represent parallel evidence belong in a semantic list rather than separate oversized paragraphs. Keep the contextual setup and follow-up as prose around that list.
- External coverage or evidence links sit in a dedicated source row after the related prose: 16px top rule inset, 24px separation from the copy, a muted 13px label, and wrapping 14px underlined text links. Preserve the original destination URL and open external sources in a new tab.

### Grid & Container

- Max content width sits around 1280px.
- Card grids are 3-up at desktop, 2-up at tablet, 1-up at mobile.
- Pricing tier grid is 3-up; comparison strip below shows checkmarks per tier.
- Product screenshot panels span full content width — they're the protagonist.

### Whitespace Philosophy

The dark canvas IS the whitespace. Sections separate by lift onto surface-1 panels, not by gaps in white. Within a panel, generous `{spacing.lg}` 24px gaps between content blocks; `{spacing.section}` 96px between sections.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Default for body type, hero text, footer |
| 1 (charcoal lift) | `{colors.surface-1}` background on canvas, 1px `{colors.hairline}` | Default cards, product panels |
| 2 (surface-2 lift) | `{colors.surface-2}` background, 1px `{colors.hairline-strong}` | Featured pricing card, hovered cards |
| 3 (surface-3 lift) | `{colors.surface-3}` background | Sub-nav, dropdown menus |
| 4 (focus ring) | 2px `{colors.primary-focus}` outline at 50% opacity | Focused input, focused button |

Linear's depth is carried by surface ladder + hairline borders. The brand resists drop shadows on dark almost entirely.

### Decorative Depth

- **Product UI screenshots** dominate as decorative depth.
- **No atmospheric gradients, no spotlight cards.**
- **Subtle white edge highlight** on the top edge of lifted panels — gives the dark surface a faint "pixel rendered" feel.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Small chips, status badges |
| `{rounded.sm}` | 6px | Inline tags |
| `{rounded.md}` | 8px | All buttons, form inputs |
| `{rounded.lg}` | 12px | Pricing cards, feature cards, testimonial cards |
| `{rounded.xl}` | 16px | Product screenshot panels |
| `{rounded.xxl}` | 24px | Oversized CTA banners (rare) |
| `{rounded.pill}` | 9999px | Pricing tab toggles, status pills |
| `{rounded.full}` | 9999px | Avatar circles |

### Photography & Illustration Geometry

- Product UI screenshots dominate; they sit in `{rounded.xl}` 16px tiles with `{spacing.lg}` 24px outer padding.
- Customer logo tiles render at small sizes (~24px logo height) on `{colors.canvas}` with no border.
- Avatar circles in testimonial cards use `{rounded.full}` at 32–40px sizes.

## Components

### Buttons

**`button-primary`** — Lavender CTA. The default primary CTA across all pages.
- Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`.
- Pressed state lives in `button-primary-pressed` (background shifts to `{colors.primary-focus}`).
- Hover state lives in `button-primary-hover` (background shifts to `{colors.primary-hover}` lighter lavender).

**`button-secondary`** — Charcoal button. Used for secondary CTAs ("Sign in", "Read changelog").
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.button}`, padding 8px 14px, rounded `{rounded.md}`. 1px `{colors.hairline}` border.

**`button-tertiary`** — Plain text button.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 8px 14px.

**`button-inverse`** — White-on-dark inverse CTA.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.button}`, rounded `{rounded.md}`, padding 8px 14px.

### Pricing Tabs

**`pricing-tab-default`** + **`pricing-tab-selected`** — Pill-toggle on `/pricing`.
- Default: `{colors.canvas}` background, `{colors.ink-subtle}` text, rounded `{rounded.pill}`, padding 6px 14px.
- Selected: `{colors.surface-2}` background, `{colors.ink}` text — selected = surface lift.

### Cards & Containers

**`pricing-card`** — Each tier on `/pricing`.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px. 1px `{colors.hairline}` border.

**`pricing-card-featured`** — Recommended tier — surface lift to surface-2.
- Background `{colors.surface-2}`, otherwise identical structure.

**`feature-card`** — Generic feature highlight tile.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.lg}`, padding 24px.

**`product-screenshot-card`** — The dominant card type — frames a high-fidelity Linear app UI screenshot.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xl}`, padding 24px.

**`testimonial-card`** — Customer quote with avatar + name + role.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body-lg}`, rounded `{rounded.lg}`, padding 32px.

**`customer-logo-tile`** — Small tile in the customer marquee.
- Background `{colors.canvas}`, text `{colors.ink-subtle}`, type `{typography.caption}`, rounded `{rounded.xs}`, padding 16px.

**`cta-banner`** — Closing CTA panel near page bottom.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.headline}`, rounded `{rounded.lg}`, padding 48px.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** — Form fields on `/contact/sales` and signup overlays.
- Background `{colors.surface-1}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.md}`, padding 8px 12px.
- Focused state retains the same surface; the focus ring is a 2px `{colors.primary-focus}` outline at 50% opacity.

### Status & Build Page

**`changelog-row`** — Each row in `/build` (changelog page) listing version, date, and changes.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body}`, rounded `{rounded.xs}`, padding 24px 0. 1px `{colors.hairline}` bottom rule.

**`status-badge`** — Small status pill.
- Background `{colors.surface-2}`, text `{colors.ink-muted}`, type `{typography.caption}`, rounded `{rounded.pill}`, padding 2px 8px.

### Navigation

**`top-nav`** — Sticky dark bar with the Linear wordmark left, primary nav links centered, and a `button-secondary` ("Sign in") + `button-primary` ("Get started") pair right.
- Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.body-sm}`, height 56px.

**`project-section-menu-desktop`** — Compact right-edge table of contents for project detail pages.
- Remains hidden over the project hero and slides/fades in at the right-center edge once the project content reaches the scroll viewport top.
- Every resting tick is 12×3px with compact 16px row height. The current section uses the high-contrast neutral ink token; never use the chromatic accent for selection.
- Hover expands the target tick to 24px and its immediate neighbors to 18px with a 400ms, 0.2-bounce spring. Labels reveal to the left in one consistent tokenized tooltip shell; active position is communicated by the persistent tick contrast rather than a competing tooltip color.
- Labels remain keyboard accessible, and clicking any tick smoothly scrolls to its section with enough top offset to preserve the heading.

**`project-section-menu-mobile`** — Full-width sticky dropdown for project detail pages at ≤768px.
- It lives immediately after the hero/header in document order. A zero-height sentinel reveals it only when that location reaches the top of the project scroll viewport; entrance is a 10px downward slide plus a 220–300ms fade/settle, and reversing above the trigger hides and closes it.
- The collapsed bar and downward-opening list span the project viewport edge to edge. Compute the breakout from the shared `--page-inline-gutter` token so both the 28px tablet gutter and 18px phone gutter resolve correctly; never hardcode one breakpoint's gutter into the component width.
- Use the theme-aware translucent `{colors.surface}` glass treatment (`rgba(20,21,22,0.80)` dark / `rgba(255,255,255,0.84)` light) with 18px backdrop blur, 120% saturation, and a restrained downward shadow. The outer shell has no border or radius.
- Keep the control hidden from pointer and keyboard interaction before reveal. The current section label truncates to one line; the chevron points down while closed and up while open.

### Resume Globe

**`resume-globe`** — The `/hero` page presents the résumé as a geographic, scroll-driven narrative rather than a linear timeline.
- Desktop: copy occupies the left column and a sticky, unclipped globe occupies the right column.
- Intro: no eyebrow or location marker; the globe is larger than in subsequent scenes and the shared animated mouse scroll cue appears centered at the viewport bottom only while the page is at the top.
- Journey scenes use geographically accurate markers and great-circle route animation for Beijing, Ann Arbor, Los Angeles, Sunnyvale, and Santa Clara. Repeated Sunnyvale chapters change content without inventing a new location.
- The globe is rendered at device pixel ratio for crisp output and redraws correctly after route entry, resize, and theme changes.
- Light and dark modes use the same hierarchy and geometry; only tokenized colors change.
- Descriptions use `{typography.body}` at 16px; journey tags are intentionally hidden.
- Wheel, trackpad, scrollbar, and keyboard input use the browser's native scrolling and momentum. Each scene is a scoped `scroll-snap-align: start` stop inside the Hero scroller; do not cancel wheel events, lock input while motion is running, or replace native movement with scene-by-scene JavaScript animation. Use `scroll-snap-stop: normal` so sustained input can continue through scenes, while a completed gesture settles at the nearest scene.
- Scroll-snap scene containers must never animate `transform`, height, padding, or position as their active state changes. Animate opacity only; moving a snap target during native settling causes a visible final-position correction.
- Hero and project-detail hero sections share one compact scroll cue inspired by the Framer Scroll Cue reference: a 20×34px, 1.5px rounded mouse outline with a 3.5px dot moving 5px down and back before pausing. It replaces all scroll-label and arrow copy. The cue is centered against the visual viewport—not an asymmetrically padded content wrapper—and keeps a shared 16px bottom inset. On stacked Hero layouts it anchors 16px above the copy/globe division. Mobile project hero metadata reserves 72px at the bottom so long taglines cannot collide with it. The cue fades away as soon as its own scroll container leaves the top and returns only when scrolled back to the top. Use semantic `--scroll-cue-color` mapped to `ink-tertiary` on normal light/dark surfaces, and muted `--scroll-cue-media-color` over project imagery so it remains subordinate to white hero copy; reduced-motion mode disables the repeating translation.
- At ≤768px, copy and globe each occupy 50% of the viewport. Touch gestures remain directly draggable over either half and complete to the adjacent scene on release using the same settle curve.

### Project Image Readability

**`project-preview-media`** — The shared readability treatment for every image-backed portfolio card, including Projects, all Craft galleries, and the Craft Data Visualization entry.
- Keep the source image crisp above the label region. Within only the lower 34%, use four independently masked copies of the source image that rise from 0.35px to a maximum 2.5px blur. Independent image bands prevent blur from accumulating across the whole overlay and must transition without a visible horizontal boundary.
- Keep contrast and blur as independent layers. Use a compact bottom vignette from 86% black at the bottom through 70% at 14%, 44% at 30%, and transparent by 72% of the card height. This dark media scrim is deliberately identical in light and dark modes because image luminance, not the page theme, determines white-label readability.
- Titles are white; supporting text is 86% white. Do not add text shadows.
- Apply the same overlay component and values everywhere rather than creating section-specific Craft or project variants. Artwork fit and its source-of-truth background remain independent from this text-readability layer.
- Fine-detail Craft GIF and print thumbnails use the same vignette geometry but omit backdrop blur so small raster artwork remains crisp; this is a media-resolution safeguard, not a different label treatment.

**`project-hero-media`** — Full-viewport hero image at the top of every project detail page, including Data Visualization reached through Craft.
- Use a shorter bottom vignette from 86% black at the bottom through 72% at 10%, 50% at 22%, 28% at 34%, and transparent by 66% of the image height.
- Apply six independently masked copies of the source image within only the lower 24% of the hero. Blur rises from 0.35px to a maximum 5px at the bottom so it covers the title area without softening the rest of the image. Keep this blur layer separate from the vignette and never animate blur strength during scroll.
- The base hero and every blur band must share one opacity entrance container, identical dimensions, and identical `object-fit` geometry. Never enlarge a blurred copy to hide filter edges: even a small scale difference creates doubled UI details at a mask boundary.
- Titles are white and supporting text is 86% white in both light and dark modes. Do not add text shadows. Empty/no-image heroes use normal theme tokens and no media blur.
- Any project-like entry uses this shared hero treatment regardless of which top-level portfolio section links to it; navigation context must never change media readability.

### Image Carousel and Lightbox

**`image-carousel`** — Product screenshots use a clipped three-panel track.
- At rest, only the active image is visible. During interaction, the previous or next image follows the gesture into the viewport.
- Swipe and arrow navigation share one full-width slide transition. Motion is `transform: translate3d(...)` only; image width, height, opacity, crop, and aspect ratio remain constant.
- Duration is at most 280ms with `cubic-bezier(0.32, 0.72, 0, 1)`. The track resets in the same rendered frame as the active-index update, so there is no black frame or visible rebound.
- The three slide DOM nodes use stable offset keys and adjacent images load eagerly with async decoding, preventing white flashes during the atomic track reset/index swap.
- Inline and Lightbox carousels use the same behavior. Each measures its own track width; never use a padded outer container to calculate travel distance.
- Touch gestures preserve vertical scrolling with `touch-action: pan-y`. A 50px drag, or a fast gesture of at least 28px / 400px/s, advances the carousel; shorter gestures ease back.
- Adjacent images may be mounted/preloaded for continuity but must remain clipped while idle. Non-active images use empty alt text and `aria-hidden`.
- Inline carousel media always uses `object-fit: contain`. The stage keeps its declared responsive aspect ratio and 52svh height cap; any extra letterbox area stays transparent so the current page surface shows through. Never crop product UI to fill the frame, including after viewport resize.
- Lightbox gestures bind directly to `.lightbox-swipe-track`. At open, slide change, and viewport resize, compare the active image's natural aspect ratio with the available media area before the browser paints. Images whose width-fit height fits the viewport use a centered fixed-height `contain` stage; taller images use their full width and create a native vertical scroll region so product details remain readable. Never show an intermediate fit layout before switching to long-image mode.
- Opening an image or before/after comparison uses a shared-position transition: the media expands continuously from its inline card, carousel frame, or comparison frame into the Lightbox, while the surrounding overlay fades in separately. Closing reverses the same path. Use `cubic-bezier(0.32, 0.72, 0, 1)` at roughly 560ms so the movement starts deliberately and settles with a long smooth tail; never scale the whole page shell.
- The Lightbox shell itself remains opaque during almost the entire shared transition; only a dedicated scrim layer fades. Set `layoutCrossfade={false}` on every shared media pair. The shared `layoutId` always belongs to the actual visible media element for single images, galleries, GIF craft tiles, and carousel slides—never to a card wrapper, fixed-ratio stage, three-slide track, caption, or control layer. Each source media element must hug its visible, intrinsic-aspect-ratio pixels (`width/height: auto` with `max-width/max-height: 100%`) instead of using a stage-sized `100% × 100%` `object-fit` box; this keeps x/y scale identical and makes every zoom a distortion-free translate plus uniform scale, matching Linear Docs.
- Project Lightboxes never dismiss or zoom out in response to vertical wheel, trackpad, or touch input. Viewport-fit media remains stationary; long media scrolls natively inside the Lightbox and remains open at both boundaries. Horizontal gestures remain reserved for carousel navigation.
- Close, Escape, and clicks on genuine backdrop space always reverse the shared-position zoom. Clicking the rendered image itself never dismisses it. Switching carousel slides resets the new image to its top and remeasures its mode.
- Use one shared 16px Lightbox chrome inset: the footer label starts on the same left edge as the previous-carousel control, while the next-carousel and dismiss controls use the mirrored right edge. Preserve this alignment at every breakpoint.
- Every image Lightbox footer, whether opened from Projects or Craft, enters by fading and sliding 10px upward from below, then exits by fading and sliding 10px downward. Keep this transform on the footer only so it does not disturb the shared-position media zoom; reduced-motion mode uses opacity only.
- Lightbox controls and captions enter after the media begins expanding. Reduced-motion visitors receive a near-instant state change while retaining every navigation and dismissal path.
- Craft GIF tiles use real `<img>` elements so animation plays on mobile; they are not CSS background images.

### Project Narrative Components

- Metric-card labels are concise sentence-case noun phrases, never sentence fragments with trailing verbs such as “is,” “reached,” or “spend.” Preserve the factual value and unit while naming the measure directly, for example “Total page views,” “Customer satisfaction (CSAT),” or “Average daily time per user.”

**`project-split`** — Alternating copy and media used for personas, pain points, and supporting illustrations.
- Desktop columns align to the top, with the first heading and the visible image edge sharing the same physical top edge.
- Media has no frame, border, padding, or background. Images and transparent Lottie illustrations sit directly in the reading flow.
- Related desktop pain-point Lotties share one 160–184px responsive stage height, preserving a consistent illustration scale while remaining close to the adjacent copy height and eliminating the former square-canvas whitespace. At ≤768px they return to a stable `16:9` stage below the copy.
- At ≤768px, copy appears before media and both remain flush inside the single-column reading flow.

**`project-message-bubbles`** — Learner or customer feedback presented as an alternating conversation.
- Match the original portfolio's alternating rounded-message layout, but let every bubble hug its text up to an 82% / 720px desktop maximum (90% on mobile). Use an 18px desktop thread gap and 14px mobile gap. Every bubble uses the shared project callout shell: neutral `surface-3`, a subtle `hairline` border, and a 16px radius. Left messages have a square bottom-left corner; right messages have a square bottom-right corner.
- The thread has no enclosing card, border, fill, or inset; bubbles sit directly in the reading flow.
- Each bubble independently follows viewport presence: it starts fully outside the clipped thread at ±110%, fades/slides in from its corresponding side on entry, and reverses out toward that side when scrolling away. The thread uses paint containment so offscreen messages cannot leak into view. Reduced-motion users see the final state immediately.

**Metric units** — Keep compact values on one line, such as `11m 34s` and `9m 4d`. Do not spell out units inside metric values.

**`project-design-goal-card`** — The reusable design-goal treatment across every project.
- Use the shared project callout shell and center its contents. Render `Design goal` / `Design goals` as the 13px eyebrow token: weight 500, 1.3 line height, +0.4px tracking, uppercase visual treatment, `{colors.ink-tertiary}`, and 16px below it.
- The goal copy is the visual subject at 17–18px / 1.55 and may be followed by an existing supporting image after 24px. Preserve the original wording and keep image Lightbox behavior.
- Retain semantic H2/H3 markup for the eyebrow label so desktop and mobile on-page navigation continue to work; the visual eyebrow treatment does not alter its source string or anchor ID.

**`project-case-study-card`** — The protected-work handoff used by Account IQ and Configurable checkout.
- Center the section title, NDA explanation, and CTA inside a `surface-3` card with a subtle `hairline` border, 16px radius, and no shadow. The CTA reuses the Contact page's primary button styling and places the Figma file mark to the left of “View case study.”
- The card may tilt up to roughly 2.5° per axis as the pointer moves across it. A soft radial glare follows the pointer; keep dark-mode opacity deliberately restrained (8% at the center, fading through 3%) and use the brighter token-compatible treatment only in light mode. This is an interaction affordance for this component, not a decorative page spotlight.
- Use a damped spring (`stiffness: 210`, `damping: 24`, `mass: 0.55`) and return cleanly to zero rotation on pointer leave. Disable both tilt and glare under `prefers-reduced-motion`.
- Open the Figma prototype in a new tab with `noopener noreferrer`. Password entry and validation remain entirely within Figma; never store an NDA password, presentation content, or access token in the public GitHub Pages bundle.

**`project-quote-grid--1`** — A single pull-quote statement not classified as a design goal.
- Center the statement inside the shared project callout shell, with no shadow, quotation decoration, or redundant label.
- Use responsive 20–28px display type and preserve the original project wording.

**Shared project callout shell** — Message bubbles, metrics, insight/highlight cards, and text-based design goals share the Linear Docs highlight-card treatment: `surface-3` background, 1px `hairline` border, 16px radius, and no shadow. Their internal layouts remain purpose-specific so metrics emphasize values, design goals center the statement, and messages preserve the alternating conversation rhythm.

### Footer

**`footer`** — Dense link grid on `{colors.canvas}` with the Linear wordmark left.
- Background `{colors.canvas}`, text `{colors.ink-subtle}`, type `{typography.caption}`, padding 64px 32px.

### Contact illustration

- Style “Let's build something great.” with the Hero display language: 36–48px / 1.1 on desktop, 30–40px / 1.1 on mobile, weight 590, tight negative tracking, and balanced wrapping. At ≤360px hold the heading at 30px so the adjacent illustration cannot force clipping.
- Place the monochrome envelope-and-paper-airplane illustration directly above the copy with no eyebrow label on desktop. Use 170px and offset its canvas 16% left so the visible envelope edge aligns optically with the heading edge. At ≤640px, keep the heading, invitation, opportunity list, and direct links in the fluid left grid column and place the 130px illustration in the fixed right column with a 24px gap. Start the image on the description row—not the heading row—and shift it 6% upward so its visible artwork aligns with the first line of “Whether you have a role…”. Below 360px, retain the 130px illustration but contract the gap to 16px. Give copy and links `min-width: 0` / wrapping behavior so nothing clips.
- Preserve the illustration's transparent exterior and opaque internal black/white planes. Dark mode applies a full inversion so contours become white and internal white planes become dark; light mode uses the source colors unchanged. Do not add a card, border, shadow, or colored treatment.
- The supporting introduction is intentionally limited to: “Whether you have a role, a project, or just want to connect, I'd love to hear from you.”

### Confidential case-study access

- In the centered `Full case study` card, render “contact me” as an inline semantic email link using normal link affordances: primary ink, medium weight, a subtle underlined resting state, accent hover, and a visible focus ring. Prefill the email subject as “Request case study access.” The link supplements rather than replaces the primary Figma CTA.

## Do's and Don'ts

### Do

- Reserve `{colors.canvas}` (#010102) as the system's anchor surface — the faint blue tint is intentional.
- Use `{colors.primary}` lavender ONLY for: brand mark, primary CTA, focus ring, link emphasis.
- Use the four-step surface ladder for hierarchy. Avoid skipping levels.
- Pair display weight 600 with body weight 400 — Linear resists 700+ display weights.
- Apply negative letter-spacing aggressively on display.
- Use product UI screenshots as the protagonist of every section.
- Compose CTAs as `{rounded.md}` 8px corners.

### Don't

- Don't introduce theme-specific hardcoded colors without an equivalent light/dark token treatment.
- Don't use lavender as a section background or card fill.
- Don't introduce a second chromatic accent (orange, pink, green for marketing).
- Don't add atmospheric gradients or spotlight cards.
- Don't pill-round CTAs.
- Don't use `#000000` true black as the canvas.
- Don't combine multiple bright accents in product screenshot mockups.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1280px | Card grid 3-up maintained |
| Tablet | 1024px | Card grid 3-up → 2-up |
| Mobile-Lg | 768px | Pricing comparison becomes accordion; nav hamburger |
| Mobile | 480px | Single-column; display-xl scales 80px → ~36px |

### Touch Targets

- CTAs hold ≥40px tap height across viewports.
- Pricing tab pills hold ≥36px tap height; touch viewports grow to ≥44px.
- Form inputs hold ≥44px tap target on touch.

### Collapsing Strategy

- **Top nav**: links collapse to hamburger below 768px.
- **Card grids**: 3-up → 2-up at 1024px → 1-up below 768px.
- **Pricing comparison**: per-tier accordion below 768px.
- **Display type**: `{typography.display-xl}` 80px scales toward `{typography.display-md}` 40px on mobile.

### Image Behavior

- Product UI screenshots preserve their source aspect ratio unless a carousel/card explicitly uses `object-fit: cover`; use the existing `contain` option for artwork that must never crop.
- Customer logos in the marquee may collapse from 6-up to 3-up below 768px.
- Resume layout becomes a 50/50 viewport split below 768px: scrollable copy above and the globe below.
- Carousels remain swipeable at touch sizes; navigation targets are at least 40px and do not block vertical scrolling.

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` token name.
2. When introducing a section, decide first which surface lift it lives on.
3. Default body to `{typography.body}` at weight 400.
4. Run `npx @google/design.md lint DESIGN.md` after edits.
5. Add new variants as separate component entries.
6. Treat lavender as scarce: brand mark, primary CTA, focus, link emphasis.
7. Lead every section with a product UI screenshot.

## Known Gaps

- The four-step surface ladder values are extracted directly from Linear's `--color-bg-level-3`, `--color-line-tint`, etc. CSS variables; they are Linear's canonical surface spec.
- Form-field error and validation styling is not visible on the inspected pages.
- This portfolio extends the source Linear palette with a fully tokenized light mode; geometry, hierarchy, and interaction behavior remain identical across themes.
- Theme defaults to the browser/operating-system `prefers-color-scheme` value. Before React mounts, the document applies that value to `data-theme`, `color-scheme`, and the browser `theme-color` meta tag to prevent a wrong-theme flash. Continue following live system changes until the visitor explicitly selects light or dark; only explicit selections are persisted under `theme-preference`.
- Linear's actual product UI uses a richer color-tag palette (red, orange, yellow, green, blue, purple) for issue priorities and project labels — those colors live in the in-product surfaces shown in mockups.
- The custom display, text, and mono families are proprietary; an open-source substitute is acceptable.
