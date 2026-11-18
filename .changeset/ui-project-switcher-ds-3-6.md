---
"@aakashiic/ui": minor
---

Add the project switcher (DS-3.6): `ProjectSwitcher` and `formatProjectName`, on their own path `@aakashiic/ui/project-switcher` (they need `cmdk`). A searchable picker in a popover, built from Data Vault's `ProjectListDropdown` and V-Estate's `ProjectBox` on `Popover` + `Command`, using only tokens.

- **Value:** the selected project id, or `null` for "all projects" (`allLabel`; `null` removes that row).
- **Search:** a substring match on names, cleared each time the switcher opens.
- **Display:** `showCount` ("N projects", V-Estate), `meta` per row (Data Vault's score), and `formatName` (`formatProjectName` is Data Vault's title-casing, "L&t" → "L&T").
- **Pins:** a "Pinned" group, toggled with **Alt+P** on the highlighted row (plus a mouse-only icon), instead of Data Vault's `role="button"` nested inside an option.
- **Accessibility:**
  - The trigger reads "Project: Acme", and the popover and search are named.
  - The highlighted row is announced (`aria-activedescendant`), and the current project is `aria-checked`.
  - Rows aren't Tab stops, and each instance has its own ids (Data Vault hard-coded `project-list-options`).
- On phones the popover keeps 12px from the screen edges.
