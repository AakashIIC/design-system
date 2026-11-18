// Classes shared by the form controls (DS-3.3c). Internal: not exported from the package.
// Only token names: colours, radii, sizes and motion all come from @aakashiic/tokens.

/**
 * Text fields: input, textarea and the select trigger. 8px radius and the `input` border (the tokens'
 * "buttons, inputs" radius). Focus turns the border to `ring` with a soft halo; `aria-invalid` turns it red.
 */
export const fieldBase =
  'w-full rounded-lg border border-input bg-surface text-sm text-text transition-[color,border-color,box-shadow] duration-(--ds-motion-duration-fast) ease-standard placeholder:text-text-subtle focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/20 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20 disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Checkbox and radio boxes. Unchecked borders use `text-muted`: a checkbox's border is its only visible
 * boundary, so it needs 3:1 against the surface (WCAG 1.4.11), which the light `input` colour doesn't reach.
 */
export const toggleBox =
  'peer size-4 shrink-0 border border-text-muted bg-surface transition-colors duration-(--ds-motion-duration-fast) ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary';

/** Text under a field: help text and error messages. */
export const fieldDescription = 'text-sm text-text-muted';
export const fieldError = 'text-sm font-medium text-danger-strong';
