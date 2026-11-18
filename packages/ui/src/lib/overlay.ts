// Classes shared by the modal overlays (dialog, alert-dialog, sheet). Internal: not exported from the package.
// Only token names: colours, radii, shadows, sizes and motion all come from @aakashiic/tokens.

/** Data Vault's modal backdrop: translucent scrim plus a light blur. */
export const overlayBackdrop =
  'fixed inset-0 z-50 bg-overlay backdrop-blur-sm duration-(--ds-motion-duration-base) ease-standard data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0';

/** The X button in the top-right corner of a dialog or sheet. */
export const overlayClose =
  'absolute right-4 top-4 inline-flex size-control-sm items-center justify-center rounded-lg text-text-muted transition-colors duration-(--ds-motion-duration-fast) ease-standard hover:bg-surface-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none';

/** Centred modal panel (dialog, alert-dialog). Fades and zooms in; full width minus a margin on phones. */
export const overlayPanel =
  'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border border-border bg-surface p-6 text-text shadow-lg outline-none duration-(--ds-motion-duration-base) ease-standard data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 max-md:max-h-[85dvh] max-md:w-[calc(100vw-1.5rem)] max-md:max-w-[calc(100vw-1.5rem)] max-md:overflow-y-auto max-md:rounded-xl max-md:p-4';

/** Title and description text inside the modal overlays. */
export const overlayTitle = 'text-xl font-semibold text-text';
export const overlayDescription = 'text-sm text-text-muted';
