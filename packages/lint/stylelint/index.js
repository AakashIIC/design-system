// Shareable Stylelint config: { "extends": ["@aakashiic/design-lint/stylelint"] }
// Flags raw colours and arbitrary sizes in CSS/SCSS. Built-in rules only, so it works with any Stylelint 16+ setup.

const TOKENS = '@aakashiic/tokens';

const colorMessage = `Raw colour. Use a token instead: var(--ds-color-*) or $ds-color-* from ${TOKENS}.`;
const tokenFor = (property) =>
  property === 'font-size' ? 'var(--ds-font-size-*) / $ds-font-size-*'
  : property.endsWith('radius') ? 'var(--ds-radius-*) / $ds-radius-*'
  : property === 'line-height' ? 'a unitless line-height (e.g. 1.5)'
  : 'var(--ds-spacing-*) / $ds-spacing-*';
const sizeMessage = (property) => `Arbitrary size on "${property}". Use ${tokenFor(property)} from ${TOKENS}.`;

/** @type {import('stylelint').Config} */
export default {
  rules: {
    'color-no-hex': [true, { message: colorMessage }],
    'color-named': ['never', { message: colorMessage }],
    'function-disallowed-list': [['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch'], { message: colorMessage }],

    // Sizes that have a token scale. Layout sizes (width, height, top...) and borders (1px) are allowed.
    'declaration-property-unit-disallowed-list': [
      {
        '/^font-size$/': ['px', 'rem', 'em'],
        '/^line-height$/': ['px', 'rem'],
        '/^(padding|margin)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$/': ['px', 'rem'],
        '/^(gap|row-gap|column-gap)$/': ['px', 'rem'],
        '/^border(-(top|bottom)-(left|right)|-(start|end)-(start|end))?-radius$/': ['px', 'rem'],
      },
      { message: (property) => sizeMessage(property) },
    ],
  },
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
};
