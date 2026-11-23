# @aakashiic/tokens

Shared design tokens for **Data Vault**, **VRetail** and **V-Estate**: one font, type scale, spacing, radius,
shadows and motion for every app, and a colour theme per app. Values and the reasons behind them are in the
[Phase 0 spec](../../docs/phase-0-spec.md).

- [1. Install](#1-install)
- [2. Set up your app](#2-set-up-your-app) (Next.js + Tailwind v4, or Angular + SCSS)
- [3. Choose a theme](#3-choose-a-theme)
- [4. Use the tokens](#4-use-the-tokens)
- [5. Pin and upgrade versions](#5-pin-and-upgrade-versions)
- [Troubleshooting](#troubleshooting)

---

## 1. Install

The package is private on GitHub Packages, so npm needs to know where to find it and a token to read it.

**a. Get access.** Ask the package owner to give you (or your team) read access to `@aakashiic/tokens`.

**b. Create a token.** GitHub → Settings → Developer settings → Personal access tokens → **Tokens (classic)**
→ tick **`read:packages`** only. (GitHub Packages' npm registry does not accept fine-grained tokens.)
Make it available as an environment variable:

```bash
# macOS/Linux: add to ~/.bashrc or ~/.zshrc
export NPM_TOKEN=ghp_yourtoken
```

```powershell
# Windows
setx NPM_TOKEN ghp_yourtoken
```

**c. Add an `.npmrc` to the app repo** (commit it; it contains no secret, npm reads the token from the environment):

```ini
@aakashiic:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
save-exact=true
```

**d. Install** an exact version (see [section 5](#5-pin-and-upgrade-versions) for why):

```bash
npm install --save-exact @aakashiic/tokens@0.1.0
```

### In CI

Your build needs the same `NPM_TOKEN` variable. Use a token from a shared or bot account, not a person's.

| CI | Where the token goes |
|---|---|
| **AWS CodeBuild** (Data Vault, V-Estate) | Store it in Secrets Manager and map it in `buildspec.yaml`: `env: secrets-manager: NPM_TOKEN: <secret-name>:NPM_TOKEN`. The committed `.npmrc` does the rest. |
| **GitHub Actions** | Repo secret `NPM_TOKEN`, then `env: NPM_TOKEN: ${{ secrets.NPM_TOKEN }}` on the install step. |
| **Amplify / Vercel** | Add `NPM_TOKEN` as an environment variable in the project settings. |

---

## 2. Set up your app

The package has three files. Every app needs `tokens.css`; then add the one for your stack.

| Import | Contains | Needed by |
|---|---|---|
| `@aakashiic/tokens/tokens.css` | All values as CSS variables (`--ds-*`), one block per theme | Every app |
| `@aakashiic/tokens/tailwind.css` | Tailwind v4 `@theme` that maps utilities to the variables | Data Vault, V-Estate, central portal |
| `@aakashiic/tokens/scss` | SCSS variables (`$ds-*`) that point to the variables | VRetail |

### Next.js + Tailwind v4 (Data Vault, V-Estate)

**Global CSS** (`src/app/globals.css`):

```css
@import "tailwindcss";
@import "@aakashiic/tokens/tokens.css";
@import "@aakashiic/tokens/tailwind.css";
```

If the app already defines the same names in its own `@theme` (shadcn's `--color-primary`, Data Vault's
`--font-sans`), remove them, or the app's value can win over the token.

**Font.** `next/font` renames the font it loads, so point its variable at the token instead of the name "Geist".
Put it on `<body>` together with `font-sans`:

```tsx
// src/app/layout.tsx
import { Geist } from 'next/font/google';

const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--ds-font-family-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-app="datavault">            {/* see section 3 */}
      <body className={`${geist.variable} font-sans`}>{children}</body>
    </html>
  );
}
```

> Data Vault today uses `variable: "--font-sans"`, and V-Estate loads DM Sans: change both to the above.

### Angular + SCSS (VRetail)

**Global CSS** (`angular.json` → `build.options.styles`). Add the tokens as the first entry:

```json
"styles": [
  "node_modules/@aakashiic/tokens/dist/css/tokens.css",
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
]
```

**SCSS variables** in any `.scss` file. VRetail already has `"includePaths": ["."]`, so this path resolves:

```scss
@use 'node_modules/@aakashiic/tokens/dist/scss/tokens' as ds;

.card { padding: ds.$ds-spacing-4; border-radius: ds.$ds-radius-xl; color: ds.$ds-color-text; }
```

(With Sass's Node package importer enabled you can write `@use 'pkg:@aakashiic/tokens/scss' as ds;` instead.)

The `$ds-*` variables are `var(--ds-*)` references, so they work in plain properties but **not** in Sass colour
functions such as `darken()` or Angular Material's palette functions. Map Material through its
`mat.*-overrides()` mixins with the CSS variables instead.

**Font** (`src/index.html`):

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

---

## 3. Choose a theme

Set **one** attribute on `<html>`. Only colours change between themes; type, spacing, radius and shadows are the same everywhere.

| App | Attribute | Colours |
|---|---|---|
| Data Vault | `data-app="datavault"` | Indigo (the default: used when no attribute is set) |
| VRetail | `data-app="vretail"` | Indigo |
| V-Estate | `data-app="vestate"` | Gold, with a dark theme |
| Data Vault pages inside V-Estate | `data-app="datavault"` on a wrapper element | Indigo inside, gold outside |
| iiclab (Ink In Caps site) | `data-app="iiclab"` | Lime on off-white, with a dark theme for dark sections. Also overrides the fonts: Anek Devanagari body, Deutschlander display |

Where to put it:

- **Next.js:** `<html lang="en" data-app="vestate">` in `src/app/layout.tsx`.
- **Angular:** `<html lang="en" data-app="vretail">` in `src/index.html`.

**V-Estate dark mode** turns on when `<html>` also has the `dark` class (what `next-themes` with `attribute="class"`
already sets) or `data-theme="dark"`. No other change is needed.

**iiclab dark sections** use the same rule on the section itself: `<section data-app="iiclab" data-theme="dark">`.
Inside it, `--ds-color-background` is the dark ink and `--ds-color-text` is white. The lime `primary` is a fill
colour on the light theme (1.04:1 on the background), so use it as text or a border only inside dark sections.

**Themes can be nested.** `data-app` works on any element, so a section can use another app's colours:

```tsx
<section data-app="datavault">{/* the Data Vault pages inside V-Estate */}</section>
```

---

## 4. Use the tokens

Use the semantic names, never raw values, so the same component renders correctly in every app.
[`@aakashiic/design-lint`](../lint) flags raw colours and arbitrary sizes in new code.

### Colours

| Purpose | Tailwind | CSS / SCSS |
|---|---|---|
| Brand fill (buttons, links) | `bg-primary`, `text-primary` | `--ds-color-primary` |
| Brand hover | `hover:bg-primary-hover` | `--ds-color-primary-hover` |
| Selected / tinted background | `bg-primary-soft` | `--ds-color-primary-soft` |
| Brand gradient end, secondary purple (decorative, not text) | `to-accent`, `bg-accent` | `--ds-color-accent` |
| Text on brand fill | `text-on-primary` | `--ds-color-on-primary` |
| Body text | `text-text` | `--ds-color-text` |
| Secondary text | `text-text-muted` | `--ds-color-text-muted` |
| Placeholders only | `placeholder:text-text-subtle` | `--ds-color-text-subtle` |
| Page background | `bg-background` | `--ds-color-background` |
| Cards, panels | `bg-surface` | `--ds-color-surface` |
| Hover rows, secondary fills | `bg-surface-muted` | `--ds-color-surface-muted` |
| Dividers | `border-border` | `--ds-color-border` |
| Input borders | `border-input` | `--ds-color-input` |
| Focus ring | `ring-ring`, `outline-ring` | `--ds-color-ring` |
| Backdrop behind modals and sheets (already translucent; add `backdrop-blur-sm`) | `bg-overlay` | `--ds-color-overlay` |
| Status (bright: dots, borders, decoration) | `bg-success`, `border-danger`, `bg-warning`, `text-info` | `--ds-color-success` … `-info` |
| Status tinted background | `bg-success-soft`, `bg-warning-soft`, `bg-danger-soft`, `bg-info-soft` | `--ds-color-*-soft` |
| Status text and meaningful icons | `text-success-strong`, `text-warning-strong`, `text-danger-strong`, `text-info-strong` | `--ds-color-*-strong` |
| Chart series | `bg-chart-1` … `bg-chart-6`, `fill-chart-1`, `stroke-chart-2` | `--ds-color-chart-1` … `-6` |

Use the **strong** shade for status text and for icons that carry meaning: it passes AA on white and on its own soft background. The bright shades (`success`, `warning`) are only about 2.2:1 on white, so keep them for decoration, and never put white text on them. `chart-6` is the "no data / remainder" colour. The lighter chart colours are below 3:1 on white, so charts must also have labels or a legend.

**Colours in JavaScript.** Chart.js draws on a canvas and Recharts takes colours as props, so neither can read CSS variables. Import the literal values per theme:

```ts
import { chartColors, colors } from '@aakashiic/tokens';

const series = chartColors.datavault; // ['#4434DD', '#8076EE', '#C2B3FC', '#2B3674', '#958CF0', '#D8DADB']
const error = colors.datavault['danger-strong']; // '#B91C1C'
```

Prefer the CSS variables wherever CSS works. These values don't follow a runtime theme switch, so pass the app's theme name.

### Everything else

| Group | Tailwind | Values | CSS / SCSS |
|---|---|---|---|
| Font size | `text-2xs` `text-xs` `text-sm` `text-base` `text-lg` `text-xl` `text-2xl` `text-3xl`, display `text-4xl` `text-5xl` `text-6xl` | 11 12 14 16 18 20 24 30px; display 36 48 60px (`2xs` only for dense data UI: chart labels, badges, table meta) | `--ds-font-size-*` |
| Font weight | `font-regular` `font-medium` `font-semibold` `font-bold` | 400 500 600 700 | `--ds-font-weight-*` |
| Spacing | `p-1` … `p-12` (also `m-`, `gap-`) | 4px steps: 1 2 3 4 5 6 8 10 12 | `--ds-spacing-*` |
| Control height | `h-control-sm` `h-control-md` `h-control-lg` | 32 40 48px | `--ds-control-height-*` |
| Radius | `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-2xl` `rounded-full` | 4 6 8 12 16px, pill | `--ds-radius-*` |
| Shadow | `shadow-sm` `shadow-md` `shadow-lg` | cards, dropdowns, raised panels | `--ds-shadow-*` |
| Motion | `ease-standard`, `duration-(--ds-motion-duration-fast)` | 150ms / 200ms | `--ds-motion-*` |

SCSS names replace `--` with `$`: `--ds-spacing-4` → `$ds-spacing-4`.

---

## 5. Pin and upgrade versions

Each app pins an **exact** version and upgrades on its own schedule, so a token release can never change an app
by surprise.

**Pin.** `package.json` should show the version with no `^` or `~`:

```json
"dependencies": { "@aakashiic/tokens": "0.1.0" }
```

`save-exact=true` in the `.npmrc` above makes `npm install` do this automatically. Commit `package-lock.json`.

**What the version number tells you** ([semantic versioning](https://semver.org)):

| Bump | Example | What changed | What you do |
|---|---|---|---|
| Patch | 0.1.0 → 0.1.1 | A value was adjusted | Upgrade, check screens |
| Minor | 0.1.0 → 0.2.0 | Tokens or themes added | Upgrade any time |
| Major | 0.x → 1.0.0 | A token was renamed or removed | Read the changelog; update code |

While the version is `0.x`, treat **minor** bumps like major ones: read the changelog first.

**Upgrade one app at a time:**

1. Read [CHANGELOG.md](./CHANGELOG.md) for every version between yours and the new one.
2. `npm install --save-exact @aakashiic/tokens@<new-version>`
3. Check key screens in the app (Data Vault has Playwright screenshots: `npm run test:e2e`).
4. Ship it through the normal staging → live release.

To see what's available: `npm view @aakashiic/tokens versions`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `401 Unauthorized` or `404 Not Found` on install | `NPM_TOKEN` is missing, expired, lacks `read:packages`, or your account has no access to the package. Check `echo $NPM_TOKEN` and the `.npmrc`. |
| Install goes to npmjs.com instead | The `@aakashiic:registry=` line is missing from `.npmrc`. |
| Everything renders in indigo in V-Estate | `data-app="vestate"` is missing on `<html>`. |
| A class like `bg-primary` has no effect | `@aakashiic/tokens/tailwind.css` isn't imported, or `tokens.css` isn't loaded (the class points at a `--ds-*` variable that doesn't exist). |
| An old value still shows (e.g. 13px text) | The app's own `@theme` or CSS overrides the token. Remove the local value. |
| Font falls back to system-ui | Next.js: set `variable: '--ds-font-family-sans'` and add `font-sans` to `<body>`. Angular: add the Geist `<link>`. |
| SCSS `$ds-*` fails in `darken()` / Material palette | They are CSS variables, not Sass colours; see the Angular section. |
| `Can't find stylesheet to import` in SCSS | Use the `node_modules/...` path with `includePaths: ["."]`, or the `pkg:` importer. |
