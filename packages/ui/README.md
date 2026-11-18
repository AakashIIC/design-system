# @aakashiic/ui

Shared React components for **Data Vault**, **V-Estate** and the central portal: Radix primitives styled with
Tailwind CSS v4. VRetail is Angular and uses only [`@aakashiic/tokens`](../tokens).

> **Status: Phase 3 in progress.** These are V-Estate's 29 generic shadcn components, restyled to the tokens
> group by group in DS-3.3 (see the [Phase 3 plan](../../docs/phase-3-plan.md)):
>
> | Group | Components | Status |
> |---|---|---|
> | DS-3.3a overlays | dialog, alert-dialog, sheet, popover, tooltip | **Tokens only** |
> | DS-3.3b buttons | button | **Tokens only** |
> | DS-3.3c form controls | input, textarea, select, checkbox, radio-group, switch, slider, label, form | shadcn names |
> | DS-3.3d navigation | tabs, dropdown-menu, command | shadcn names |
> | DS-3.3e data display | table, badge, card, progress, skeleton, separator, scroll-area | shadcn names |
>
> Components still on shadcn names need the app to define them: read [section 3](#3-colours-until-ds-33).

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
| `@aakashiic/tokens` | 0.5.0 or later (adds `overlay`) | every restyled component (see the status table) |
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

**Restyled components** (the status table at the top) use only token names (`bg-surface`, `text-text-muted`,
`bg-overlay`, …), so they need `@aakashiic/tokens` set up as in [section 2](#2-set-up-your-app) and nothing
else. That includes V-Estate: import the tokens with `data-app="vestate"` before upgrading to a release with
restyled components, or those components lose their colours.

The **other components** still use **shadcn's colour names**, which the tokens don't define:

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

### Button

```tsx
<Button>Save</Button>                                     {/* primary, 40px */}
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive" loading={isDeleting}>Delete</Button>
<Button size="icon" variant="ghost" aria-label="Edit"><Pencil /></Button>
<Button asChild variant="link"><Link href="/reports">Reports</Link></Button>
```

| Variant | Use for | Looks like |
|---|---|---|
| `default` | The main action | Brand fill: indigo (Data Vault, VRetail), gold with dark text (V-Estate) |
| `secondary` | A strong action that isn't the brand one | Navy in Data Vault, charcoal in V-Estate |
| `outline` | Secondary actions; the unselected half of a toggle group | Neutral border on the surface |
| `ghost` | Toolbars, icon buttons | No background until hovered |
| `muted` | A quiet filled button | Neutral tint |
| `link` | An action that should read as a link | Body text with a brand-coloured underline |
| `destructive`, `success`, `warning` | Delete / approve / block | Tinted background with the strong status colour as text |

Sizes: `default` 40px, `sm` 32px, `lg` 48px, `icon` 40px square, `icon-sm` 32px square (icon buttons need an
`aria-label`). `loading` shows a spinner, disables the button and sets `aria-busy`.

Like HTML, a `Button` without `type` inside a `<form>` submits it. Pass `type="button"` for buttons that
shouldn't. (Data Vault's own button defaults to `type="button"`, so its form buttons already say `submit`.)

To make an alert dialog's action destructive, pass the variant's classes:
`<AlertDialogAction className={buttonVariants({ variant: 'destructive' })}>`.

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
- **`Button`** has a different variant set and **defaults to `default` (primary)**; V-Estate's copy defaulted
  to `grey`. Measured on `staging` (18 Nov 2026, 330 buttons):

  | V-Estate today | Uses | Change to |
  |---|---|---|
  | no `variant` (was `grey`) | 56 | `variant="secondary"` (same charcoal look), or nothing to make it primary |
  | `grey` | 4 | `secondary` |
  | `secondary` (light grey), `edit` | 5, 9 | `muted` |
  | `delete` | 6 | `destructive` (now the tinted style; was solid red for `destructive`) |
  | `destructive` | 8 | `destructive` |
  | `green`, `block` | 1, 1 | `success`, `warning` |
  | `default`, `outline`, `ghost`, `link` | ~28, ~150, 91, 2 | unchanged |

  Sizes: `lg` is now 48px (was 44px), and `sm` no longer forces `w-fit`. Add `w-fit` where a small button
  sits in a column and shouldn't stretch.

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
npm run typecheck  # src, tests and the preview
npm test           # build first (and build the tokens): see below
npm run preview    # http://localhost:5180: restyled components in every app theme
```

`npm test` runs two suites:

- **`node --test`** (`test/*.test.js`): package checks against `dist/`: exports, a real Tailwind v4 compile of
  `styles.css`, and **tokens-only**: every restyled file may use only token colours, radii, shadows and
  motion, and no `dark:`. Add a component to `RESTYLED` in `test/tokens-only.test.js` when its group lands.
- **Vitest** (`test/components/*.test.tsx`, jsdom): accessibility and behaviour per component: roles and
  accessible names, focus moving in and back out, Escape, focus trapping, and an axe-core scan
  (colour contrast excluded: jsdom has no CSS; the token pairs are contrast-checked in the tokens package).

### Restyling a group (DS-3.3)

1. Replace shadcn names with token names; check the [tokens README](../tokens/README.md#4-use-the-tokens) for
   which one fits. Shared overlay classes live in `src/lib/overlay.ts`.
2. Add the files to `RESTYLED`, write the Vitest file for the group, and add a section to `preview/main.tsx`.
3. Check every theme in the preview, at desktop and phone width.
4. Changeset: **minor** (it changes how the components look in every app that upgrades), listing what changed.
