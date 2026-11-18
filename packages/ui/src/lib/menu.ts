// Classes shared by the menus (dropdown-menu, command). Internal: not exported from the package.
// Same panel as the select menu and the popover: surface, border, rounded-xl, shadow-md.

/** Floating menu panel, with Radix's open/close fade and zoom. */
export const menuPanel =
  'z-50 min-w-32 overflow-hidden rounded-xl border border-border bg-surface p-1 text-text shadow-md duration-(--ds-motion-duration-fast) ease-standard data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';

/** One row in a menu. The highlighted row (pointer or keyboard) gets `bg-surface-muted`. */
export const menuItem =
  'relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text outline-none transition-colors duration-(--ds-motion-duration-fast) ease-standard [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

/** Group heading inside a menu. */
export const menuLabel = 'px-2 py-1.5 text-xs font-semibold text-text-muted';

/** Thin rule between menu groups. */
export const menuSeparator = '-mx-1 my-1 h-px bg-border';

/** Keyboard hint at the end of a row, e.g. ⌘K. */
export const menuShortcut = 'ml-auto text-xs tracking-widest text-text-muted';
