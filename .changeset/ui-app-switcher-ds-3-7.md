---
"@aakashiic/ui": minor
---

Add the central portal's app switcher (DS-3.7): `AppSwitcher` and `AppLauncher`, with the `AppItem` type. Built from Data Vault's `select-portal` page and portal rail, using only tokens. This completes the Phase 3 app shell.

- **`AppSwitcher`:** a "Switch app" grid button for the header. It opens the apps as tiles in a popover, with the current app `aria-current="page"` and an optional "All workspaces" link (`allAppsHref`).
- **`AppLauncher`:** the "Select your workspace" page, one card per app (icon, category, heading, description, call to action). The current app's card is outlined and reads "Continue in …".
- **Every app is a link,** with `linkAs` for the router. Data Vault's cards were a `<div role="button">` around a second `<button>`, which is nested interactive content.
- **Accessible names:** each launcher card is named by its heading and described by its description.
- **`external` apps** open in a new tab with `rel="noopener noreferrer"` and announce "(opens in a new tab)".
- **`onSelect`** runs before navigation, for analytics (Data Vault's `portal_selected` event).
