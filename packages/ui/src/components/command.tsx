'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '../lib/utils.ts';
import { menuItem, menuSeparator, menuShortcut } from '../lib/menu.ts';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog.tsx';

const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn('flex h-full w-full flex-col overflow-hidden rounded-xl bg-surface text-text', className)}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {
  /** Dialog name for screen readers (visually hidden). */
  title?: string;
  /** Dialog description for screen readers (visually hidden). */
  description?: string;
  className?: string;
}

const CommandDialog = ({
  children,
  title = 'Command palette',
  description = 'Search for a command to run.',
  className,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      {/* top-2 centres the close button on the 48px search row. */}
      <DialogContent className={cn('gap-0 overflow-hidden p-0 max-md:p-0 [&>button:last-child]:top-2', className)}>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        {/* `label` names cmdk's search input; without it the input points at an empty label. */}
        <Command label={title} className="rounded-2xl **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 **:[[cmdk-input]]:h-12 **:[[cmdk-input-wrapper]]:pr-12**:[[cmdk-item]]:py-2.5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

/**
 * cmdk 1.1.1 sets aria-activedescendant one step late: it's empty on first render and, after filtering,
 * still names an option that is no longer rendered. Screen readers then announce the wrong option or none.
 * After every selection or search change, point the input and the listbox at the option cmdk highlighted.
 */
function useActiveDescendantFix(inputRef: React.RefObject<HTMLInputElement | null>) {
  // Subscribing re-renders this component whenever the highlighted value or the search changes.
  useCommandState((state) => state.value);
  useCommandState((state) => state.search);
  React.useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const listId = input.getAttribute('aria-controls');
    const list = listId ? document.getElementById(listId) : null;
    const active = list?.querySelector<HTMLElement>('[cmdk-item][aria-selected="true"]');
    for (const el of [input, list]) {
      if (!el) continue;
      if (active?.id) el.setAttribute('aria-activedescendant', active.id);
      else el.removeAttribute('aria-activedescendant');
    }
  });
}

const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  useActiveDescendantFix(inputRef);
  return (
    <div className="flex items-center gap-2 border-b border-border px-3" cmdk-input-wrapper="">
      <Search className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
      <CommandPrimitive.Input
        ref={inputRef}
        className={cn(
          'flex h-control-lg w-full bg-transparent py-3 text-sm text-text outline-none placeholder:text-text-subtle disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty ref={ref} className={cn('py-6 text-center text-sm text-text-muted', className)} {...props} />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-text **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:text-text-muted',
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  // cmdk forces role="separator", which isn't an allowed child of the listbox (axe aria-required-children).
  // The rule is decorative (groups already have headings), so hide it from assistive tech.
  <CommandPrimitive.Separator ref={ref} aria-hidden="true" className={cn(menuSeparator, 'my-0', className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// cmdk v1 sets data-selected and data-disabled to "true" or "false" on every item, so match the value.
const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      menuItem,
      'data-[selected=true]:bg-surface-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn(menuShortcut, className)} {...props} />;
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
