import noArbitraryValues from './no-arbitrary-values.js';

const plugin = {
  meta: { name: '@aakashiic/design-lint' },
  rules: { 'no-arbitrary-values': noArbitraryValues },
  configs: {},
};

// Flat config: import designLint from '@aakashiic/design-lint/eslint'; export default [designLint.configs.recommended]
plugin.configs.recommended = {
  name: '@aakashiic/design-lint/recommended',
  files: ['**/*.{js,jsx,ts,tsx}'],
  plugins: { ds: plugin },
  rules: { 'ds/no-arbitrary-values': 'error' },
};

export default plugin;
