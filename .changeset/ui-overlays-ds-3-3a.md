---
"@aakashiic/ui": minor
---

Restyle the overlays to the tokens (DS-3.3a): dialog, alert-dialog, sheet, popover and tooltip now use only token colours, radii, shadows and motion, in the Data Vault look. **Needs `@aakashiic/tokens` 0.5.0 or later set up in the app** (for `bg-overlay`); in V-Estate, import the tokens before upgrading.

- **Backdrop:** `bg-overlay` plus `backdrop-blur-sm` (was `bg-black/80`).
- **Dialog and alert dialog:**
  - `rounded-2xl` panel on `bg-surface` with `shadow-lg`, title `text-xl` semibold, description `text-text-muted`.
  - They fade and zoom in. The old diagonal slide (a Tailwind v3 pattern) is gone.
  - Footers use `gap-2` instead of `space-x-2`, and `AlertDialogCancel` no longer adds its own top margin.
- **Close button** (dialog, sheet): a 32px (`size-control-sm`) target with a `surface-muted` hover and a visible focus ring.
- **Sheet:** `bg-surface` with a `border-border` edge, and it slides in 200ms (was 500ms).
- **Popover:** `rounded-xl`, `bg-surface`, `border-border`, `shadow-md`. It no longer turns every icon inside it `text-primary`.
- **Tooltip:** inverted `bg-text` with `text-surface`, `text-xs` medium, no border.
- **Motion:** every overlay uses `ease-standard` and the token durations.
- **Headers:** dialog and sheet headers reserve `pr-8` so long titles don't run under the close button.

alert-dialog's Action and Cancel still use `buttonVariants`, which is restyled in DS-3.3b.
