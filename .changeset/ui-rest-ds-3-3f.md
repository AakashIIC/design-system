---
"@aakashiic/ui": minor
---

Restyle calendar, chart, drawer and sonner to the tokens (DS-3.3f). These four weren't in a DS-3.3 group, so they still used shadcn colour names. All 29 components now use only token names, and apps no longer need to define shadcn's colours.

- **Calendar:**
  - Selected days and range ends are `bg-primary` / `text-on-primary`. The middle of a range is `primary-soft` (was shadcn's `accent`, which is the brand purple in the tokens). Today is bold on `surface-muted`.
  - Weekday labels are `text-xs text-text-muted`.
- **Chart:**
  - Tooltip and legend swatches now show their colour. They used `bg-[--color-bg]`, which Tailwind v4 compiles to an invalid `background-color: --color-bg`; now `bg-(--color-bg)`.
  - The tooltip shows zero values (`item.value && …` hid them).
  - The tooltip uses the token surface, border and `shadow-lg`, and axis text is `text-muted`.
  - A config `theme.dark` colour applies under `.dark` or `data-theme="dark"`, like the tokens (was `.dark` only).
- **Drawer:** the dialogs' `overlay` scrim, a `rounded-t-2xl` `bg-surface` panel, a decorative `text-subtle` drag handle, and the overlay title and description styles.
- **Toaster:**
  - Sets sonner's colour variables (`--normal-*`, `--success-*`, `--error-*`, …) to the tokens, so plain and `richColors` toasts follow the theme. Status toasts are soft background + strong text.
  - Sonner's own description colour (`#3f3f3f`) beat V-Estate's shadcn classes; descriptions are now `text-muted` and the action button is primary.
  - An app's `style` and `toastOptions.classNames` are merged with these instead of replacing them.
