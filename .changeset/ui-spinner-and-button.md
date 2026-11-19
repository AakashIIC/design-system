---
"@aakashiic/ui": minor
---

Add `Spinner`, and `size="xs"` on `Button`, for Data Vault's DS-2.5 migration:

- **`Spinner`**: a loading spinner in `sm` (16px), `md` (24px, default) and `lg` (32px), token colours only (`text-primary` by default; pass a text colour class to change it). With a `label` (default `"Loading..."`) it is a `role="status"` region with screen-reader text. With `label=""` it is decorative: no role, `aria-hidden`, for use inside an already-labelled control. Replaces DaisyUI `loading-spinner` and raw `animate-spin` markup.
- **`Button`**:
  - `size="xs"` (24px: `h-6 px-2 text-xs rounded-md`), matching DaisyUI `btn-xs`.
  - The `loading` spinner is now a decorative `Spinner`, so the button doesn't contain a nested status region.
  - There is no `primary` variant: the brand fill is `default` (Data Vault's local `variant="primary"` maps to it).
