'use client';

import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { cn } from '../lib/utils.ts';
import { Button } from './button.tsx';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from './sheet.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.tsx';

/*
 * App shell sidebar (DS-3.4), from Data Vault's sidebar and V-Estate's MainLayout.
 *
 * - Desktop (md and up): a fixed sidebar, full width or collapsed to an icon rail. With `expandOnHover`
 *   the rail widens over the page on hover or keyboard focus, like Data Vault's.
 * - Mobile: the same content in a left Sheet (focus trap, Escape, scrim), opened by SidebarTrigger.
 * - Items are links: pass the router's link with `asChild` (`<Link href="/" />` from next/link).
 *   The active one gets aria-current="page". Labels stay in the accessibility tree when collapsed.
 *
 * The package doesn't know routes, roles or feature flags: the app decides which items to render.
 */

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  expandOnHover: boolean;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

/** Which copy of the sidebar a component is rendering in: the desktop aside or the mobile sheet. */
const SidebarSurfaceContext = React.createContext<'desktop' | 'mobile'>('desktop');

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within a <SidebarProvider />');
  return context;
}

type SidebarProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Start as the icon rail (uncontrolled). */
  defaultCollapsed?: boolean;
  /** Control the rail state, e.g. to persist it in a cookie. */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Data Vault's behaviour: the collapsed rail widens over the page on hover or keyboard focus. */
  expandOnHover?: boolean;
};

function SidebarProvider({
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  expandOnHover = false,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const [collapsedState, setCollapsedState] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? collapsedState;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const setCollapsed = React.useCallback(
    (next: boolean) => {
      if (collapsedProp === undefined) setCollapsedState(next);
      onCollapsedChange?.(next);
    },
    [collapsedProp, onCollapsedChange]
  );

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed: () => setCollapsed(!collapsed),
      mobileOpen,
      setMobileOpen,
      expandOnHover,
    }),
    [collapsed, setCollapsed, mobileOpen, expandOnHover]
  );

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          data-collapsed={collapsed}
          className={cn('min-h-dvh bg-background text-text', className)}
          style={{ '--sidebar-width': '16rem', '--sidebar-width-collapsed': '5rem', ...style } as React.CSSProperties}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  /** Name of the sidebar landmark. */
  label?: string;
  /** Hidden title of the mobile sheet (dialogs need a name). */
  mobileTitle?: string;
};

function Sidebar({ label = 'Sidebar', mobileTitle = 'Navigation', className, children, ...props }: SidebarProps) {
  const { collapsed, expandOnHover, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      <aside
        data-slot="sidebar"
        data-collapsed={collapsed}
        aria-label={label}
        className={cn(
          'group/sidebar fixed inset-y-0 left-0 z-40 hidden w-(--sidebar-width) flex-col overflow-hidden border-r border-border bg-surface text-text transition-[width,box-shadow] duration-(--ds-motion-duration-base) ease-standard motion-reduce:transition-none md:flex',
          collapsed && 'w-(--sidebar-width-collapsed)',
          collapsed && expandOnHover && 'hover:w-(--sidebar-width) hover:shadow-lg focus-within:w-(--sidebar-width) focus-within:shadow-lg',
          className
        )}
        {...props}
      >
        <SidebarSurfaceContext.Provider value="desktop">{children}</SidebarSurfaceContext.Provider>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0 sm:max-w-72">
          <SheetTitle className="sr-only">{mobileTitle}</SheetTitle>
          <SheetDescription className="sr-only">{label}</SheetDescription>
          <SidebarSurfaceContext.Provider value="mobile">{children}</SidebarSurfaceContext.Provider>
        </SheetContent>
      </Sheet>
    </>
  );
}

/** The page next to the sidebar. Its left padding follows the sidebar width on desktop. */
function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar();
  return (
    <div
      data-slot="sidebar-inset"
      className={cn(
        'flex min-h-dvh min-w-0 flex-col transition-[padding] duration-(--ds-motion-duration-base) ease-standard motion-reduce:transition-none md:pl-(--sidebar-width)',
        collapsed && 'md:pl-(--sidebar-width-collapsed)',
        className
      )}
      {...props}
    />
  );
}

/** Classes for text that hides when the desktop sidebar is a rail (stays in the accessibility tree). */
function useLabelClasses() {
  const { collapsed, expandOnHover } = useSidebar();
  const surface = React.useContext(SidebarSurfaceContext);
  if (surface === 'mobile' || !collapsed) return 'truncate';
  if (expandOnHover) {
    return 'truncate opacity-0 transition-opacity duration-(--ds-motion-duration-base) ease-standard group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100';
  }
  return 'sr-only';
}

