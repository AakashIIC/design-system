---
"@aakashiic/ui": minor
---

Add the app shell header (DS-3.5): `AppHeader`, `AppHeaderBack`, `AppHeaderTitle`, `AppHeaderActions`, `AppHeaderEnd` and `SkipToContent`. Built from Data Vault's `HeroIntro` and V-Estate's `MainLayout` header, using only tokens.

- **`AppHeader`:** sticky, with no measured spacer (Data Vault's is `fixed` with one). Once the page scrolls it gains the `surface` background, a border and `shadow-sm`.
- **`AppHeaderTitle`:** the page's `<h1>` (`asChild` for another level). V-Estate's title wasn't a heading.
- **`AppHeaderBack`:** a real button named "Go back", or the router's link with `asChild`. V-Estate's was a `<div onClick>`, unreachable by keyboard and unnamed.
- **`AppHeaderActions`:** filters and page actions. Inline on desktop, a full-width row on phones; with `mobileToggleLabel` the row hides behind a toggle with `aria-expanded`, like Data Vault's "Show filters".
- **`AppHeaderEnd`:** notifications, theme toggle and the like, kept in the top row on every screen.
- **`SkipToContent`:** a "Skip to content" link shown only on focus, so keyboard users can skip the sidebar.
- `preview/shell.html` now shows the header with the sidebar.
