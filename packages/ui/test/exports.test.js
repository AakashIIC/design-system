// Smoke test for the built package (run `npm run build` first; CI builds before testing).
// Imports go through the package's own `exports` map, the same way an app resolves them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const componentsDir = new URL('../dist/components/', import.meta.url);
const builtComponents = readdirSync(componentsDir)
  .filter((file) => file.endsWith('.js'))
  .map((file) => file.slice(0, -3));

test('ships the 29 DS-3.1 components plus the app shell (sidebar, header, project switcher)', () => {
  assert.equal(builtComponents.length, 32, builtComponents.join(', '));
  for (const name of ['sidebar', 'app-header', 'project-switcher']) assert.ok(builtComponents.includes(name), name);
});

test('the root entry exports the core components and cn', async () => {
  const ui = await import('@aakashiic/ui');
  for (const name of ['Button', 'buttonVariants', 'Dialog', 'Select', 'Tabs', 'Tooltip', 'Toaster', 'Table', 'SidebarProvider', 'SidebarNavItem', 'useSidebar', 'AppHeader', 'SkipToContent', 'cn']) {
    assert.ok(ui[name], `missing export ${name}`);
  }
});

test('optional-peer components stay out of the root entry', async () => {
  const ui = await import('@aakashiic/ui');
  for (const name of ['Calendar', 'ChartContainer', 'Command', 'Drawer', 'Form', 'ProjectSwitcher']) {
    assert.equal(ui[name], undefined, `${name} should only be importable from its own path`);
  }
});

test('every component loads from its own path', async () => {
  for (const name of builtComponents) {
    const mod = await import(`@aakashiic/ui/${name}`);
    assert.ok(Object.keys(mod).length > 0, `${name} exports nothing`);
  }
});

test('no app-specific imports leaked into the package', () => {
  for (const name of builtComponents) {
    const source = readFileSync(new URL(`${name}.js`, componentsDir), 'utf8');
    assert.doesNotMatch(source, /from ['"]@\//, `${name} imports an app path alias`);
    assert.doesNotMatch(source, /from ['"](next-themes|next\/|react-redux)/, `${name} imports app code`);
  }
});

test('cn merges conflicting Tailwind classes', async () => {
  const { cn } = await import('@aakashiic/ui/utils');
  assert.equal(cn('px-2 py-1', false && 'hidden', 'px-4'), 'py-1 px-4');
});
