---
"@aakashiic/ui": minor
---

Restyle the data-display components to the tokens (DS-3.3e): table, badge, card, progress, skeleton, separator and scroll-area now use only token colours, radii, sizes and motion. With this, all 25 components in the DS-3.3 groups are tokens-only. Calendar, chart, drawer and sonner aren't in a group yet and still use shadcn colour names.

- **Card:** Data Vault's card (`rounded-2xl`, `border-border`, `bg-surface`, no shadow). V-Estate's copy forced `rounded-2xl! border! shadow-none!`, which silently ignored `className` overrides; they now apply. `CardTitle` is `text-lg`.
- **Table:**
  - A `surface-muted` header with small uppercase `text-text-muted` labels, `border-border` rows (a bare `border` is `currentColor` in Tailwind v4), a soft row hover, and `primary-soft` for `data-state="selected"`.
  - The header no longer reads V-Estate's `--custom-bg`.
- **Badge:**
  - Now a `<span>`, so it's valid inside a paragraph.
  - New status variants `success`, `warning`, `danger` and `info` (soft background + strong text). `destructive` is the same as `danger`.
  - No hover colour, since it isn't interactive.
- **Progress:**
  - 8px `bg-primary` bar on a `surface-muted` track (was a 16px hard-coded gold gradient).
  - Now fills as a share of `max` (it assumed 100).
  - New `indicatorClassName` for status colours. Motion is token-timed and off under reduced motion.
- **Skeleton:** `bg-surface-muted`, hidden from screen readers, and no pulse under reduced motion.
- **ScrollArea:**
  - The thumb is `text-subtle`, which meets 3:1 against the surface (was the faint `border`).
  - The viewport shows a focus ring for keyboard scrolling.
- **Separator:** unchanged look (`bg-border`), now covered by the tokens-only check.
