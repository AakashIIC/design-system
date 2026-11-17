// Parses one Tailwind class token and decides whether it uses a raw colour or an arbitrary size.
// Pure functions, no ESLint dependency, so they are easy to test and reuse in a codemod.

// Token scales from @aakashiic/tokens (px). Only exact matches get a fix.
export const FONT_SIZE = { 11: '2xs', 12: 'xs', 14: 'sm', 16: 'base', 18: 'lg', 20: 'xl', 24: '2xl', 30: '3xl' };
export const RADIUS = { 4: 'sm', 6: 'md', 8: 'lg', 12: 'xl', 16: '2xl', 9999: 'full' };
export const SPACING = { 0: '0', 4: '1', 8: '2', 12: '3', 16: '4', 20: '5', 24: '6', 32: '8', 40: '10', 48: '12' };

const COLOR_VALUE = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color-mix)\(/i;
const SIZE_VALUE = /^(-?\d*\.?\d+)(px|rem|em)$/;
const TYPE_HINT = /^(?:length|color|percentage|number|absolute-size|relative-size|line-width|position|size|url|image|family-name|any):/;

const SPACING_UTIL = /^-?(?:p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)$/;
const RADIUS_UTIL = /^rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?$/;
const FONT_UTIL = /^(?:text|leading)$/;

// Arbitrary CSS properties: [font-size:13px], [color:#fff]
const SIZE_PROPS = /^(?:font-size|line-height|padding|margin|gap|row-gap|column-gap|border(?:-[a-z]+)*-radius)(?:-[a-z]+)*$/;

/** Split "md:hover:!-mt-[8px]" into { variants: "md:hover:", base: "!-mt-[8px]" }, ignoring ":" inside [] or (). */
export function splitVariants(token) {
  let depth = 0;
  let last = -1;
  for (let i = 0; i < token.length; i++) {
    const ch = token[i];
    if (ch === '[' || ch === '(') depth++;
    else if (ch === ']' || ch === ')') depth--;
    else if (ch === ':' && depth === 0) last = i;
  }
  return { variants: token.slice(0, last + 1), base: token.slice(last + 1) };
}

const toPx = (num, unit) => (unit === 'px' ? num : num * 16);

/**
 * Classify one class token.
 * Returns null when the class is fine, otherwise { kind: 'color' | 'size', fix?: string, suggest?: string }.
 * `fix` is an exact visual equivalent; `suggest` is the nearest token but may change rendering.
 */
export function classify(token) {
  const { variants, base: raw } = splitVariants(token);
  let base = raw;
  const lead = base.startsWith('!') ? '!' : '';
  const trail = base.endsWith('!') ? '!' : '';
  base = base.slice(lead.length, base.length - trail.length);

  // Arbitrary property: [font-size:13px]
  const prop = /^\[([a-z-]+):(.+)\]$/.exec(base);
  if (prop) {
    const value = prop[2].replace(/_/g, ' ');
    if (COLOR_VALUE.test(value)) return { kind: 'color' };
    if (SIZE_PROPS.test(prop[1]) && /\d(px|rem|em)\b/.test(value)) return { kind: 'size' };
    return null;
  }

  // Utility with arbitrary value: bg-[#fff]/50, -mt-[8px], text-[length:14px]
  const m = /^(-?[a-z][a-z0-9-]*?)-\[(.+)\](\/[\w.[\]%-]+)?$/.exec(base);
  if (!m) return null;
  const [, util, rawValue] = m;
  const value = rawValue.replace(TYPE_HINT, '').replace(/_/g, ' ');

  if (COLOR_VALUE.test(value)) return { kind: 'color' };

  const size = SIZE_VALUE.exec(value);
  if (!size) return null;
  const px = toPx(Number(size[1]), size[2]);
  const rebuild = (utility) => `${variants}${lead}${utility}${trail}`;

  if (FONT_UTIL.test(util)) {
    // text-[14px] sets only font-size; text-sm also sets line-height, so this is a suggestion, not a fix.
    const name = util === 'text' ? FONT_SIZE[px] : undefined;
    return { kind: 'size', suggest: name ? rebuild(`text-${name}`) : undefined };
  }
  if (RADIUS_UTIL.test(util)) {
    const name = RADIUS[px];
    return { kind: 'size', fix: name ? rebuild(`${util}-${name}`) : undefined };
  }
  if (SPACING_UTIL.test(util)) {
    const negative = px < 0 || util.startsWith('-');
    const name = SPACING[Math.abs(px)];
    const bare = util.replace(/^-/, '');
    return { kind: 'size', fix: name ? rebuild(`${negative && name !== '0' ? '-' : ''}${bare}-${name}`) : undefined };
  }
  return null; // other utilities (w-[320px], h-[200px], top-[3px]...) are layout, not token scales
}
