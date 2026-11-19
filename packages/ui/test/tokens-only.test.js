// The Phase 3 styling rule, enforced on every component restyled in DS-3.3:
// colours, radii, shadows, font sizes and motion come only from @aakashiic/tokens.
// No shadcn colour names, no Tailwind palette (`bg-black/80`), no `dark:`, no raw values.
// Add each component here when its DS-3.3 group lands.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { colors } from '@aakashiic/tokens';

const RESTYLED = [
  'lib/overlay.ts',
  // DS-3.3a overlays
  'components/dialog.tsx',
  'components/alert-dialog.tsx',
  'components/sheet.tsx',
  'components/popover.tsx',
  'components/tooltip.tsx',
  // DS-3.3b buttons
  'components/button.tsx',
  // DS-3.3c form controls
  'lib/field.ts',
  'components/input.tsx',
  'components/textarea.tsx',
  'components/select.tsx',
  'components/checkbox.tsx',
  'components/radio-group.tsx',
  'components/switch.tsx',
  'components/slider.tsx',
  'components/label.tsx',
  'components/form.tsx',
  // DS-3.3d navigation
  'lib/menu.ts',
  'components/tabs.tsx',
  'components/dropdown-menu.tsx',
  'components/command.tsx',
  // DS-3.3e data display
  'components/table.tsx',
  'components/badge.tsx',
  'components/card.tsx',
  'components/progress.tsx',
  'components/skeleton.tsx',
  'components/spinner.tsx',
  'components/separator.tsx',
  'components/scroll-area.tsx',
  // DS-3.3f: the four components outside the DS-3.3 groups
  'components/calendar.tsx',
  'components/chart.tsx',
  'components/drawer.tsx',
  'components/sonner.tsx',
  // DS-3.4 app shell
  'components/sidebar.tsx',
  'components/app-header.tsx',
  'components/project-switcher.tsx',
  'components/app-switcher.tsx',
];

const COLOURS = new Set([...Object.keys(colors.datavault), 'transparent', 'current', 'inherit']);
// `[inherit]` takes the parent's (token) radius, e.g. a scroll viewport inside a rounded card.
const RADII = new Set(['sm', 'md', 'lg', 'xl', '2xl', 'full', 'none', '[inherit]']);
const SHADOWS = new Set(['sm', 'md', 'lg', 'none']);
const FONT_SIZES = new Set(['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']);

// Values that follow a colour prefix but aren't colours.
const NOT_COLOUR = {
  text: new Set([...FONT_SIZES, 'left', 'center', 'right', 'justify', 'start', 'end', 'wrap', 'nowrap', 'balance', 'pretty', 'ellipsis', 'clip']),
  border: /^(\d+|\[[\d.]+px\]|solid|dashed|dotted|double|none|hidden|collapse|separate)$/,
  ring: /^(\d+|inset)$/,
  'ring-offset': /^\d+$/,
  decoration: /^(\d+|solid|dashed|dotted|double|wavy|auto|from-font|clone|slice)$/,
  outline: /^(\d+|none|hidden|solid|dashed|dotted|double|offset-\d+)$/,
};
const COLOUR_PREFIX = /^(bg|text|border(?:-[trblxyse])?|ring-offset|ring|outline|fill|stroke|from|via|to|divide|placeholder|decoration|caret|accent)-(.+)$/;

/** Every Tailwind class in string literals of the file, with variants (`hover:`, `data-[x]:`) removed. */
function classesIn(source) {
  // Drop comments first: an apostrophe in a comment ("Data Vault's") would otherwise open a fake string.
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const literals = code.match(/(['"`])(?:(?!\1)[^\\]|\\.)*\1/g) ?? [];
  const out = [];
  for (const literal of literals) {
    for (const token of literal.slice(1, -1).split(/\s+/)) {
      if (!token || token.startsWith('./') || token.startsWith('../') || token.includes('/components/')) continue;
      // Split off variants on ':' that isn't inside [...] or (...).
      let depth = 0;
      let last = -1;
      for (let i = 0; i < token.length; i++) {
        const c = token[i];
        if (c === '[' || c === '(') depth++;
        else if (c === ']' || c === ')') depth--;
        else if (c === ':' && depth === 0) last = i;
      }
      out.push({ full: token, variants: token.slice(0, last + 1), utility: token.slice(last + 1) });
    }
  }
  return out;
}

function problemWith({ variants, utility }) {
  if (/(^|:)dark:/.test(variants)) return 'dark: classes are not allowed (themes come from the tokens)';
  const u = utility.replace(/^!/, '').replace(/!$/, '');

  const colour = u.match(COLOUR_PREFIX);
  if (colour) {
    const [, prefix, rawValue] = colour;
    const value = rawValue.replace(/\/\d+$/, '');
    const base = prefix.startsWith('border') ? 'border' : prefix;
    const notColour = NOT_COLOUR[base];
    if (notColour && (notColour instanceof Set ? notColour.has(value) : notColour.test(value))) return null;
    if (prefix.startsWith('border') && /^[trblxyse]$/.test(value)) return null; // border-l, border-t
    if (/^\(--ds-/.test(value) || /^\[var\(--ds-/.test(value)) return null;
    // Chart series colours: ChartContainer sets --color-<key> at runtime from the app's chart config.
    if (/^\(--color-/.test(value)) return null;
    if (!COLOURS.has(value)) return `"${value}" is not a token colour`;
    return null;
  }

  const radius = u.match(/^rounded(?:-[trblse]{1,2})?(?:-(.+))?$/);
  if (radius && radius[1] && !RADII.has(radius[1])) return `rounded-${radius[1]} is not a token radius`;

  const shadow = u.match(/^shadow-(.+)$/);
  if (shadow && !SHADOWS.has(shadow[1])) return `shadow-${shadow[1]} is not a token shadow`;

  const duration = u.match(/^duration-(.+)$/);
  if (duration && !duration[1].startsWith('(--ds-motion-')) return 'durations come from --ds-motion-duration-*';

  const ease = u.match(/^ease-(.+)$/);
  if (ease && ease[1] !== 'standard') return 'easing is ease-standard';

  return null;
}

for (const file of RESTYLED) {
  test(`${file} uses only tokens`, () => {
    const source = readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');
    const problems = classesIn(source)
      .map((c) => [c.full, problemWith(c)])
      .filter(([, problem]) => problem)
      .map(([cls, problem]) => `${cls}: ${problem}`);
    assert.deepEqual(problems, []);
  });
}

test('the checker catches what it should', () => {
  const bad = ['bg-black/80', 'text-muted-foreground', 'bg-popover', 'dark:bg-surface', 'rounded-3xl', 'shadow-2xl', 'duration-300', 'ease-in-out', 'border-secondary'];
  for (const cls of bad) {
    const [c] = classesIn(`'${cls}'`);
    assert.ok(problemWith(c), `${cls} should be flagged`);
  }
  const good = ['bg-overlay', 'text-text-muted', 'data-[state=open]:bg-surface', 'text-xl', 'border-l', 'border-border', 'rounded-2xl', 'shadow-lg', 'duration-(--ds-motion-duration-base)', 'ring-2', 'hover:bg-surface-muted', 'border-[1.5px]', 'bg-(--color-bg)'];
  for (const cls of good) {
    const [c] = classesIn(`'${cls}'`);
    assert.equal(problemWith(c), null, `${cls} should pass`);
  }
});
