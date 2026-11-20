<div align="center">

# Design System

**One design language for Data Vault, VRetail and V-Estate.**

Shared type, spacing, radius, shadows and motion, with a colour theme per app.
Tokens, React components and lint rules ship from one monorepo.

[![CI](https://github.com/AakashIIC/design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/AakashIIC/design-system/actions/workflows/ci.yml)
[![Release](https://github.com/AakashIIC/design-system/actions/workflows/release.yml/badge.svg)](https://github.com/AakashIIC/design-system/actions/workflows/release.yml)
![Node 22+](https://img.shields.io/badge/node-22%2B-339933?logo=node.js&logoColor=white)
![React 19](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS v4](https://img.shields.io/badge/tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-strict-3178C6?logo=typescript&logoColor=white)

</div>

---

## Contents

- [Packages](#packages)
- [How it fits together](#how-it-fits-together)
- [Quick start](#quick-start)
  - [1. Install](#1-install)
  - [2. Import the styles](#2-import-the-styles)
  - [3. Pick a theme](#3-pick-a-theme)
  - [4. Use it](#4-use-it)
- [Components](#components)
- [Themes](#themes)
- [Lint rules](#lint-rules)
- [Developing](#developing)
- [Changing a token](#changing-a-token)
- [Releasing](#releasing)
- [Repository layout](#repository-layout)
- [Docs](#docs)

---

## Packages

| Package | Version | What it is | Docs |
|---|---|---|---|
| [`@aakashiic/tokens`](packages/tokens) | 0.5.0 | Design tokens as CSS variables, a Tailwind v4 theme, SCSS variables and JS values | [README](packages/tokens/README.md) |
| [`@aakashiic/ui`](packages/ui) | 0.3.1 | React 19 components built on Radix primitives and styled with Tailwind v4, using only token names | [README](packages/ui/README.md) |
| [`@aakashiic/design-lint`](packages/lint) | 0.3.0 | ESLint and Stylelint rules that flag raw colours and arbitrary sizes in new code, with auto-fix | [README](packages/lint/README.md) |

Which packages an app uses:

| App | Stack | Uses |
|---|---|---|
| Data Vault | Next.js + Tailwind v4 | tokens, ui, design-lint (ESLint) |
| V-Estate | Next.js + Tailwind v4 | tokens, ui, design-lint (ESLint) |
| VRetail | Angular + SCSS | tokens (SCSS / CSS variables), design-lint (Stylelint) |

---

## How it fits together

```
                 ┌─────────────────────────────────┐
                 │  tokens/*.json  (DTCG format)   │
                 │  shared/  font, size, shadow,   │
                 │           motion                │
                 │  themes/  datavault, vretail,   │
                 │           vestate, vestate-dark │
                 └────────────────┬────────────────┘
                                  │ Style Dictionary (build.js)
          ┌──────────────┬────────┴───────┬──────────────┐
          ▼              ▼                ▼              ▼
     tokens.css     tailwind.css     _tokens.scss     index.js
   (CSS variables)  (@theme for v4)   (Angular)    (Chart.js / Recharts)
          │              │
          └──────┬───────┘
                 ▼
          @aakashiic/ui  ──── components use token classes only
                 │            (bg-surface, text-text-muted, …)
                 ▼
     Next.js apps  ◄──── @aakashiic/design-lint keeps new code on tokens
```

- **Shared everywhere:** font, type scale, spacing, radius, shadows, motion.
- **Per app:** colours only, switched by one `data-app` attribute.
- **Enforced:** the lint rules flag `bg-[#4434DD]`, `p-[13px]`, `color: #fff` and similar, and auto-fix them to
  the matching token when one exists.

---

## Quick start

### 1. Install

The packages are published to **GitHub Packages** under the `@aakashiic` scope. Reading them needs a GitHub
token (classic) with the `read:packages` scope and read access to the package.

Add an `.npmrc` to the app. It holds no secret, so commit it; npm reads the token from the environment:

```ini
@aakashiic:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
save-exact=true
```

```bash
npm install --save-exact @aakashiic/tokens @aakashiic/ui
```

```bash
npm install --save-dev @aakashiic/design-lint
```

`@aakashiic/ui` expects `react`/`react-dom` 19, `tailwindcss` 4.1+ and `lucide-react` from the app. A few
components need an optional peer (`react-day-picker`, `recharts`, `cmdk`, `vaul`, `react-hook-form`); install
one only if you import that component. CI set-up (AWS CodeBuild, GitHub Actions) is in the
[tokens README](packages/tokens/README.md#in-ci).

### 2. Import the styles

In the app's global CSS (for example `src/app/globals.css`):

```css
@import "tailwindcss";
@import "@aakashiic/tokens/tokens.css";
@import "@aakashiic/tokens/tailwind.css";
@import "@aakashiic/ui/styles.css";
```

The last line matters: Tailwind v4 never scans `node_modules`, so `styles.css` adds the `@source` for the
components and loads the open/close animations. No `tailwind.config.js`, PostCSS change or
`transpilePackages` is needed.

**Angular + SCSS (VRetail):**

```scss
@use "node_modules/@aakashiic/tokens/dist/scss/tokens" as ds;
// or, with Sass's Node package importer: @use "pkg:@aakashiic/tokens/scss" as ds;

.card {
  padding: ds.$ds-spacing-4;
  color: ds.$ds-color-text;
}
```

The SCSS variables point at the CSS variables, so `data-app` theme switching works in Angular too.

### 3. Pick a theme

Set one attribute on `<html>`:

```tsx
// src/app/layout.tsx
<html lang="en" data-app="vestate">
```

### 4. Use it

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@aakashiic/ui";
import { Calendar } from "@aakashiic/ui/calendar"; // optional-peer components have their own path

export function SignIn() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <Button className="w-full">Continue</Button>
      </CardContent>
    </Card>
  );
}
```

Your own markup uses the same token classes as the components:

```tsx
<div className="rounded-lg bg-surface p-4 text-text shadow-sm">
  <p className="text-sm text-text-muted">Last synced 2 minutes ago</p>
</div>
```

---

## Components

Every component is restyled to the tokens, typed, tested in jsdom and checked with axe for accessibility
violations.

| Group | Components |
|---|---|
| **Overlays** | `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip`, `Drawer`¹ |
| **Actions** | `Button` (sizes `xs`–`lg`, variants), `Spinner` |
| **Forms** | `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Label`, `Form`¹ |
| **Navigation** | `Tabs`, `DropdownMenu`, `Command`¹, `Accordion`, `Collapsible` |
| **Data display** | `Table`, `Badge`, `Card`, `Avatar`, `Progress`, `Skeleton`, `Separator`, `ScrollArea`, `Chart`¹, `Calendar`¹ |
| **Feedback** | `Toaster` (Sonner) |
| **App shell** | `Sidebar`, `AppHeader`, `ProjectSwitcher`¹, `AppSwitcher` |
| **Utilities** | `cn()` (`clsx` + `tailwind-merge`, aware of the token sizes) |

¹ Needs an optional peer dependency, so import it from its own path: `@aakashiic/ui/calendar`,
`@aakashiic/ui/chart`, `@aakashiic/ui/command`, `@aakashiic/ui/drawer`, `@aakashiic/ui/form`,
`@aakashiic/ui/project-switcher`. Everything else is also available from the package root.

Overlays portal to `<body>` and take their `z-index` from `--ds-z-overlay`, so an app with high-`z-index`
chrome can lift them with one variable. See the [ui README](packages/ui/README.md#stacking---ds-z-overlay).

**Browse them locally:**

```bash
npm run preview -w @aakashiic/ui
```

---

## Themes

| App | Attribute | Colours |
|---|---|---|
| Data Vault | `data-app="datavault"` | Indigo (the default when no attribute is set) |
| VRetail | `data-app="vretail"` | Indigo |
| V-Estate | `data-app="vestate"` | Gold, with a dark theme |

- **Dark mode** (V-Estate) turns on with the `dark` class on `<html>` (what `next-themes` sets) or
  `data-theme="dark"`.
- **Themes nest.** `data-app` works on any element, so one section can use another app's colours:
  `<section data-app="datavault">…</section>`.
- **Colours in JavaScript.** Canvas-based charts can't read CSS variables, so `@aakashiic/tokens` also exports
  the literal values per theme.

To see every token in every theme, build and open [`packages/tokens/preview.html`](packages/tokens/preview.html).

---

## Lint rules

```js
// eslint.config.mjs (ESLint 9.24+ flat config)
import designLint from "@aakashiic/design-lint/eslint";

export default [
  // ...your config
  designLint.configs.recommended,
];
```

| Flagged | Use instead |
|---|---|
| `bg-[#4434DD]`, `text-[rgb(0,0,0)]` | `bg-primary`, `text-text` |
| `p-[13px]`, `rounded-[10px]`, `text-[11px]` | `p-3`, `rounded-lg`, `text-xs` |
| SCSS `color: #fff`, `padding: 12px` | `var(--ds-color-*)`, `var(--ds-spacing-*)` |

When an arbitrary value matches a token exactly, `eslint --fix` rewrites it (`p-[16px]` → `p-4`). CSS
variables, `calc()`, layout sizes and borders aren't flagged. Stylelint set-up for SCSS is in the
[lint README](packages/lint/README.md).

---

## Developing

Requires **Node 22+**. Installing needs no token: every dev dependency comes from npmjs.com.

```bash
git clone https://github.com/AakashIIC/design-system.git
cd design-system
npm install
npm run build     # tokens → dist/, ui → dist/
npm test          # lint-rule tests (ESLint 9 + 10, Stylelint), ui export/Tailwind tests, component tests
```

| Command | What it does |
|---|---|
| `npm run build` | Builds every package |
| `npm test` | Runs every package's tests |
| `npm run preview -w @aakashiic/ui` | Vite playground with every component and the app shell |
| `npm run typecheck -w @aakashiic/ui` | Strict TypeScript check |
| `npm run changeset` | Records a release note for your change |

Every pull request runs [CI](.github/workflows/ci.yml): build (fails if a theme is missing a token), tests,
`npm pack --dry-run` on each package, and a check that a changeset exists.

---

## Changing a token

1. Edit the JSON in `packages/tokens/tokens/`:
   - `shared/*.json`: the same in every app (font, sizes, spacing, radius, shadows, motion).
   - `themes/<app>.json`: colours. Every theme must define the same names; the build fails otherwise.
2. `npm run build` and check `preview.html`. If you change a colour, re-check contrast against the pairs in
   the [Phase 0 spec](docs/phase-0-spec.md).
3. `npm run changeset` and pick the bump:

   | Change | Bump |
   |---|---|
   | Rename or remove a token | **major** |
   | Add a token | **minor** |
   | Change a value | **patch** |

4. Open a PR.

---

## Releasing

Releases are automated with [Changesets](https://github.com/changesets/changesets) and
[release.yml](.github/workflows/release.yml):

1. A PR with a changeset merges into `main`.
2. The workflow opens (or updates) a **Version packages** PR that bumps versions and writes the changelogs.
3. Merging that PR publishes the new versions to GitHub Packages and creates a GitHub release per package.

Nothing is published until step 3, so several changes can go out together. Changelogs:
[tokens](packages/tokens/CHANGELOG.md) · [ui](packages/ui/CHANGELOG.md) ·
[design-lint](packages/lint/CHANGELOG.md).

**One-time repo setting:** Settings → Actions → General → Workflow permissions → *Allow GitHub Actions to
create and approve pull requests*.

---

## Repository layout

```
packages/
  tokens/            DTCG token JSON, Style Dictionary build (build.js), preview.html
  ui/
    src/components/  React components
    preview/         Vite playground
    test/            Vitest + Testing Library + axe, plus package export tests
  lint/              ESLint rule and Stylelint config, with tests
docs/                Specs and phase plans
.changeset/          Pending release notes
.github/workflows/   ci.yml (pull requests), release.yml (main)
```

---

## Docs

- [Phase 0 spec](docs/phase-0-spec.md): the values and the reasons behind them, including contrast pairs.
- [Phase 3 plan](docs/phase-3-plan.md): how the shared component package was built.
- Package guides: [tokens](packages/tokens/README.md) · [ui](packages/ui/README.md) ·
  [design-lint](packages/lint/README.md).
