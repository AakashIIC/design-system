---
"@aakashiic/ui": minor
---

Restyle the navigation components to the tokens (DS-3.3d): tabs, dropdown-menu and command now use only token colours, radii, sizes and motion.

- **Tabs:** Data Vault's segmented control. A `surface-muted` track (`rounded-xl`, `h-control-md`) with the active tab raised on `surface` with `shadow-sm`.
- **Menus** (dropdown-menu, command) share the select menu's panel: `rounded-xl`, `bg-surface`, `border-border`, `shadow-md`. The highlighted row is `bg-surface-muted`, checks and radio dots are `text-primary`, and labels and shortcuts are `text-text-muted`.
- **DropdownMenuItem:**
  - New `variant="destructive"` (`text-danger-strong`, `bg-danger-soft` when highlighted).
  - Disabled items are now dimmed (V-Estate's copy had no disabled style).
- **CommandDialog:**
  - New `title` and `description` props (visually hidden, default "Command palette"). The dialog had no name before.
  - The title also names the search input.
- **CommandInput:** keeps `aria-activedescendant` on the highlighted option. cmdk 1.1.1 sets it one step late, so screen readers announced the wrong option or none.
- **CommandItem:** disabled items are dimmed. cmdk sets `data-disabled="false"` on every item, so the style matches `data-[disabled=true]`.
- **CommandSeparator:** hidden from assistive tech. cmdk forces `role="separator"`, which isn't allowed inside the listbox.
