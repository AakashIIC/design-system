import { classify } from './parse-class.js';

const DEFAULT_ATTRIBUTES = ['className', 'class'];
const DEFAULT_CALLEES = ['cn', 'clsx', 'classnames', 'classNames', 'cx', 'cva', 'tv', 'twMerge', 'twJoin'];

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow raw colours and arbitrary sizes in Tailwind classes; use @aakashiic/tokens instead',
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          attributes: { type: 'array', items: { type: 'string' } },
          callees: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      color: '"{{cls}}" uses a raw colour. Use a token colour instead (bg-primary, text-text-muted, border-border...).',
      size: '"{{cls}}" uses an arbitrary size. Use the token scale instead (text-sm, p-4, rounded-lg...).',
      sizeWithFix: '"{{cls}}" uses an arbitrary size. Use "{{fix}}" (same value, from the token scale).',
      suggest: 'Replace with "{{fix}}" (nearest token; also sets line-height, so check the result).',
    },
  },

  create(context) {
    const options = context.options[0] ?? {};
    const attributes = new Set(options.attributes ?? DEFAULT_ATTRIBUTES);
    const callees = new Set(options.callees ?? DEFAULT_CALLEES);
    const { sourceCode } = context;

    /** Is this string inside a className attribute or a class-helper call? */
    function isClassContext(node) {
      for (const a of sourceCode.getAncestors(node).reverse()) {
        if (a.type === 'JSXAttribute') return attributes.has(a.name.name);
        if (a.type === 'CallExpression') {
          const c = a.callee;
          const name = c.type === 'Identifier' ? c.name : c.type === 'MemberExpression' ? c.property.name : null;
          if (callees.has(name)) return true;
        }
        if (a.type.includes('Function')) return false; // don't look past a function boundary
      }
      return false;
    }

    function check(node) {
      if (!isClassContext(node)) return;
      const [start] = node.range;
      const raw = sourceCode.text.slice(node.range[0], node.range[1]);
      for (const match of raw.matchAll(/[^\s"'`{}$]+/g)) {
        const cls = match[0];
        const result = classify(cls);
        if (!result) continue;
        const range = [start + match.index, start + match.index + cls.length];
        const loc = { start: sourceCode.getLocFromIndex(range[0]), end: sourceCode.getLocFromIndex(range[1]) };

        if (result.kind === 'color') {
          context.report({ loc, messageId: 'color', data: { cls } });
        } else if (result.fix) {
          context.report({ loc, messageId: 'sizeWithFix', data: { cls, fix: result.fix }, fix: (f) => f.replaceTextRange(range, result.fix) });
        } else {
          context.report({
            loc,
            messageId: 'size',
            data: { cls },
            suggest: result.suggest
              ? [{ messageId: 'suggest', data: { fix: result.suggest }, fix: (f) => f.replaceTextRange(range, result.suggest) }]
              : [],
          });
        }
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') check(node);
      },
      TemplateElement: check,
    };
  },
};
