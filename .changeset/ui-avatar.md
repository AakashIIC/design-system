---
"@aakashiic/ui": minor
---

Add `Avatar`, `AvatarImage`, and `AvatarFallback` components for Data Vault DS-2.5 migration:

- **`Avatar`**: Accessible user and agent avatar primitive built on `@radix-ui/react-avatar`.
- Supports size variants `sm` (32px), `default` (40px), and `lg` (48px) mapped to token control dimensions.
- `AvatarFallback` uses token surface and text colours (`bg-surface-muted`, `text-text`).
- Standardizes avatar rendering across headers, navigation, and list views, replacing ad-hoc avatar divs in Data Vault.
