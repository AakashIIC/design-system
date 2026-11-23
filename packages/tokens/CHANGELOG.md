# @aakashiic/tokens

## 0.6.0

### Minor Changes

- 70871d8: Add the `iiclab` theme (Ink In Caps site: lime on off-white) and `iiclab-dark` for its dark sections. Add a shared `--ds-font-family-display` token (Tailwind `font-display`), which equals `sans` by default. A theme may now override the shared font families: iiclab uses Anek Devanagari for body text and Deutschlander for display.

## 0.5.0

### Minor Changes

- 77ab2d8: Add the `overlay` colour (`bg-overlay`, `--ds-color-overlay`): the backdrop behind modals and sheets. Black at 30% in the light themes (Data Vault's modal backdrop) and 60% in V-Estate dark. It's already translucent, so use it as is, with `backdrop-blur-sm`.

## 0.4.0

### Minor Changes

- a4ef5b7: DS-3.0: status and chart colours.

  - Each status gets a soft background (`success-soft`, `warning-soft`, `danger-soft`, `info-soft`) and a strong text colour (`*-strong`). The strong shades pass WCAG AA on white and on their soft background. V-Estate dark uses dark tints with light text.
  - New chart series `chart-1` … `chart-6`, taken from Data Vault's chart colours. V-Estate's gold ramp is provisional.
  - A JS/TS export for code that can't read CSS variables, such as Chart.js and Recharts: `import { colors, chartColors } from '@aakashiic/tokens'`.

## 0.3.0

### Minor Changes

- 8821325: Add display font sizes for hero numbers and KPI values: `text-4xl` (36px), `text-5xl` (48px) and `text-6xl` (60px). Data Vault has 29 hero sizes from 32 to 62px that had no token. The lint rule now suggests these for `text-[36px]`, `text-[48px]` and `text-[60px]`.

## 0.2.0

### Minor Changes

- 0979377: Add `font.size.2xs` (11px, `text-2xs`) for dense data UI, `radius.sm` (4px, `rounded-sm`) and an `accent` colour (`#8076EE` in Data Vault/VRetail, equal to primary in V-Estate) for the brand gradient end. Data Vault uses 8–11px text 478 times, plain `rounded` 202 times and `#8076EE` 130 times; these give the Phase 2 codemods a target ([spec](../docs/phase-0-spec.md)).

## 0.1.1

### Patch Changes

- 7a4b86b: Consumer docs (DS-1.9): installing from GitHub Packages (locally and in CodeBuild/Actions CI), setting up Next.js + Tailwind v4 and Angular + SCSS, choosing and nesting themes, a token reference, and pinning and upgrading versions per app.

## 0.1.0

### Minor Changes

- First release with the Phase 0 values ([spec](../../docs/phase-0-spec.md)).
  - Shared layer: Geist, 7 type sizes (12–30px), 4 weights, 5 radii, 3 control heights, spacing, 3 shadows, motion.
  - Colour themes: `datavault` (default), `vretail`, `vestate`, plus V-Estate dark mode. 17 semantic colours each, all meeting WCAG AA.
  - Outputs: CSS variables (`tokens.css`), Tailwind v4 `@theme` (`tailwind.css`) and SCSS (`scss`).
