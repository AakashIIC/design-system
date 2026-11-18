'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Pin } from 'lucide-react';

import { cn } from '../lib/utils.ts';
import { Button } from './button.tsx';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './command.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';

/*
 * Project switcher (DS-3.6), from Data Vault's ProjectListDropdown and V-Estate's ProjectBox.
 * A searchable combobox in a popover, built on Command (cmdk), so it's on its own path:
 * `import { ProjectSwitcher } from '@aakashiic/ui/project-switcher'`.
 *
 * Accessibility fixes over Data Vault's copy: the highlighted row is announced (aria-activedescendant,
 * see CommandInput), rows aren't Tab stops, the selected project is aria-checked, ids are unique per
 * instance, and pins are toggled with Alt+P instead of a button nested inside an option.
 */

export type Project = {
  id: string;
  name: string;
  /** Trailing detail, e.g. Data Vault's score. */
  meta?: React.ReactNode;
};

/**
 * Data Vault's title-casing for project names, which also fixes "L&t" → "L&T".
 * Pass it as `formatName` to match Data Vault.
 */
export function formatProjectName(value: string) {
  const titled = value.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
  return titled.replace(/&([a-z])/g, (_, c: string) => `&${c.toUpperCase()}`);
}

const ALL = '__all__';

export type ProjectSwitcherProps = {
  projects: Project[] | null | undefined;
  /** Selected project id; `null` means "all projects". */
  value: string | null;
  onValueChange: (projectId: string | null) => void;
  /** Label of the "all projects" row. `null` hides the row (a project must be chosen). */
  allLabel?: string | null;
  /** What the control picks, for screen readers ("Project: Acme"). */
  label?: string;
  /** Trigger text when nothing is selected and there's no "all" row. */
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Show "N projects" above the selected name (V-Estate's trigger). */
  showCount?: boolean;
  /** Display transform for names, e.g. `formatProjectName`. */
  formatName?: (name: string) => string;
  /** Ids shown in a "Pinned" group at the top. */
  pinnedIds?: readonly string[];
  /** Enables pinning: Alt+P on the highlighted row, or the pin icon. */
  onTogglePin?: (projectId: string) => void;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
};

function ProjectSwitcher({
  projects,
  value,
  onValueChange,
  allLabel = 'All projects',
  label = 'Project',
  placeholder = 'Select a project',
  searchPlaceholder = 'Search projects',
  emptyText = 'No projects found.',
  showCount = false,
  formatName = (name) => name,
  pinnedIds,
  onTogglePin,
  disabled,
  className,
  contentClassName,
}: ProjectSwitcherProps) {
  const [open, setOpenState] = React.useState(false);
  // cmdk's highlighted row, controlled so Alt+P knows which project to pin.
  const [highlighted, setHighlighted] = React.useState('');
  // Controlled so every opening starts with an empty search, even when it reopens during the close
  // animation (the popover content is still mounted then, and cmdk would keep the old text).
  const [search, setSearch] = React.useState('');
  const setOpen = (next: boolean) => {
    setOpenState(next);
    if (!next) setSearch('');
  };

  const options = React.useMemo(() => (projects ?? []).filter((p) => p?.name?.trim()), [projects]);
  const pinned = React.useMemo(() => new Set(pinnedIds ?? []), [pinnedIds]);
  const pinnedProjects = options.filter((p) => pinned.has(p.id));
  const otherProjects = options.filter((p) => !pinned.has(p.id));

  if (options.length === 0) return null;

  const selected = value ? options.find((p) => p.id === value) : undefined;
  const triggerText = selected ? formatName(selected.name) : (allLabel ?? placeholder);

  const select = (id: string) => {
    onValueChange(id === ALL ? null : id);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (onTogglePin && event.altKey && event.key.toLowerCase() === 'p' && highlighted && highlighted !== ALL) {
      event.preventDefault();
      onTogglePin(highlighted);
    }
  };

  const renderItem = (project: Project) => {
    const name = formatName(project.name);
    const isSelected = project.id === value;
    const isPinned = pinned.has(project.id);
    return (
      <CommandItem
        key={project.id}
        value={project.id}
        keywords={[name]}
        onSelect={select}
        aria-checked={isSelected}
        title={name}
        className="group/project"
      >
        <span className="min-w-0 flex-1 truncate">
          {name}
          {isPinned && <span className="sr-only">, pinned</span>}
        </span>
        {/* Bare space so the option's name is "Acme 92", not "Acme92" (flex doesn't render it). */}
        {project.meta !== undefined && ' '}
        {project.meta !== undefined && <span className="shrink-0 text-xs tabular-nums text-text-muted">{project.meta}</span>}
        {onTogglePin && (
          // Mouse shortcut only: keyboard users press Alt+P (a button can't sit inside an option).
          <span
            aria-hidden="true"
            className={cn(
              'flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-surface',
              isPinned ? 'text-primary' : 'text-text-subtle opacity-0 group-hover/project:opacity-100 group-data-[selected=true]/project:opacity-100'
            )}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onTogglePin(project.id);
            }}
          >
            <Pin className={cn('size-3.5!', isPinned && 'fill-current')} />
          </span>
        )}
        <Check aria-hidden="true" className={cn('text-primary', !isSelected && 'invisible')} />
      </CommandItem>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`${label}: ${triggerText}`}
          disabled={disabled}
          className={cn('h-auto min-h-control-md w-full max-w-xs justify-between gap-2 px-3 py-1.5 text-left md:w-60', className)}
        >
          <span className="flex min-w-0 flex-col">
            {showCount && (
              <span className="text-xs font-medium text-text-muted">
                {options.length} {options.length === 1 ? 'project' : 'projects'}
              </span>
            )}
            <span className={cn('truncate text-sm font-semibold', !selected && !allLabel && 'font-medium text-text-muted')}>{triggerText}</span>
          </span>
          <ChevronsUpDown aria-hidden="true" className="shrink-0 text-text-muted" />
        </Button>
      </PopoverTrigger>
      {/* The popover is a dialog, so it needs a name too (axe aria-dialog-name). */}
      <PopoverContent align="start" collisionPadding={12} aria-label={label} className={cn('w-(--radix-popover-trigger-width) min-w-64 p-0', contentClassName)}>
        <Command
          label={label}
          value={highlighted}
          onValueChange={setHighlighted}
          onKeyDown={onKeyDown}
          // Substring match on the (formatted) name, like Data Vault; cmdk's default is fuzzy.
          filter={(itemValue, search, keywords) => {
            const haystack = itemValue === ALL ? (allLabel ?? '') : (keywords ?? []).join(' ');
            return haystack.toLowerCase().includes(search.trim().toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList className="max-h-72">
            <CommandEmpty>{emptyText}</CommandEmpty>
            {allLabel && (
              <CommandGroup>
                <CommandItem value={ALL} onSelect={select} aria-checked={value === null} className="font-medium">
                  <span className="min-w-0 flex-1 truncate">{allLabel}</span>
                  <Check aria-hidden="true" className={cn('text-primary', value !== null && 'invisible')} />
                </CommandItem>
              </CommandGroup>
            )}
            {pinnedProjects.length > 0 && <CommandGroup heading="Pinned">{pinnedProjects.map(renderItem)}</CommandGroup>}
            {pinnedProjects.length > 0 && otherProjects.length > 0 && <CommandSeparator />}
            {otherProjects.length > 0 && (
              <CommandGroup heading={pinnedProjects.length > 0 ? 'All' : undefined}>{otherProjects.map(renderItem)}</CommandGroup>
            )}
          </CommandList>
          {onTogglePin && (
            <p className="border-t border-border px-3 py-2 text-xs text-text-muted">
              <kbd className="font-sans font-semibold">Alt+P</kbd> pins or unpins the highlighted project.
            </p>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { ProjectSwitcher };
