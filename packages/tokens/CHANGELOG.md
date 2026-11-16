# @aakashiic/tokens

## 0.1.1

### Patch Changes

- 7a4b86b: Consumer docs (DS-1.9): installing from GitHub Packages (locally and in CodeBuild/Actions CI), setting up Next.js + Tailwind v4 and Angular + SCSS, choosing and nesting themes, a token reference, and pinning and upgrading versions per app.

## 0.1.0

### Minor Changes

- First release with the Phase 0 values ([spec](../../docs/phase-0-spec.md)).
  - Shared layer: Geist, 7 type sizes (12–30px), 4 weights, 5 radii, 3 control heights, spacing, 3 shadows, motion.
  - Colour themes: `datavault` (default), `vretail`, `vestate`, plus V-Estate dark mode. 17 semantic colours each, all meeting WCAG AA.
  - Outputs: CSS variables (`tokens.css`), Tailwind v4 `@theme` (`tailwind.css`) and SCSS (`scss`).
