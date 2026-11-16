import { describe, it } from 'node:test';
import { RuleTester as RuleTester10 } from 'eslint';
import { RuleTester as RuleTester9 } from 'eslint9';
import rule from '../eslint/no-arbitrary-values.js';

const languageOptions = { parserOptions: { ecmaFeatures: { jsx: true } } };

const valid = [
  // token classes
  '<div className="bg-primary text-text-muted p-4 text-sm rounded-lg shadow-sm h-control-md" />',
  // layout sizes are allowed
  '<div className="w-[320px] h-[200px] top-[3px] max-w-[1200px]" />',
  // CSS variables and calc are allowed
  '<div className="bg-(--ds-color-primary) p-[var(--gutter)] p-[calc(100%-12px)]" />',
  // not a class context
  'const label = "text-[12px] bg-[#fff]";',
  '<div title="bg-[#fff]" />',
  // a function inside className stops the search
  '<List className={items.map(() => "x")} render={() => "p-[13px]"} />',
];

const invalid = [
  {
    name: 'raw colours, with variants and opacity',
    code: '<div className="bg-[#4434DD] hover:text-[#fff]/50 border-[rgb(0,0,0)]" />',
    errors: [{ messageId: 'color' }, { messageId: 'color' }, { messageId: 'color' }],
  },
  {
    name: 'exact spacing and radius matches are auto-fixed',
    code: '<div className="p-[16px] md:-mt-[8px] rounded-t-[8px] gap-[1rem]" />',
    output: '<div className="p-4 md:-mt-2 rounded-t-lg gap-4" />',
    errors: Array(4).fill({ messageId: 'sizeWithFix' }),
  },
  {
    name: 'negative values and important markers keep their form',
    code: '<div className="mt-[-8px] !p-[8px] px-[12px]!" />',
    output: '<div className="-mt-2 !p-2 px-3!" />',
    errors: Array(3).fill({ messageId: 'sizeWithFix' }),
  },
  {
    name: 'font sizes get a suggestion, not an auto-fix (line-height differs)',
    code: '<p className="text-[14px]" />',
    errors: [{ messageId: 'size', suggestions: [{ messageId: 'suggest', output: '<p className="text-sm" />' }] }],
  },
  {
    name: 'off-scale sizes are reported with no fix',
    code: '<p className="text-[11px] p-[13px] rounded-[10px]" />',
    errors: [{ messageId: 'size', suggestions: [] }, { messageId: 'size' }, { messageId: 'size' }],
  },
  {
    name: 'class helpers: cn with object keys, cva variants',
    code: 'cn("px-[13px]", { "text-[#2B3674]": active }); cva("shadow-[0_1px_2px_#000]", { variants: { size: { sm: "rounded-[10px]" } } });',
    errors: [{ messageId: 'size' }, { messageId: 'color' }, { messageId: 'color' }, { messageId: 'size' }],
  },
  {
    name: 'template literals',
    code: '<div className={`gap-[12px] ${open ? "bg-[#fff]" : ""}`} />',
    output: '<div className={`gap-3 ${open ? "bg-[#fff]" : ""}`} />',
    errors: [{ messageId: 'sizeWithFix' }, { messageId: 'color' }],
  },
  {
    name: 'arbitrary properties',
    code: '<div className="[font-size:13px] [color:#fff] [width:13px]" />',
    errors: [{ messageId: 'size' }, { messageId: 'color' }],
  },
  {
    name: 'custom attribute and callee options',
    code: '<Btn wrapperClass="p-[13px]" />; styles("bg-[#000]");',
    options: [{ attributes: ['wrapperClass'], callees: ['styles'] }],
    errors: [{ messageId: 'size' }, { messageId: 'color' }],
  },
];

for (const [version, RuleTester] of [['ESLint 10', RuleTester10], ['ESLint 9', RuleTester9]]) {
  describe(version, () => {
    RuleTester.describe = describe;
    RuleTester.it = it;
    RuleTester.itOnly = it.only;
    new RuleTester({ languageOptions }).run('no-arbitrary-values', rule, { valid, invalid });
  });
}
