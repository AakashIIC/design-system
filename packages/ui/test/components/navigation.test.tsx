// DS-3.3d: accessibility and behaviour of the navigation components (tabs, dropdown-menu, command).
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/components/tabs.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../../src/components/dropdown-menu.tsx';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../../src/components/command.tsx';
import { Button } from '../../src/components/button.tsx';
import { expectNoAxeViolations } from './axe.ts';

function ReportTabs() {
  return (
    <Tabs defaultValue="calls">
      <TabsList aria-label="Report">
        <TabsTrigger value="calls">Calls</TabsTrigger>
        <TabsTrigger value="leads">Leads</TabsTrigger>
        <TabsTrigger value="archive" disabled>
          Archive
        </TabsTrigger>
        <TabsTrigger value="agents">Agents</TabsTrigger>
      </TabsList>
      <TabsContent value="calls">Call list</TabsContent>
      <TabsContent value="leads">Lead list</TabsContent>
      <TabsContent value="agents">Agent list</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('links each tab to its panel and passes axe', async () => {
    render(<ReportTabs />);
    expect(screen.getByRole('tablist', { name: 'Report' })).toBeTruthy();
    const calls = screen.getByRole('tab', { name: 'Calls' });
    expect(calls.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel', { name: 'Calls' }).textContent).toBe('Call list');
    await expectNoAxeViolations();
  });

  it('is one Tab stop; arrow keys move and select, skipping disabled tabs', async () => {
    const user = userEvent.setup();
    render(<ReportTabs />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Calls' }));

    await user.keyboard('{ArrowRight}');
    const leads = screen.getByRole('tab', { name: 'Leads' });
    expect(document.activeElement).toBe(leads);
    expect(leads.getAttribute('aria-selected')).toBe('true');

    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Agents' }));
    expect(screen.getByRole('tabpanel').textContent).toBe('Agent list');

    // Tab leaves the list and lands on the active panel.
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('tabpanel'));
  });

  it('raises the active tab with token classes', () => {
    render(<ReportTabs />);
    expect(screen.getByRole('tablist').className).toContain('bg-surface-muted');
    const active = screen.getByRole('tab', { name: 'Calls' });
    expect(active.className).toContain('data-[state=active]:bg-surface');
    expect(active.getAttribute('data-state')).toBe('active');
  });
});

function ActionsMenu({ onRename = () => {}, onDelete = () => {} }: { onRename?: () => void; onDelete?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onRename}>
          Rename <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('opens from the keyboard, skips disabled items and returns focus on Escape', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<ActionsMenu onDelete={onDelete} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await user.keyboard('{Enter}');

    const menu = await screen.findByRole('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: /Rename/ })));

    // Duplicate is disabled, so ArrowDown goes straight to Delete.
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(screen.getByRole('menuitem', { name: 'Duplicate' }).getAttribute('aria-disabled')).toBe('true');
    await expectNoAxeViolations(menu);

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(document.activeElement).toBe(trigger);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('runs an item on click and closes', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<ActionsMenu onRename={onRename} />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(await screen.findByRole('menuitem', { name: /Rename/ }));
    expect(onRename).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('colours the destructive item and dims disabled ones with tokens', async () => {
    const user = userEvent.setup();
    render(<ActionsMenu />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const del = await screen.findByRole('menuitem', { name: 'Delete' });
    expect(del.className).toContain('text-danger-strong');
    expect(del.getAttribute('data-variant')).toBe('destructive');
    const dup = screen.getByRole('menuitem', { name: 'Duplicate' });
    expect(dup.hasAttribute('data-disabled')).toBe(true);
    expect(dup.className).toContain('data-disabled:opacity-50');
    expect(screen.getByRole('menu').className).toContain('bg-surface');
  });

  it('checkbox and radio items report their state', async () => {
    const user = userEvent.setup();
    // Radix menu checkbox items and radio groups are controlled only (no defaultChecked / defaultValue).
    function ViewMenu() {
      const [archived, setArchived] = useState(true);
      const [range, setRange] = useState('week');
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">View</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={archived}
              onCheckedChange={setArchived}
              onSelect={(e) => e.preventDefault()}
            >
              Show archived
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={range} onValueChange={setRange}>
              <DropdownMenuRadioItem value="day">Day</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="week">Week</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    render(<ViewMenu />);
    await user.click(screen.getByRole('button', { name: 'View' }));
    const archived = await screen.findByRole('menuitemcheckbox', { name: 'Show archived' });
    expect(archived.getAttribute('aria-checked')).toBe('true');
    await user.click(archived);
    expect(archived.getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('menuitemradio', { name: 'Week' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('menuitemradio', { name: 'Day' }).getAttribute('aria-checked')).toBe('false');
    await expectNoAxeViolations(screen.getByRole('menu'));
  });
});

function AgentPicker({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <Command label="Find an agent">
      <CommandInput placeholder="Search agents" />
      <CommandList>
        <CommandEmpty>No agents found.</CommandEmpty>
        <CommandGroup heading="Agents">
          <CommandItem onSelect={onSelect}>Asha Verma</CommandItem>
          <CommandItem onSelect={onSelect}>Ravi Kumar</CommandItem>
          <CommandItem onSelect={onSelect} disabled>
            Meera Iyer
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={onSelect}>
            Invite agent <CommandShortcut>⌘I</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe('Command', () => {
  it('filters as you type, shows the empty state and passes axe', async () => {
    const user = userEvent.setup();
    render(<AgentPicker onSelect={() => {}} />);
    const input = screen.getByRole('combobox', { name: 'Find an agent' });
    await expectNoAxeViolations();

    await user.type(input, 'ravi');
    await waitFor(() => expect(screen.queryByRole('option', { name: 'Asha Verma' })).toBeNull());
    expect(screen.getByRole('option', { name: 'Ravi Kumar' })).toBeTruthy();

    await user.clear(input);
    await user.type(input, 'zzz');
    expect(await screen.findByText('No agents found.')).toBeTruthy();
  });

  it('moves with arrow keys, runs on Enter and never runs a disabled item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<AgentPicker onSelect={onSelect} />);
    await user.click(screen.getByRole('combobox'));

    const asha = screen.getByRole('option', { name: 'Asha Verma' });
    expect(asha.getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Ravi Kumar' }).getAttribute('aria-selected')).toBe('true');
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenLastCalledWith('Ravi Kumar');

    const meera = screen.getByRole('option', { name: 'Meera Iyer' });
    expect(meera.getAttribute('aria-disabled')).toBe('true');
    await user.click(meera);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('keeps aria-activedescendant on the highlighted option (cmdk 1.1.1 lags a step)', async () => {
    const user = userEvent.setup();
    render(<AgentPicker onSelect={() => {}} />);
    const input = screen.getByRole('combobox');
    const list = screen.getByRole('listbox');
    const active = () => {
      const id = input.getAttribute('aria-activedescendant');
      expect(list.getAttribute('aria-activedescendant')).toBe(id);
      return id ? document.getElementById(id)?.textContent : undefined;
    };

    expect(active()).toBe('Asha Verma');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(active()).toBe('Ravi Kumar');
    await user.type(input, 'invite');
    await waitFor(() => expect(active()).toMatch(/^Invite agent/));
    await user.clear(input);
    await user.type(input, 'zzz');
    await waitFor(() => expect(input.hasAttribute('aria-activedescendant')).toBe(false));
  });

  it('dims only disabled items (cmdk sets data-disabled="false" on the rest)', () => {
    render(<AgentPicker onSelect={() => {}} />);
    const asha = screen.getByRole('option', { name: 'Asha Verma' });
    expect(asha.getAttribute('data-disabled')).toBe('false');
    expect(asha.className).toContain('data-[disabled=true]:opacity-50');
    expect(asha.className).not.toMatch(/(^|\s)data-disabled:/);
  });

  it('CommandDialog is a named dialog with a working search', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CommandDialog open>
        <CommandInput placeholder="Type a command" />
        <CommandList>
          <CommandGroup heading="Go to">
            <CommandItem onSelect={onSelect}>Daily snapshot</CommandItem>
            <CommandItem onSelect={onSelect}>Lead management</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    );
    const dialog = screen.getByRole('dialog', { name: 'Command palette' });
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
    // The search box takes the dialog's title as its name.
    const input = screen.getByRole('combobox', { name: 'Command palette' });
    await user.type(input, 'lead{Enter}');
    expect(onSelect).toHaveBeenCalledWith('Lead management');
    // aria-activedescendant follows the filter to the one match (see the cmdk fix in CommandInput).
    await waitFor(() => {
      const active = document.getElementById(input.getAttribute('aria-activedescendant') ?? '');
      expect(active?.textContent).toBe('Lead management');
    });
    await expectNoAxeViolations(dialog);
  });
});
