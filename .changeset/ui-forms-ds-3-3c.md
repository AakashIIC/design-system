---
"@aakashiic/ui": minor
---

Restyle the form controls to the tokens (DS-3.3c): input, textarea, select, checkbox, radio-group, switch, slider, label and form now use only token colours, radii, sizes and motion.

- **Fields** (input, textarea, select trigger):
  - 40px `h-control-md`, `rounded-lg`, `border-input` on `bg-surface`, `text-text-subtle` placeholders.
  - Focus is a `ring`-coloured border with a 3px soft halo (was an offset ring).
  - `aria-invalid` turns the border `danger`.
- **Select menu:** matches the popover (`rounded-xl`, `bg-surface`, `shadow-md`). The highlighted option is `bg-surface-muted` and the check mark is `text-primary`.
- **Checkbox, radio, switch:** unchecked borders (`text-muted`) and the unchecked switch track (`text-subtle`) now meet 3:1 against the surface (WCAG 1.4.11). The checked state uses the brand colour. The switch is now 44 × 24px with a 20px thumb.
- **Checkbox** shows a dash for `checked="indeterminate"`.
- **Slider:**
  - Renders one thumb per value. V-Estate's copy always rendered one, so range sliders lost their second handle.
  - New `thumbLabels` prop to name each thumb (falls back to `aria-label`, numbered for ranges).
- **Label `required`:** the asterisk is now `text-danger-strong` and hidden from screen readers (they announce the field's own `required`).
- **Form:** label, description and message use `text-danger-strong` and `text-text-muted`.
