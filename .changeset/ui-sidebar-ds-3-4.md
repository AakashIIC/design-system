---
"@aakashiic/ui": minor
---

Add the app shell sidebar (DS-3.4): `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarLabel`, `SidebarNav`, `SidebarNavItem`, `SidebarTrigger`, `SidebarCollapseButton` and `useSidebar`. Built from Data Vault's sidebar and V-Estate's `MainLayout`, using only tokens.

- **Desktop (md and up):** a fixed 256px sidebar or an 80px icon rail. `defaultCollapsed`, or controlled with `collapsed` / `onCollapsedChange`. `SidebarInset` pads the page to match.
  - `expandOnHover` gives Data Vault's rail that widens over the page. It also widens on keyboard focus; Data Vault's only widened on hover.
  - Without it, the rail shows each label as a tooltip on hover or keyboard focus.
- **Phones:** the same content in a left `Sheet` (focus trap, Escape, scrim), opened by `SidebarTrigger`. It closes when an item is followed.
- **Items are links:**
  - `asChild` takes the app's router link (`<Link href="/" />`).
  - `active` sets `aria-current="page"` and a `primary-soft`, semibold style.
  - Labels stay in the accessibility tree on the rail.
  - `badge` adds a count that's read as part of the name.
- Routes, roles and feature flags stay in the app.
- New preview page: `preview/shell.html`.
