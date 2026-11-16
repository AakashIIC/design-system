# @aakashiic/tokens

One source of design values (font, sizes, spacing, radius, shadows, colours) for Data Vault, VRetail and V-Estate.

## Edit values
- `tokens/shared/*.json` — same for every app
- `tokens/themes/<app>.json` — colours per app (same names in every file, different values)

Format is DTCG JSON: every value has `$type` and `$value`.

## Build
    npm install      # once, from the repo root
    npm run build    # writes dist/

## Output
| File | Used by | Task |
|---|---|---|
| `dist/css/tokens.css` | all apps | DS-1.2, DS-1.5 |
| `dist/tailwind/theme.css` | Data Vault, V-Estate (Tailwind v4) | DS-1.3 |
| `dist/scss/_tokens.scss` | VRetail (Angular/SCSS) | DS-1.4 |

## Choose the app theme
Put one attribute on `<html>`: `data-app="datavault"`, `"vretail"` or `"vestate"`.
Without the attribute, the Data Vault colours apply (the reference theme).

V-Estate also has a dark theme (`tokens/themes/vestate-dark.json`). It applies when `<html>` has the
`dark` class (what shadcn/next-themes already set) or `data-theme="dark"`.
Every theme file must define the same token names; the build fails otherwise.

## Preview
Open `preview.html` after building and switch apps with the buttons.

## TODO before publishing
- Get sign-off on [the Phase 0 spec](../../docs/phase-0-spec.md), including its contrast fixes.
- Published under the personal scope `@aakashiic` for now. Moving to an org later changes the
  package name, so every app's imports change too (a major version).

## Releasing
See [.changeset/README.md](../../.changeset/README.md): add a changeset with `npm run changeset`;
merging the "Version packages" PR on `main` publishes to GitHub Packages.
