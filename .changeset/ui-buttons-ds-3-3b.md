---
"@aakashiic/ui": minor
---

Restyle `Button` to the tokens (DS-3.3b), in Data Vault's look: `rounded-lg`, `text-sm` medium, token heights (40px default, 32px `sm`, 48px `lg`) and token colours only.

- **Variants:** `default`, `secondary`, `outline`, `ghost`, `muted`, `link`, `destructive`, `success`, `warning`.
  - **Removed:** V-Estate's app-specific `grey`, `edit`, `delete`, `block` and `green` (they used V-Estate-only CSS variables).
  - **Default variant** is now `default` (primary), not `grey`.
  - `secondary` is now the navy/charcoal fill; the old light-grey `secondary` is `muted`.
- **Status variants** (`destructive`, `success`, `warning`) are tinted backgrounds with the strong status colour as text. White text on status colours fails AA.
- **`link`** uses body-coloured text with a brand-coloured underline, so it passes contrast in V-Estate's gold theme too.
- **New `icon-sm` size** (32px square).
- **`sm`** uses `text-xs` and no longer forces `w-fit`.
- **New `loading` prop:** shows a spinner, disables the button and sets `aria-busy`.
- **Alert dialog:** Action and Cancel now render as the primary and outline buttons in every app.

The README has a V-Estate migration table (from its variant names to these).
