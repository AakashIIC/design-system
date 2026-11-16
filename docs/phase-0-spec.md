# Phase 0 spec — shared design tokens

Status: **draft for sign-off** · 16 Nov 2026
Implements Phase 0 of *Design System Unification — Plan* (11 Nov 2026). The values live in
[`packages/tokens/tokens/`](../packages/tokens/tokens); this page explains them.

## Decisions

| Question | Decision |
|---|---|
| Source of truth | **Data Vault's code**: no Figma file. Values come from what Data Vault actually uses (counted in `dv/src`), not only what its `globals.css` declares. VRetail's Figma-derived `--vr-*` set fills gaps where Data Vault has nothing on-palette. |
| Shared font | **Geist** for all apps, in the shared layer. VRetail and V-Estate switch from DM Sans. |
| Border colour | **`#E9EDF7`** (Data Vault + VRetail). V-Estate keeps its own `#E4E6E7`. |
| Status colours | **Tailwind defaults** for every app: success `#22C55E`, warning `#F59E0B`, danger `#EF4444`, info `#3B82F6`. |
| Colour per app | Each app keeps its scheme. Data Vault and VRetail share the indigo theme; V-Estate keeps its gold theme in light and dark. |

## Shared layer (same in every app)

Names match Tailwind's default scale where the value matches, so most existing Tailwind classes render the same after migration.

| Group | Tokens | Evidence from Data Vault |
|---|---|---|
| Type size | xs 12 · sm 14 · base 16 · lg 18 · xl 20 · 2xl 24 · 3xl 30 (px) | `text-sm` 632 uses, `text-xs` 234, `text-base` 106, `text-xl` 101, `text-lg` 90. 13px and 32px were removed; 12px is the minimum (replaces ~100 uses of 8–11px). |
| Weight | regular 400 · medium 500 · semibold 600 · bold 700 | semibold 465, bold 321, medium 320. |
| Radius | md 6 · lg 8 · xl 12 · 2xl 16 · full (px) | `rounded-lg` 369, `rounded-xl` 340, `rounded-2xl` 129, `rounded-md` 119. Nothing used 10px. |
| Control height | sm 32 · md 40 · lg 48 (px) | `h-8` 116, `h-10` 57, `h-12` 21. VRetail moves 38 → 40. |
| Spacing | 4px grid: 1, 2, 3, 4, 5, 6, 8, 10, 12 | Matches Data Vault and `--vr-space-*`. |
| Shadow | sm (cards, controls) · md (dropdowns) · lg (raised panels) | `shadow-sm` 222 uses; lg is Data Vault's own `shadow-primary`. Replaces the one-off `shadow-[…]` values. |
| Motion | duration fast 150ms · base 200ms · ease standard | From VRetail (Data Vault defines none). |

## Colour themes

The same 17 semantic names exist in every theme (the build fails if one is missing). Components use only these names.

| Token | Data Vault / VRetail | V-Estate light | V-Estate dark |
|---|---|---|---|
| primary | `#4434DD` | `#A88A5A` | `#D2B589` |
| primary-hover | `#3A2BC4` | `#B1966A` | `#C0A67E` |
| primary-soft | `#F0EEFF` | `#F6F3EE` | `#2D2B28` |
| on-primary | `#FFFFFF` | `#1B1C1D` ✱ | `#1B1C1D` |
| text | `#2B3674` | `#2B2B2B` | `#F9FBFC` |
| text-muted | `#616E97` ✱ | `#6E6E6E` ✱ | `#A0A0A0` |
| text-subtle (placeholders) | `#8B94B1` ✱ | `#757575` | `#A0A0A0` |
| background | `#F4F7FE` | `#FFFFFF` | `#1B1C1D` |
| surface | `#FFFFFF` | `#FFFFFF` | `#222324` |
| surface-muted | `#EFF3FC` | `#F2F2F2` | `#2A2B2C` |
| border | `#E9EDF7` | `#E4E6E7` | `#333333` |
| input | `#E0E4F2` | `#E4E6E7` | `#333333` |
| ring | `#4434DD` | `#A88A5A` | `#D2B589` |
| success / warning / danger / info | Tailwind defaults (all themes) | | |

Theme selection: `data-app="datavault|vretail|vestate"` on `<html>` (Data Vault when absent); V-Estate dark mode via the `dark` class it already sets, or `data-theme="dark"`.

✱ Changed from the app's current value to meet contrast; see below.

## Accessibility decisions (agreed 16 Nov 2026)

Every theme now passes WCAG 2.2 AA for its text pairs (4.5:1 for text, 3:1 for placeholders and the primary colour as a UI part). The build values were checked against all of: surface, background and surface-muted.

1. **Muted text darkened.** Data Vault / VRetail `#707EAE` → `#616E97` (5.02:1 on white, 4.51:1 on surface-muted). V-Estate `#757575` → `#6E6E6E` (4.55:1 on its `#F2F2F2` fill). The first proposal (`#6875A2`) passed on white only, so it was taken further.
2. **V-Estate buttons use dark text on gold.** `on-primary` is `#1B1C1D` (5.24:1; 6.05:1 on hover). The gold itself is unchanged.
3. **Placeholders darkened.** `#A3AED0` → `#8B94B1` (3.01:1). V-Estate's `#757575` already passed.
4. **Four weights kept** (regular, medium, semibold, bold). The plan asked for 3, but Data Vault uses bold 321 times.
5. **No white text on status colours.** It is below 4.5:1 for all four. Phase 3 components use status colours for icons, borders and tinted backgrounds, or pair them with dark text.

## Effect on existing apps

- **Data Vault and VRetail:** muted grey text gets slightly darker everywhere; placeholders get darker.
- **V-Estate:** primary buttons switch from white to near-black text; muted text is slightly darker.

## Still open (outside this spec)

- Is the central portal built on `@iic/ui` from the start? (Recommended in the plan.)
- Is iiclab.com in scope, and can the repo be shared for an audit?
- How much time can each team give this alongside other work?
- Re-measure usage counts with the final token list (plan risk table).

## Sign-off

| Role | Name | Date |
|---|---|---|
| Plan owner | | |
| Data Vault | | |
| VRetail | | |
| V-Estate | | |
