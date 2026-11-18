'use client';

import * as React from 'react';
import { ArrowRight, ArrowUpRight, LayoutGrid } from 'lucide-react';

import { cn } from '../lib/utils.ts';
import { Button } from './button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';

/*
 * App switcher for the central portal (DS-3.7), from Data Vault's select-portal page and portal rail.
 *
 * - AppSwitcher: a grid button for the header that opens the apps in a popover (switch without leaving).
 * - AppLauncher: the "select your workspace" page, one card per app.
 *
 * Every app is a link. Data Vault's cards were a div role="button" around a second, unfocusable button;
 * here each card or tile is a single link with the app's name as its accessible name.
 */

export type AppItem = {
  id: string;
  name: string;
  href: string;
  /** Logo or icon. Decorative: the name labels the app. */
  icon?: React.ReactNode;
  /** Short line under the name on launcher cards ("Speech intelligence and analytics"). */
  description?: string;
  /** Small label above the name on launcher cards. */
  category?: string;
  /** Opens in a new tab (another site). The link says so to screen readers. */
  external?: boolean;
};

type LinkComponent = React.ElementType<React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>;

type SharedProps = {
  apps: readonly AppItem[];
  /** The app the user is in now: highlighted and aria-current="page". */
  currentAppId?: string;
  /** Your router's link (next/link). Default <a>. External apps always use <a>. */
  linkAs?: LinkComponent;
  /** Called when an app is chosen, before navigation (e.g. analytics). */
  onSelect?: (app: AppItem) => void;
};

function AppLink({
  app,
  linkAs: LinkAs = 'a',
  current,
  onSelect,
  className,
  children,
  idBase,
  labelledBy,
  describedBy,
}: {
  app: AppItem;
  linkAs?: LinkComponent;
  current: boolean;
  onSelect?: (app: AppItem) => void;
  className?: string;
  children: React.ReactNode;
  /** Prefix for the "opens in a new tab" note's id, when it's referenced by aria-describedby. */
  idBase?: string;
  labelledBy?: string;
  describedBy?: string;
}) {
  const Comp: LinkComponent = app.external ? 'a' : LinkAs;
  const newTabId = idBase ? `${idBase}-newtab` : undefined;
  const describedByAll = [describedBy, app.external && labelledBy ? newTabId : undefined].filter(Boolean).join(' ') || undefined;
  return (
    <Comp
      href={app.href}
      aria-current={current ? 'page' : undefined}
      aria-labelledby={labelledBy}
      aria-describedby={describedByAll}
      data-current={current}
      {...(app.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={() => onSelect?.(app)}
      className={className}
    >
      {children}
      {/* Bare space so the name reads "Showcase (opens…)": a space inside the span gets trimmed. */}
      {app.external && ' '}
      {app.external && (
        <span id={newTabId} className="sr-only">
          (opens in a new tab)
        </span>
      )}
    </Comp>
  );
}

function AppIcon({ icon, className }: { icon?: React.ReactNode; className?: string }) {
  if (!icon) return null;
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl border border-border bg-surface-muted text-text [&_img]:size-full [&_img]:object-contain [&_svg]:size-1/2',
        className
      )}
    >
      {icon}
    </span>
  );
}

type AppSwitcherProps = SharedProps & {
  /** Name of the trigger button and the popover. */
  label?: string;
  /** Link to the full workspace page (AppLauncher), shown under the tiles. */
  allAppsHref?: string;
  allAppsLabel?: string;
  className?: string;
};

