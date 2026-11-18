---
"@aakashiic/ui": minor
---

New package: shared React components (DS-3.1). Scaffolded from V-Estate's 29 generic shadcn components (Radix + Tailwind v4), not yet restyled to the tokens. `Calendar` takes `startMonth`/`endMonth` instead of reading V-Estate's store, and `Toaster` takes `theme` instead of using `next-themes`. calendar, chart, command, drawer and form are imported from their own paths because they need an optional peer dependency.
