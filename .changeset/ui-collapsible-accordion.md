---
"@aakashiic/ui": minor
---

Add `Accordion` and `Collapsible` components for Data Vault DS-2.5 migration:

- **`Accordion`**: Multi-panel disclosure built on `@radix-ui/react-accordion` with `type="single"` (with `collapsible` option) or `type="multiple"`. Features animated Chevron indicator, smooth height transitions, and keyboard arrow navigation. Replaces DaisyUI `collapse` groups.
- **`Collapsible`**: Single-section disclosure built on `@radix-ui/react-collapsible` for toggleable panels, filter sections, and detail drawers.
- The height animations (`animate-accordion-*`, `animate-collapsible-*`) come from `tw-animate-css`, which `styles.css` already imports; no app CSS change is needed.
