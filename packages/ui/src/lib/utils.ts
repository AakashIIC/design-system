import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge only knows Tailwind's default theme. The tokens add the control sizes as spacing
 * (`h-control-md`, `size-control-sm`, `min-h-control-lg`, ...), so without this a caller's `h-8` or
 * `h-auto` would sit next to the component's `h-control-md` instead of replacing it, and the token
 * class wins in the generated CSS.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['control-sm', 'control-md', 'control-lg'],
    },
  },
});

/** Join class names and let later Tailwind classes win over earlier ones (token sizes included). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