/** Grid button for the app header: opens every app as a tile. */
function AppSwitcher({
  apps,
  currentAppId,
  linkAs,
  onSelect,
  label = 'Switch app',
  allAppsHref,
  allAppsLabel = 'All workspaces',
  className,
}: AppSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const LinkAs: LinkComponent = linkAs ?? 'a';
  const choose = (app: AppItem) => {
    onSelect?.(app);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={label} className={cn('text-text-muted hover:text-text', className)}>
          <LayoutGrid aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" collisionPadding={12} aria-label={label} className="w-80 p-3">
        <nav aria-label={label}>
          <ul className="grid grid-cols-3 gap-1">
            {apps.map((app) => {
              const current = app.id === currentAppId;
              return (
                <li key={app.id}>
                  <AppLink
                    app={app}
                    linkAs={linkAs}
                    current={current}
                    onSelect={choose}
                    className="flex h-full flex-col items-center gap-2 rounded-xl p-2 text-center text-xs font-medium text-text outline-none transition-colors duration-(--ds-motion-duration-fast) ease-standard hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring data-[current=true]:bg-primary-soft data-[current=true]:font-semibold"
                  >
                    <span className="relative">
                      <AppIcon icon={app.icon} className="size-11" />
                      {app.external && (
                        <ArrowUpRight
                          aria-hidden="true"
                          className="absolute -right-1 -top-1 size-4 rounded-full border border-border bg-surface p-0.5 text-text-muted"
                        />
                      )}
                    </span>
                    <span className="line-clamp-2 leading-tight">{app.name}</span>
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </nav>
        {allAppsHref && (
          <LinkAs
            href={allAppsHref}
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border-t border-border px-2 pt-3 pb-1 text-sm font-medium text-text outline-none hover:underline hover:decoration-primary hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {allAppsLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </LinkAs>
        )}
      </PopoverContent>
    </Popover>
  );
}

type AppLauncherProps = SharedProps & {
  /** Heading level of each card's app name (the page's own <h1> sits above the grid). Default 2. */
  headingLevel?: 2 | 3 | 4;
  /** Text of the call to action at the bottom of each card. Default "Open {name}". */
  actionLabel?: (app: AppItem, current: boolean) => string;
  className?: string;
};

/** The "select your workspace" page: one card per app, each a single link. */
function AppLauncher({
  apps,
  currentAppId,
  linkAs,
  onSelect,
  headingLevel = 2,
  actionLabel = (app, current) => (current ? `Continue in ${app.name}` : `Open ${app.name}`),
  className,
}: AppLauncherProps) {
  const Heading = `h${headingLevel}` as 'h2';
  const baseId = React.useId();
  return (
    <ul className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {apps.map((app) => {
        const current = app.id === currentAppId;
        const id = `${baseId}-${app.id}`;
        return (
          <li key={app.id} className="flex">
            {/* Named by the heading and described by the description, not by every line of the card. */}
            <AppLink
              app={app}
              linkAs={linkAs}
              current={current}
              onSelect={onSelect}
              idBase={id}
              labelledBy={`${id}-name`}
              describedBy={app.description ? `${id}-desc` : undefined}
              className="group/app flex w-full flex-col gap-6 rounded-2xl border border-border bg-surface p-6 text-left text-text outline-none transition-[border-color,box-shadow] duration-(--ds-motion-duration-base) ease-standard hover:border-primary hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[current=true]:border-primary data-[current=true]:ring-1 data-[current=true]:ring-primary"
            >
              <AppIcon icon={app.icon} className="size-14 rounded-2xl" />
              <span className="flex flex-1 flex-col gap-1">
                {app.category && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{app.category}</span>
                )}
                <Heading id={`${id}-name`} className="text-xl font-semibold leading-tight">
                  {app.name}
                </Heading>
                {app.description && (
                  <span id={`${id}-desc`} className="text-sm text-text-muted">
                    {app.description}
                  </span>
                )}
              </span>
              {/* Looks like a button; it's part of the link (no nested interactive element). */}
              <span
                aria-hidden="true"
                className="flex min-h-control-md items-center justify-center gap-2 rounded-lg border border-input px-3 py-2 text-center text-sm font-medium transition-colors duration-(--ds-motion-duration-fast) ease-standard group-hover/app:border-primary group-hover/app:bg-primary group-hover/app:text-on-primary group-data-[current=true]/app:border-primary group-data-[current=true]/app:bg-primary group-data-[current=true]/app:text-on-primary"
              >
                {actionLabel(app, current)}
                {app.external ? <ArrowUpRight className="size-4" /> : <ArrowRight className="size-4" />}
              </span>
            </AppLink>
          </li>
        );
      })}
    </ul>
  );
}

export { AppSwitcher, AppLauncher, type AppSwitcherProps, type AppLauncherProps };
