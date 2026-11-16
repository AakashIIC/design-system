# Changesets

Every change to a published package needs a changeset: a small file that says which package changed,
how big the change is, and one line for the changelog.

    npm run changeset

Pick the bump by what an app has to do after upgrading:

| Bump | When | Token examples |
|---|---|---|
| **patch** | Nothing visible to code; values may shift slightly | Fix a colour value, adjust a shadow |
| **minor** | New things, nothing removed | Add a token, add a theme |
| **major** | Something apps use is renamed or removed | Rename `--ds-color-text-muted`, delete a radius step |

Commit the changeset with your change. When it reaches `main`, the release workflow opens a
"Version packages" PR that bumps versions and writes `CHANGELOG.md`; merging that PR publishes.
