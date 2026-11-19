---
"@aakashiic/ui": minor
---

Add `Spinner` component and enhance `Button` for Data Vault DS-2.5 migration:

- **`Spinner`**: Accessible loading spinner with `role="status"`, screen-reader text (`label`, default `"Loading..."`), and `sm` (16px), `md` (24px, default), `lg` (32px) sizes. Styled with token colors (defaults to `text-primary`, inherits text color when `text-current` or another color class is passed). Replaces DaisyUI `loading-spinner` and raw `animate-spin` markup.
- **`Button` additions**:
  - `variant="primary"` alias for `default` brand fill, matching Data Vault's prop contract without breaking changes.
  - `size="xs"` (24px height, `h-6 px-2 text-xs rounded-md`), matching DaisyUI `btn-xs`.
  - Loading state now uses the shared `Spinner` component with `size="sm"`.
