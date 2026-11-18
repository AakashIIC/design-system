# @aakashiic/design-lint

## 0.3.0

### Minor Changes

- 8821325: Add display font sizes for hero numbers and KPI values: `text-4xl` (36px), `text-5xl` (48px) and `text-6xl` (60px). Data Vault has 29 hero sizes from 32 to 62px that had no token. The lint rule now suggests these for `text-[36px]`, `text-[48px]` and `text-[60px]`.

## 0.2.0

### Minor Changes

- 0979377: `ds/no-arbitrary-values` now suggests `text-2xs` for `text-[11px]` and auto-fixes `rounded-[4px]` to `rounded-sm`, matching the new tokens.

## 0.1.0

### Minor Changes

- 7a4b86b: First release: ESLint rule `ds/no-arbitrary-values` for Tailwind classes (DS-1.7) and a Stylelint config for CSS/SCSS (DS-1.8). Both flag raw colours and arbitrary sizes so new code uses `@aakashiic/tokens`.
