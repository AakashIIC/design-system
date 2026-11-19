---
"@aakashiic/ui": patch
---

Let apps raise the overlays above their own chrome with `--ds-z-overlay`.

Everything the package portals to `<body>` (dialog, alert-dialog, sheet and drawer with their backdrops, plus popover, tooltip, dropdown-menu and select) now takes its `z-index` from `--ds-z-overlay`. Without the variable nothing changes: `50`, and `100` for popovers.

Data Vault's fixed headers use `z-1000`, so they showed above the dialogs and their backdrop. It sets `--ds-z-overlay: 10000`. See "Stacking" in the README.

Dialog, alert-dialog and sheet also return focus to whatever was focused when they opened. Radix sends focus back to `<DialogTrigger>`, so a dialog opened from state (`open={isOpen}`, no trigger) dropped focus to `<body>` when it closed. A caller's own `onOpenAutoFocus`/`onCloseAutoFocus` still runs first, and calling `preventDefault()` in it keeps control.
