# @aakashiic/design-lint

Lint rules that keep raw colours and arbitrary sizes out of **new** code, so it uses [`@aakashiic/tokens`](../tokens).

| Tool | What it checks | Used by |
|---|---|---|
| ESLint rule `ds/no-arbitrary-values` (DS-1.7) | Tailwind classes in `className`, `class`, and `cn()` / `clsx()` / `cva()` / `twMerge()` calls | Data Vault, V-Estate, central portal |
| Stylelint config (DS-1.8) | CSS and SCSS declarations | VRetail (and any `.scss`/`.css` in the React apps) |

## What gets flagged

| Flagged | Use instead |
|---|---|
| `bg-[#4434DD]`, `text-[rgb(0,0,0)]`, `shadow-[0_1px_2px_#000]` | `bg-primary`, `text-text`, `shadow-sm` |
| `text-[11px]`, `p-[13px]`, `rounded-[10px]`, `[font-size:13px]` | `text-xs`, `p-3`, `rounded-lg` |
| SCSS `color: #fff`, `color: white`, `rgba(...)` | `var(--ds-color-*)` or `$ds-color-*` |
| SCSS `font-size`, `padding`, `margin`, `gap`, `border-radius` in px/rem | `var(--ds-font-size-*)`, `var(--ds-spacing-*)`, `var(--ds-radius-*)` |

**Not flagged:** CSS variables (`p-[var(--x)]`, `bg-(--ds-color-primary)`), `calc()`, layout sizes (`w-[320px]`, `h-[200px]`, `width: 320px`), and borders (`border: 1px solid ...`).

**Auto-fix:** when an arbitrary value equals a token exactly, `eslint --fix` replaces it: `p-[16px]` → `p-4`, `rounded-t-[8px]` → `rounded-t-lg`, `-mt-[8px]` → `-mt-2`. Font sizes get an editor suggestion instead (`text-[14px]` → `text-sm`), because `text-sm` also sets a line-height.

## Install

Needs read access to the package and a GitHub token with `read:packages` (see the tokens README). In the app's `.npmrc`:

    @aakashiic:registry=https://npm.pkg.github.com

Then:

    npm install -D @aakashiic/design-lint

## Set up: React apps (ESLint 9.24+ flat config)

```js
// eslint.config.mjs
import designLint from '@aakashiic/design-lint/eslint';

export default [
  // ...your existing config
  designLint.configs.recommended,
];
```

Uses your existing TypeScript/JSX parser. Using other class helpers? Configure them:

```js
{ rules: { 'ds/no-arbitrary-values': ['error', { callees: ['cn', 'clsx', 'myClasses'], attributes: ['className', 'wrapperClass'] }] } }
```

## Set up: VRetail and other SCSS (Stylelint 16+)

```json
{
  "extends": ["stylelint-config-standard-scss", "@aakashiic/design-lint/stylelint"],
  "overrides": [{ "files": ["src/styles/_tokens.scss"], "rules": { "color-no-hex": null, "function-disallowed-list": null } }]
}
```

Files that *define* colours (like VRetail's `_tokens.scss`) need the override.

## Only new code: record a baseline

Existing code has thousands of violations (measured on 16 Nov 2026, see below), so turn the rules on with a baseline. Old violations are recorded in a file; CI fails only on new ones.

```bash
# once per app, commit the file it creates
npx eslint . --suppress-rule ds/no-arbitrary-values   # → eslint-suppressions.json
npx stylelint "src/**/*.scss" --suppress              # → stylelint-suppressions.json (Stylelint 17; experimental)
```

How the baseline counts: per file and per rule. If you add a new violation to a file, that file's existing violations of the same rule are reported too: fix them, or re-run the command above to re-record. When you fix old ones, prune the file:

```bash
npx eslint . --prune-suppressions
```

## What the rules find today

| App | Files with issues | Raw colours | Arbitrary sizes | Auto-fixable |
|---|---|---|---|---|
| Data Vault (`dv/src`, 379 files) | 147 | 924 | 297 | 12 |
| V-Estate (`admin.vestate.io-staging/src`, 350 files) | 60 | 38 | 194 | 3 |
| VRetail SCSS (63 files, excluding `_tokens.scss`) | 55 | 3,748 | 4,117 | n/a |

Most common in Data Vault: `text-[#2B3674]` ×199 (use `text-text`), `text-[#707EAE]` ×133 (`text-text-muted`), `text-[14px]` ×55 (`text-sm`).

## Develop

    npm test    # runs the rule against ESLint 9 and 10, and the Stylelint config
