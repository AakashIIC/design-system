import * as React from 'react';

type FocusHandler = (event: Event) => void;

/**
 * Returns focus to whatever was focused when a modal opened. Internal: not exported from the package.
 *
 * Radix's Dialog (and AlertDialog and Sheet, built on it) sends focus back to its `<DialogTrigger>` on close.
 * Apps often open dialogs from state (`<Dialog open={isOpen}>`) with no trigger, and then focus falls to
 * `<body>`, which loses the keyboard user's place.
 *
 * Spread the result onto the Radix content. `onOpenAutoFocus` fires just before Radix moves focus inside,
 * so the opener is still `document.activeElement` there. The caller's own handlers run first; if one calls
 * `preventDefault()`, it keeps control.
 */
export function useReturnFocus({
  onOpenAutoFocus,
  onCloseAutoFocus,
}: {
  onOpenAutoFocus?: FocusHandler;
  onCloseAutoFocus?: FocusHandler;
}) {
  const returnTo = React.useRef<HTMLElement | null>(null);

  const handleOpen = React.useCallback(
    (event: Event) => {
      const active = document.activeElement;
      returnTo.current = active instanceof HTMLElement && active !== document.body ? active : null;
      onOpenAutoFocus?.(event);
    },
    [onOpenAutoFocus]
  );

  const handleClose = React.useCallback(
    (event: Event) => {
      onCloseAutoFocus?.(event);
      const target = returnTo.current;
      returnTo.current = null;
      if (event.defaultPrevented) return;
      // Nothing usable captured (e.g. Safari doesn't focus a clicked button): leave it to Radix's trigger.
      if (!target?.isConnected) return;
      event.preventDefault();
      target.focus({ preventScroll: true });
    },
    [onCloseAutoFocus]
  );

  return { onOpenAutoFocus: handleOpen, onCloseAutoFocus: handleClose };
}
