---
"@aakashiic/ui": minor
---

Add `showCloseButton` to `DialogContent` and `SheetContent` (default `true`, as shadcn has it). Pass `false` when the dialog already has its own Close or Cancel button, so there's one control per action. Escape and the backdrop still close it.
