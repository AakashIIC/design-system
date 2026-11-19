---
"@aakashiic/ui": patch
---

Support react-day-picker 10 and recharts 3 alongside 9 and 2, so Data Vault (react-day-picker 10, recharts 3) can install the package next to V-Estate (9 and 2).

- **Peer ranges:** `react-day-picker` is now `^9.9.0 || ^10.0.0` and `recharts` is `^2.15.4 || ^3.0.0`. npm refused to install 0.1.0 in an app with the newer majors, even though both are optional peers.
- **`ChartTooltipContent` and `ChartLegendContent`:** their props are now declared in the package (`ChartTooltipItem`, `ChartLegendItem`) instead of taken from Recharts' Tooltip and Legend props, whose types changed in recharts 3. Use them as before: `<ChartTooltip content={<ChartTooltipContent />} />`.
- **`Calendar`:** the grid's class now goes on `month_grid`. The old `table` key isn't a react-day-picker key in 9 or 10, so that class was never applied.

Typechecked and tested against both react-day-picker 9.9 / recharts 2.15 and react-day-picker 10 / recharts 3.
