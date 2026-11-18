'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';

import { cn } from '../lib/utils.ts';
import { Button } from './button.tsx';

/*
 * App shell header (DS-3.5), from Data Vault's HeroIntro and V-Estate's MainLayout header.
 *
 *   <AppHeader>
 *     <SidebarTrigger />                      (phones only)
 *     <AppHeaderBack onClick={() => router.back()} />
 *     <AppHeaderTitle>Performance report</AppHeaderTitle>
 *     <AppHeaderActions mobileToggleLabel="Filters">…project picker, date filters…</AppHeaderActions>
 *     <AppHeaderEnd>…notifications, theme toggle…</AppHeaderEnd>
 *   </AppHeader>
 *
 * Sticky (no measured spacer, unlike Data Vault's fixed header). On phones the actions wrap to their own
 * full-width row, or hide behind a toggle with `mobileToggleLabel` (Data Vault's "Show filters").
 */

/** True once the window has scrolled past `threshold`, with a small deadband so it doesn't flicker. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const update = () =>
      setScrolled((prev) => (prev ? window.scrollY > threshold / 2 : window.scrollY > threshold));
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [threshold]);
  return scrolled;
}

const AppHeader = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    const scrolled = useScrolled();
    return (
      <header
        ref={ref}
        data-slot="app-header"
        data-scrolled={scrolled}
        className={cn(
          'sticky top-0 z-30 flex min-h-16 flex-wrap items-center gap-x-3 gap-y-2 border-b border-transparent bg-background px-4 py-3 text-text transition-[border-color,box-shadow] duration-(--ds-motion-duration-base) ease-standard md:px-6',
          'data-[scrolled=true]:border-border data-[scrolled=true]:bg-surface data-[scrolled=true]:shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </header>
    );
  }
);
AppHeader.displayName = 'AppHeader';

type AppHeaderBackProps = React.ComponentProps<typeof Button> & {
  /** Accessible name. Default "Go back". */
  label?: string;
};

/** Back button. A real button (or your router's link with `asChild`), named for screen readers. */
const AppHeaderBack = React.forwardRef<HTMLButtonElement, AppHeaderBackProps>(
  ({ label = 'Go back', className, asChild, children, ...props }, ref) => (
    <Button
      ref={ref}
      type={asChild ? undefined : 'button'}
      variant="ghost"
      size="icon"
      aria-label={label}
      asChild={asChild}
      className={cn('order-1 -ml-2 shrink-0 text-text-muted hover:text-text', className)}
      {...props}
    >
      {asChild ? children : <ChevronLeft aria-hidden="true" />}
    </Button>
  )
);
AppHeaderBack.displayName = 'AppHeaderBack';

type AppHeaderTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  /** Render another heading level or element (e.g. an <h2> inside a page that has its own <h1>). */
  asChild?: boolean;
};

/** The page's <h1>. Truncates on one line rather than pushing the actions around. */
const AppHeaderTitle = React.forwardRef<HTMLHeadingElement, AppHeaderTitleProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h1';
    return (
      <Comp
        ref={ref}
        data-slot="app-header-title"
        className={cn('order-1 min-w-0 flex-1 truncate text-lg font-semibold leading-tight text-text md:text-xl', className)}
        {...props}
      />
    );
  }
);
AppHeaderTitle.displayName = 'AppHeaderTitle';

type AppHeaderActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * On phones, hide the actions behind a toggle button with this label (Data Vault's "Show filters").
   * Without it, the actions wrap to their own full-width row.
   */
  mobileToggleLabel?: string;
  /** Start expanded on phones (only with `mobileToggleLabel`). */
  defaultMobileOpen?: boolean;
};

/**
 * Page filters and actions: project picker, date range, export. Inline on desktop; on phones a full-width
 * second row, optionally behind a toggle.
 */
const AppHeaderActions = React.forwardRef<HTMLDivElement, AppHeaderActionsProps>(
  ({ mobileToggleLabel, defaultMobileOpen = false, id, className, ...props }, ref) => {
    const generatedId = React.useId();
    const regionId = id ?? `${generatedId}-actions`;
    const [open, setOpen] = React.useState(defaultMobileOpen);
    const collapsible = Boolean(mobileToggleLabel);

    return (
      <>
        {collapsible && (
          <Button
            type="button"
            variant={open ? 'muted' : 'outline'}
            size="sm"
            aria-expanded={open}
            aria-controls={regionId}
            className="order-2 shrink-0 md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            <SlidersHorizontal aria-hidden="true" />
            {mobileToggleLabel}
          </Button>
        )}
        <div
          ref={ref}
          id={regionId}
          data-slot="app-header-actions"
          data-mobile-open={collapsible ? open : undefined}
          className={cn(
            // Phones: a full-width row under the title. md and up: inline, pushed right.
            'order-4 flex w-full basis-full flex-wrap items-center gap-2 *:max-md:flex-1 md:order-2 md:ml-auto md:w-auto md:basis-auto md:flex-nowrap md:*:flex-none',
            collapsible && 'data-[mobile-open=false]:max-md:hidden',
            className
          )}
          {...props}
        />
      </>
    );
  }
);
AppHeaderActions.displayName = 'AppHeaderActions';

/** Icons that stay in the top row on every screen: notifications, theme toggle, account. */
const AppHeaderEnd = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-header-end"
      className={cn('order-3 ml-auto flex shrink-0 items-center gap-1 md:ml-0', className)}
      {...props}
    />
  )
);
AppHeaderEnd.displayName = 'AppHeaderEnd';

/**
 * "Skip to content" link: the first focusable thing on the page, visible only when focused, so keyboard
 * users don't tab through the whole sidebar on every page. Point it at the <main> element's id.
 */
const SkipToContent = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ href = '#main', className, children = 'Skip to content', ...props }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-text focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
SkipToContent.displayName = 'SkipToContent';

export {
  AppHeader,
  AppHeaderBack,
  AppHeaderTitle,
  AppHeaderActions,
  AppHeaderEnd,
  SkipToContent,
  type AppHeaderBackProps,
  type AppHeaderTitleProps,
  type AppHeaderActionsProps,
};
