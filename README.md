# Design system

One design system for **Data Vault**, **VRetail** and **V-Estate**: shared type, spacing, radius, shadows and
motion (the Data Vault look), with each app keeping its own colours.

| Package | What it is | Docs |
|---|---|---|
| [`@aakashiic/tokens`](packages/tokens) | Design tokens as CSS variables, a Tailwind v4 theme and SCSS | [How to use it in an app](packages/tokens/README.md) |
| [`@aakashiic/design-lint`](packages/lint) | ESLint + Stylelint rules that flag raw colours and arbitrary sizes in new code | [Set-up](packages/lint/README.md) |
| [`@aakashiic/ui`](packages/ui) | Shared React components (Radix + Tailwind v4). In progress: Phase 3 | [Package README](packages/ui/README.md) |

- **Using the packages in an app?** Start with the [tokens README](packages/tokens/README.md).
- **Why these values?** See the [Phase 0 spec](docs/phase-0-spec.md).

---

## Working on this repo

Requires Node 22+. Installing needs no token (everything here comes from npmjs.com).

```bash
npm install
npm run build     # builds packages/tokens/dist
npm test          # lint-rule tests (ESLint 9 + 10, Stylelint)
```

Preview the tokens in a browser: build, then serve `packages/tokens` (for example
`npx http-server packages/tokens`) and open `preview.html`. Buttons switch app and dark mode.

### Changing a token

1. Edit the JSON in `packages/tokens/tokens/`:
   - `shared/*.json`: the same in every app (font, sizes, spacing, radius, shadows, motion).
   - `themes/<app>.json`: colours. Every theme file must have the same names; the build fails otherwise.
2. `npm run build` and check `preview.html`. If you change a colour, re-check contrast (the spec lists the pairs).
3. `npm run changeset` and pick the bump. Rule of thumb: renaming or removing a token is **major**,
   adding one is **minor**, changing a value is **patch**. See [.changeset/README.md](.changeset/README.md).
4. Open a PR. CI builds, runs the tests, checks the package contents, and fails if there's no changeset.

### Releasing

Fully automated by [.github/workflows/release.yml](.github/workflows/release.yml):

1. A PR with a changeset merges into `main`.
2. The workflow opens (or updates) a **"Version packages"** PR that bumps versions and writes the changelogs.
3. Merging that PR publishes the new versions to GitHub Packages and creates a GitHub release per package.

Nothing is published until step 3, so several changes can go out in one release.

**One-time repo settings** (Settings → Actions → General):
- Workflow permissions: **Allow GitHub Actions to create and approve pull requests** (needed for step 2).

**Giving an app team access** to a package: the package page on GitHub → Package settings →
Manage access → add the people (or, for a GitHub Actions build in another repo, the repository).

### Layout

```
packages/
  tokens/          DTCG token JSON, Style Dictionary build (build.js), preview.html
  lint/            ESLint rule + Stylelint config, with tests
  ui/              React components (src/components), tsc build, smoke tests
docs/              Phase 0 spec, Phase 3 plan
.changeset/        pending release notes
.github/workflows/ ci.yml (PRs), release.yml (main)
```
