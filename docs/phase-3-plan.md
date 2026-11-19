# Phase 3 plan: shared React components (`@aakashiic/ui`)

Status: **done** (DS-3.0–3.7 complete, DS-2.5 package support delivered) · 19 Nov 2026
Revised from the original Phase 3 list after checking V-Estate's shadcn components and Data Vault's DaisyUI usage.

## Scope

- **Package:** `@aakashiic/ui` on GitHub Packages, versioned and released like `@aakashiic/tokens` (Changesets).
- **Stack:** React 19, Tailwind CSS v4, Radix primitives, `class-variance-authority`, `tailwind-merge`, `lucide-react`.
- **Consumers:** Data Vault, V-Estate and the central portal (all React/Next.js). **VRetail is Angular and stays tokens-only.**
- **Styling rule:** colours, sizes, radii and shadows come only from `@aakashiic/tokens`. No shadcn colour names (`muted-foreground`, `destructive`, `foreground`, …), no `dark:` classes, and no raw values. shadcn's `accent` (a hover background) is not our `accent` (brand purple).
- **Reference look:** Data Vault.

## Tickets

| # | Ticket | Status | Notes |
|---|---|---|---|
| DS-3.0 | Status tints and a chart palette in the tokens | Done | Unblocks the 238 colours deferred in Data Vault Phase 2 |
| DS-3.1 | Scaffold `@aakashiic/ui` from V-Estate's ~30 generic shadcn components | Done | Source: `inkincaps/admin.vestate.io` branch `staging`, `src/components/ui`. Leave out the app-specific ones (`AnimateIn`, `AnimatedNumber`, `LoadingScreen`, `dark-mode`, `export-data`, `color-picker`, `icon-picker`, `icons-data`, `tag-input`, `datetime-picker`, `loading-btn`, `tooltip-wrapper`) and the Radix `toast`/`toaster`/`use-toast` (sonner replaces them) |
| DS-3.2 | Publishing and versioning like the tokens | Done | Includes consumer setup: Tailwind v4 needs `@source` pointing at the package, or the classes are never generated |
| DS-3.3a | Restyle: overlays | Done | dialog, alert-dialog, sheet, popover, tooltip |
| DS-3.3b | Restyle: buttons | Done | button and its variants |
| DS-3.3c | Restyle: form controls | Done | input, textarea, select, checkbox, radio-group, switch, slider, label, form |
| DS-3.3d | Restyle: navigation | Done | tabs, dropdown-menu, command |
| DS-3.3e | Restyle: data display | Done | table, badge, card, progress, skeleton, separator, scroll-area |
| DS-3.3f | Restyle: the rest | Done | calendar, chart, drawer, sonner. Added after DS-3.3e: these four were in no group, so they still used shadcn colour names |
| DS-3.4 | App shell sidebar | Done | Start from Data Vault's `AppNavigation` |
| DS-3.5 | App shell header | Done | Start from Data Vault's header |
| DS-3.6 | Project switcher | Done | Start from Data Vault's `ProjectListDropdown` |
| DS-3.7 | App switcher for the central portal | Done | |

Each DS-3.3 group ships with accessibility and behaviour tests and a preview page, and is released on its own so apps can adopt it.

## DS-2.5 package support

Following the comprehensive DS-2.5 gap audit (`docs/ds-2.5-gap-audit.md`), the package provides direct support for all patterns needed to replace DaisyUI and hand-built controls in Data Vault:

- **`Spinner` (`@aakashiic/ui`)**: Standalone accessible loading indicator with `sm`/`md`/`lg` sizes, `label` for screen readers (default "Loading..."), and `role="status"`. Replaces 32+ instances of raw `animate-spin` divs and DaisyUI `loading-spinner` classes. `Button`'s loading state is wired to use it.
- **`Button` additions**: Added `size="xs"` (24px, matching `btn-xs`). No `primary` alias: Data Vault's local `variant="primary"` maps to `default` when it moves to the package Button.
- **`Collapsible` & `Accordion` (`@aakashiic/ui`)**: Built on Radix `@radix-ui/react-collapsible` and `@radix-ui/react-accordion` with token styling and smooth height animations, replacing DaisyUI `collapse` and ad-hoc expand/collapse toggles.
- **`Avatar` (`@aakashiic/ui`)**: Standardized Radix avatar (`Avatar`, `AvatarImage`, `AvatarFallback`) with token surfaces and text colours, unifying user/agent avatar rendering in headers, navigation, and lists.
- **Overlays stacking & focus**: PR #23 `--ds-z-overlay` variable support and focus restoration, plus PR #25 `showCloseButton={false}` option for modals with their own action controls.

## Data Vault follow-up (on `chore/design-system`)

- **DS-2.5:** replace DaisyUI and inline-styled controls with `@aakashiic/ui`, one group at a time, in order of usage: modal/dialog, tooltip, loading and skeleton, button, tabs, dropdown, select, checkbox, toggle, badge, progress, table.
- **DS-2.6:** remove the DaisyUI dependency once nothing uses it.
