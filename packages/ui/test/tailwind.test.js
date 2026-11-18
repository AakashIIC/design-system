// Compiles an app stylesheet with the real Tailwind v4 CLI to check that importing
// `@aakashiic/ui/styles.css` generates the classes the components use (run `npm run build` first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const cliPackage = require.resolve('@tailwindcss/cli/package.json');
const cli = join(dirname(cliPackage), require(cliPackage).bin.tailwindcss);
const fixtures = fileURLToPath(new URL('./fixtures/', import.meta.url));

function compile(fixture) {
  const result = spawnSync(process.execPath, [cli, '--input', join(fixtures, fixture)], {
    cwd: fixtures,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

// Classes taken from the components: layout, a variant, and the overlay animations.
const expected = [
  '.inline-flex',
  '.data-\\[state\\=open\\]\\:animate-in',
  '.data-\\[state\\=closed\\]\\:fade-out-0',
  '.data-\\[state\\=open\\]\\:zoom-in-95',
  '.data-\\[side\\=bottom\\]\\:slide-in-from-top-2',
];

test('importing styles.css generates the component classes', () => {
  const css = compile('app.css');
  for (const selector of expected) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
});

test('without styles.css those classes are not generated (control)', () => {
  const css = compile('no-ui.css');
  for (const selector of expected) {
    assert.ok(!css.includes(selector), `${selector} appeared without the package stylesheet`);
  }
});
