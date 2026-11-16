import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import stylelint from 'stylelint';
import config from '../stylelint/index.js';

async function lint(code, codeFilename = 'component.scss') {
  const { results } = await stylelint.lint({ code, codeFilename, config });
  return results[0].warnings.map((w) => w.rule);
}

describe('stylelint config', () => {
  it('allows tokens, layout sizes and 1px borders', async () => {
    const code = `
      .card {
        color: var(--ds-color-text);
        padding: $ds-spacing-4 var(--ds-spacing-6);
        border-radius: var(--ds-radius-xl);
        border: 1px solid var(--ds-color-border);
        width: 320px;
        height: 40px;
        margin: 0 auto;
      }`;
    assert.deepEqual(await lint(code), []);
  });

  it('flags hex, named and functional colours', async () => {
    const code = '.a { color: #fff; background: red; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }';
    assert.deepEqual((await lint(code)).sort(), ['color-named', 'color-no-hex', 'function-disallowed-list']);
  });

  it('flags arbitrary font sizes, spacing and radius', async () => {
    const code = '.a { font-size: 13px; padding: 8px 12px; margin-top: 0.5rem; gap: 4px; border-radius: 10px; border-top-left-radius: 6px; }';
    // 7: "padding: 8px 12px" reports each value
    assert.equal((await lint(code)).filter((r) => r === 'declaration-property-unit-disallowed-list').length, 7);
  });

  it('parses SCSS (nesting, variables, mixins)', async () => {
    const code = `
      $local: 1;
      @mixin x { margin-left: 4px; }
      .a { &:hover { color: #4434dd; } }`;
    assert.deepEqual((await lint(code)).sort(), ['color-no-hex', 'declaration-property-unit-disallowed-list']);
  });

  it('points the message at the tokens', async () => {
    const { results } = await stylelint.lint({ code: '.a { font-size: 13px; padding: 7px; border-radius: 3px; }', codeFilename: 'a.scss', config });
    const [font, pad, radius] = results[0].warnings.map((w) => w.text);
    assert.match(font, /var\(--ds-font-size-\*\)/);
    assert.match(pad, /var\(--ds-spacing-\*\)/);
    assert.match(radius, /var\(--ds-radius-\*\)/);
  });
});
