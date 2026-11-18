# @aakashiic/ui

Shared React components for **Data Vault**, **V-Estate** and the central portal: Radix primitives styled with
Tailwind CSS v4. VRetail is Angular and uses only [`@aakashiic/tokens`](../tokens).

> **Status: Phase 3 in progress.** These are V-Estate's 29 generic shadcn components. They still use shadcn
> colour names (`bg-background`, `text-muted-foreground`, `bg-destructive`, …) and are restyled to the tokens
> group by group in DS-3.3 (see the [Phase 3 plan](../../docs/phase-3-plan.md)). Until then, read
> [section 3](#3-colours-until-ds-33) before using them in an app.

- [1. Install](#1-install)
- [2. Set up your app](#2-set-up-your-app)
- [3. Colours until DS-3.3](#3-colours-until-ds-33)
- [4. Use the components](#4-use-the-components)
- [5. Pin and upgrade versions](#5-pin-and-upgrade-versions)
- [Troubleshooting](#troubleshooting)

---

## 1. Install

The package is private on GitHub Packages, like `@aakashiic/tokens`. If the app already installs the tokens,
the `.npmrc` and `NPM_TOKEN` are already set up; otherwise follow
[the tokens install steps](../tokens/README.md#1-install) first (access, token, `.npmrc`, CI).

```bash
npm install --save-exact @aakashiic/ui
```

This installs the latest version and pins it exactly (`npm view @aakashiic/ui versions` lists them).

**Peer dependencies.** The app provides these (Data Vault and V-Estate already have them):

| Package | Version | Needed for |
|---|---|---|
| `react`, `react-dom` | 19 | everything |
| `tailwindcss` | 4.1 or later | everything |
| `lucide-react` | 0.400 or later | icons inside the components |
| `react-day-picker` | 9 | `@aakashiic/ui/calendar` only |
| `recharts` | 2.15 | `@aakashiic/ui/chart` only |
| `cmdk` | 1 | `@aakashiic/ui/command` only |
| `vaul` | 1 | `@aakashiic/ui/drawer` only |
| `react-hook-form` | 7 | `@aakashiic/ui/form` only |

The last five are optional: install one only if you import that component.

---

## 2. Set up your app

Add **one line** to the global CSS (`src/app/globals.css`), after Tailwind and the tokens:

```css
@import "tailwindcss";
@import "@aakashiic/tokens/tokens.css";
@import "@aakashiic/tokens/tailwind.css";
@import "@aakashiic/ui/styles.css";
```

Why it's needed: **Tailwind v4 never scans `node_modules`**, so without it the classes the components use are
never generated and the components render unstyled. `styles.css` does two things:

- `@source` pointing at the package's components, relative to the package itself, so it works however npm
  installs it. You don't need your own `@source` line.
- Imports [`tw-animate-css`](https://github.com/Wombosvideo/tw-animate-css) for the open/close animations
  (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`).

> **V-Estate:** the app lists `tailwindcss-animate` but never loads it (Tailwind v4 needs `@plugin`, and there
> is no `@config`), so its dialogs, popovers and menus don't animate today. They will once `styles.css` is
> imported. Remove `tailwindcss-animate` from `package.json` at the same time.

No `tailwind.config.js`, PostCSS change or Next.js `transpilePackages` is needed: the package ships plain
JavaScript with `'use client'` already on the components that need it.

---

## 3. Colours until DS-3.3

The components still use **shadcn's colour names**, which the tokens don't define:

`background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary-foreground`,
`secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`,
`destructive-foreground`.

- **V-Estate** already defines all of these in its `@theme`, so the components look the same as its own copies.
- **Data Vault and the central portal** don't, so those classes produce no colour. Wait for the DS-3.3 group
  you need before adopting it (Data Vault's DS-2.5 is planned that way).

Careful with `accent`: in shadcn it's a hover background; in the tokens it's the brand purple. An app that
imports the tokens' `tailwind.css` after its own `@theme` gets the purple on hovers. DS-3.3 removes this
clash.

---

## 4. Use the components

Most components come from the package root:

```tsx
import { Button, Dialog, DialogContent, DialogTrigger, Toaster, cn } from '@aakashiic/ui';
```

alert-dialog, badge, button, card, checkbox, dialog, dropdown-menu, input, label, popover, progress,
radio-group, scroll-area, select, separator, sheet, skeleton, slider, sonner (`Toaster`), switch, table, tabs,
textarea, tooltip, and `cn`.

The five that need an optional peer dependency are only on their own path, so an app without that library can
still import the root:

```tsx
import { Calendar } from '@aakashiic/ui/calendar';
import { ChartContainer } from '@aakashiic/ui/chart';
import { Command } from '@aakashiic/ui/command';
import { Drawer } from '@aakashiic/ui/drawer';
import { Form, FormField } from '@aakashiic/ui/form';
```

Every component also has its own path (`@aakashiic/ui/button`), and `cn` is at `@aakashiic/ui/utils`.

### Differences from V-Estate's own copies

Moving V-Estate from `@/components/ui/*` to this package (Phase 4) is a find-and-replace on the import path,
except for:

- **`Calendar`** no longer reads the project's creation date from the Redux store. Pass the month range
  yourself, or the dropdowns show react-day-picker's default range:
  ```tsx
  const createdAt = useAppSelector((s) => s.user.projectCreatedAt);
  <Calendar
    startMonth={createdAt ? new Date(createdAt) : new Date(2023, 0, 1)}
    endMonth={new Date(new Date().getFullYear(), 11, 1)}
  />
  ```
- **`Toaster`** no longer imports `next-themes`. Pass the theme:
  ```tsx
  const { resolvedTheme } = useTheme();
  <Toaster theme={resolvedTheme as 'light' | 'dark'} />
  ```

---

## 5. Pin and upgrade versions

Same rules as the tokens ([details](../tokens/README.md#5-pin-and-upgrade-versions)): pin an **exact**
version, upgrade one app at a time, read [CHANGELOG.md](./CHANGELOG.md) first, and while the version is `0.x`
treat a minor bump like a major one.

The DS-3.3 releases restyle one group of components each. Each one changes how those components look in every
app that upgrades, so check the screens that use them.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Components render unstyled (no padding, borders or layout) | `@import "@aakashiic/ui/styles.css";` is missing from the global CSS. |
| Layout is right but colours are missing | The app doesn't define shadcn's colour names; see [section 3](#3-colours-until-ds-33). |
| Dialogs and menus appear without animation | `styles.css` isn't imported (it brings `tw-animate-css`). |
| Hover backgrounds turn purple | The tokens' `accent` overrides shadcn's; see [section 3](#3-colours-until-ds-33). |
| `Module not found: Can't resolve 'recharts'` (or `cmdk`, `vaul`, …) | Install the optional peer dependency for that component. |
| `401` / `404` on install | See the [tokens troubleshooting](../tokens/README.md#troubleshooting). |

## Working on this package

```bash
npm run build      # tsc → dist/ (one file per component, 'use client' kept)
npm run typecheck
npm test           # against dist/, so build first: exports, and a real Tailwind v4 compile of styles.css
```
