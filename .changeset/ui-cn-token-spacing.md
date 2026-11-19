---
"@aakashiic/ui": patch
---

`cn` now understands the token control sizes. tailwind-merge only knew Tailwind's default theme, so `h-control-*`, `size-control-*`, `min-h-control-*` and `w-control-*` were never replaced by a caller's own class: `<Button size="sm" className="h-10">` kept both `h-control-sm` and `h-10`, and the token class won in the CSS (Data Vault found three buttons at the wrong height). The control sizes are now registered as spacing values, so a later `h-8`, `h-auto` or `size-6` replaces them as expected.
