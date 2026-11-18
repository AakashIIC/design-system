---
"@aakashiic/tokens": minor
---

DS-3.0: status and chart colours.

- Each status gets a soft background (`success-soft`, `warning-soft`, `danger-soft`, `info-soft`) and a strong text colour (`*-strong`). The strong shades pass WCAG AA on white and on their soft background. V-Estate dark uses dark tints with light text.
- New chart series `chart-1` … `chart-6`, taken from Data Vault's chart colours. V-Estate's gold ramp is provisional.
- A JS/TS export for code that can't read CSS variables, such as Chart.js and Recharts: `import { colors, chartColors } from '@aakashiic/tokens'`.