function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="sidebar-header" className={cn('flex h-16 shrink-0 items-center gap-2 px-4', className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden px-3 py-2', className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="sidebar-footer" className={cn('mt-auto flex shrink-0 flex-col gap-2 border-t border-border p-3', className)} {...props} />
  );
}

/** Text that hides with the labels when the sidebar is a rail, e.g. the app name next to the logo. */
function SidebarLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span data-slot="sidebar-label" className={cn('min-w-0', useLabelClasses(), className)} {...props} />;
}

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  /** Name of the navigation landmark. */
  label?: string;
  /** Optional heading shown above the items (hidden on the rail). */
  heading?: React.ReactNode;
};

function SidebarNav({ label = 'Main', heading, className, children, ...props }: SidebarNavProps) {
  const labelClasses = useLabelClasses();
  return (
    <nav aria-label={label} data-slot="sidebar-nav" className={cn('flex flex-col gap-1', className)} {...props}>
      {heading && (
        <p aria-hidden="true" className={cn('px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-text-muted', labelClasses)}>
          {heading}
        </p>
      )}
      <ul className="flex flex-col gap-1">{children}</ul>
    </nav>
  );
}

type SidebarNavItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Icon shown on the rail and before the label. Decorative: the label names the item. */
  icon?: React.ReactNode;
  /** The item's name. Always in the accessibility tree; on the rail it's also the tooltip. */
  label: string;
  /** The current page: highlighted and marked aria-current="page". */
  active?: boolean;
  /** Render your router's link instead of an <a>: `<SidebarNavItem asChild …><Link href="/" /></SidebarNavItem>`. */
  asChild?: boolean;
  /** Trailing content such as a count badge (hidden on the rail). */
  badge?: React.ReactNode;
};

const SidebarNavItem = React.forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  ({ icon, label, active = false, asChild = false, badge, className, children, onClick, ...props }, ref) => {
    const { collapsed, expandOnHover, setMobileOpen } = useSidebar();
    const surface = React.useContext(SidebarSurfaceContext);
    const labelClasses = useLabelClasses();
    const showTooltip = surface === 'desktop' && collapsed && !expandOnHover;
    const Comp = asChild ? Slot : 'a';

    const item = (
      <Comp
        ref={ref}
        data-slot="sidebar-nav-item"
        data-active={active}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex h-control-lg w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-text-muted outline-none transition-colors duration-(--ds-motion-duration-fast) ease-standard hover:bg-surface-muted hover:text-text focus-visible:ring-2 focus-visible:ring-ring',
          'data-[active=true]:bg-primary-soft data-[active=true]:font-semibold data-[active=true]:text-text',
          '[&_svg]:size-5 [&_svg]:shrink-0 data-[active=true]:[&_svg]:text-primary',
          className
        )}
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event);
          // Navigating from the mobile sheet closes it.
          if (!event.defaultPrevented && surface === 'mobile') setMobileOpen(false);
        }}
        {...props}
      >
        {icon && (
          <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center">
            {icon}
          </span>
        )}
        <Slottable>{children}</Slottable>
        <span className={cn('flex-1 text-left', labelClasses)}>{label}</span>
        {/* A bare space between label and badge, so the accessible name is "Manage leads 12", not
            "Manage leads12" (a space inside a span gets trimmed). Flex layout doesn't render it. */}
        {badge && ' '}
        {badge && <span className={cn('ml-auto shrink-0', labelClasses === 'sr-only' && 'sr-only')}>{badge}</span>}
      </Comp>
    );

    return (
      <li>
        {showTooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>{item}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ) : (
          item
        )}
      </li>
    );
  }
);
SidebarNavItem.displayName = 'SidebarNavItem';

/** Hamburger for phones (hidden from md up): opens the sidebar sheet. */
const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { mobileOpen, setMobileOpen } = useSidebar();
    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
        className={cn('md:hidden', className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setMobileOpen(true);
        }}
        {...props}
      >
        <Menu aria-hidden="true" />
      </Button>
    );
  }
);
SidebarTrigger.displayName = 'SidebarTrigger';

/** Collapses the desktop sidebar to the icon rail and back (hidden on phones). */
const SidebarCollapseButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { collapsed, toggleCollapsed } = useSidebar();
    const surface = React.useContext(SidebarSurfaceContext);
    if (surface === 'mobile') return null;
    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        className={cn('hidden text-text-muted md:inline-flex', className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggleCollapsed();
        }}
        {...props}
      >
        {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
      </Button>
    );
  }
);
SidebarCollapseButton.displayName = 'SidebarCollapseButton';

export {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarLabel,
  SidebarNav,
  SidebarNavItem,
  SidebarTrigger,
  SidebarCollapseButton,
  useSidebar,
  type SidebarProviderProps,
  type SidebarProps,
  type SidebarNavItemProps,
};
