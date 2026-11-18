# @aakashiic/ui

Shared React components for **Data Vault**, **V-Estate** and the central portal: Radix primitives styled with
Tailwind CSS v4. VRetail is Angular and uses only [`@aakashiic/tokens`](../tokens).

> **Status: DS-3.1 scaffold.** These are V-Estate's 29 generic shadcn components, copied as they are. They
> still use shadcn colour names (`bg-background`, `text-muted-foreground`, `bg-destructive`, …) and are not yet
> restyled to the tokens. That happens group by group in DS-3.3 (see the [Phase 3 plan](../../docs/phase-3-plan.md)).
> App setup (install, Tailwind `@source`) is written up in DS-3.2.

## Components

Import the core components from the package root:

```tsx
import { Button, Dialog, DialogContent, Tooltip, cn } from '@aakashiic/ui';
```

alert-dialog, badge, button, card, checkbox, dialog, dropdown-menu, input, label, popover, progress,
radio-group, scroll-area, select, separator, sheet, skeleton, slider, sonner (`Toaster`), switch, table, tabs,
textarea, tooltip.

Five components need a library your app may not have. They are **not** in the root entry; import them from
their own path and install the library yourself:

| Import | Needs |
|---|---|
| `@aakashiic/ui/calendar` | `react-day-picker` |
| `@aakashiic/ui/chart` | `recharts` |
| `@aakashiic/ui/command` | `cmdk` |
| `@aakashiic/ui/drawer` | `vaul` |
| `@aakashiic/ui/form` | `react-hook-form` |

Every component also has its own path (`@aakashiic/ui/button`), and `cn` is at `@aakashiic/ui/utils`.

## Changes from V-Estate's copies

- **`Calendar`** no longer reads the project start date from V-Estate's Redux store. Pass `startMonth` and
  `endMonth` (react-day-picker props) yourself; V-Estate used its project's creation date and December of the
  current year.
- **`Toaster`** no longer imports `next-themes`. Pass `theme` (`'light' | 'dark' | 'system'`, default
  `'system'`).
- **`Form` and `ScrollArea`** are marked `'use client'`, so they work when imported from a Server Component.

## Working on this package

```bash
npm run build      # tsc → dist/ (one file per component, 'use client' kept)
npm run typecheck
npm test           # smoke tests against dist/ — build first
```

Peer dependencies: `react` and `react-dom` 19, `lucide-react`.
