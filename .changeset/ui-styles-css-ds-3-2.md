---
"@aakashiic/ui": minor
---

Add `@aakashiic/ui/styles.css` (DS-3.2). Import it once in the app's global CSS: it points Tailwind v4's `@source` at the package's components (Tailwind never scans `node_modules`, so without it the component classes are never generated) and brings in `tw-animate-css` for the overlay animations. `tailwindcss` 4.1+ is now a peer dependency. The README covers app setup: install, global CSS, colours until DS-3.3, and moving V-Estate's imports.
