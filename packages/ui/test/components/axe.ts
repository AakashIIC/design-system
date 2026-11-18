import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Fails the test if axe finds accessibility violations in the document.
 * Colour contrast is off: jsdom doesn't compute CSS, so axe can't measure it here.
 * Contrast is covered by the token pairs checked in the tokens package.
 * `region` is off too: it's a page-level rule (content outside landmarks), and the tests render
 * components on their own, not inside a page.
 */
export async function expectNoAxeViolations(context: Element = document.body) {
  const { violations } = await axe.run(context, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  const summary = violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length} element(s))`);
  expect(summary).toEqual([]);
}
