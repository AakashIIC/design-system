# Phase 3 plan: shared React components (`@aakashiic/ui`)

Status: **in progress** · agreed 18 Nov 2026
Revised from the original Phase 3 list after checking V-Estate's shadcn components and Data Vault's DaisyUI usage.

## Scope

- **Package:** `@aakashiic/ui` on GitHub Packages, versioned and released like `@aakashiic/tokens` (Changesets).
- **Stack:** React 19, Tailwind CSS v4, Radix primitives, `class-variance-authority`, `tailwind-merge`, `lucide-react`.
- **Consumers:** Data Vault, V-Estate and the central portal (all React/Next.js). **VRetail is Angular and stays tokens-only.**
- **Styling rule:** colours, sizes, radii and shadows come only from `@aakashiic/tokens`. No shadcn colour names (`muted-foreground`, `destructive`, `foreground`, …), no `dark:` classes, and no raw values. shadcn's `accent` (a hover background) is not our `accent` (brand purple).
- **Reference look:** Data Vault.

## Tickets

| # | Ticket | Notes |
|---|---|---|
| DS-3.0 | Status tints and a chart palette in the tokens | Unblocks the 238 colours deferred in Data Vault Phase 2 |
| DS-3.1 | Scaffold `@aakashiic/ui` from V-Estate's ~30 generic shadcn components | Source: `inkincaps/admin.vestate.io` branch `staging`, `src/components/ui`. Leave out the app-specific ones (`AnimateIn`, `AnimatedNumber`, `LoadingScreen`, `dark-mode`, `export-data`, `color-picker`, `icon-picker`, `icons-data`, `tag-input`, `datetime-picker`, `loading-btn`, `tooltip-wrapper`) and the Radix `toast`/`toaster`/`use-toast` (sonner replaces them) |
| DS-3.2 | Publishing and versioning like the tokens | Includes consumer setup: Tailwind v4 needs `@source` pointing at the package, or the classes are never generated |
| DS-3.3a | Restyle: overlays | dialog, alert-dialog, sheet, popover, tooltip |
| DS-3.3b | Restyle: buttons | button and its variants |
| DS-3.3c | Restyle: form controls | input, textarea, select, checkbox, radio-group, switch, slider, label, form |
| DS-3.3d | Restyle: navigation | tabs, dropdown-menu, command |
| DS-3.3e | Restyle: data display | table, badge, card, progress, skeleton, separator, scroll-area |
| DS-3.3f | Restyle: the rest | calendar, chart, drawer, sonner. Added after DS-3.3e: these four were in no group, so they still used shadcn colour names |
| DS-3.4 | App shell sidebar | Start from Data Vault's `AppNavigation` |
| DS-3.5 | App shell header | Start from Data Vault's header |
| DS-3.6 | Project switcher | Start from Data Vault's `ProjectListDropdown` |
| DS-3.7 | App switcher for the central portal | |

Each DS-3.3 group ships with accessibility and behaviour tests and a preview page, and is released on its own so apps can adopt it.

## Data Vault follow-up (on `chore/design-system`)

- **DS-2.5:** replace DaisyUI and inline-styled controls with `@aakashiic/ui`, one group at a time, in order of usage: modal/dialog, tooltip, loading and skeleton, button, tabs, dropdown, select, checkbox, toggle, badge, progress, table.
- **DS-2.6:** remove the DaisyUI dependency once nothing uses it.
