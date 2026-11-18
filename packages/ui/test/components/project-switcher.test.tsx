// DS-3.6: accessibility and behaviour of the project switcher.
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ProjectSwitcher, formatProjectName, type Project, type ProjectSwitcherProps } from '../../src/components/project-switcher.tsx';
import { expectNoAxeViolations } from './axe.ts';

const PROJECTS: Project[] = [
  { id: 'p1', name: 'retail rollout', meta: 92 },
  { id: 'p2', name: 'l&t towers', meta: 71 },
  { id: 'p3', name: 'harbour view' },
];

function Switcher(props: Partial<ProjectSwitcherProps> & { initial?: string | null; onChange?: (id: string | null) => void }) {
  const { initial = null, onChange, ...rest } = props;
  const [value, setValue] = useState<string | null>(initial);
  return (
    <ProjectSwitcher
      projects={PROJECTS}
      value={value}
      onValueChange={(id) => {
        setValue(id);
        onChange?.(id);
      }}
      {...rest}
    />
  );
}

const trigger = () => screen.getByRole('combobox', { name: /^Project:/ });

describe('ProjectSwitcher', () => {
  it('the trigger says what it picks and what is picked, and passes axe', async () => {
    render(<Switcher initial="p1" showCount />);
    expect(trigger().getAttribute('aria-label')).toBe('Project: retail rollout');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().textContent).toContain('3 projects');
    await expectNoAxeViolations();
  });

  it('opens with focus in the search, filters by substring, and selects with Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switcher onChange={onChange} />);
    await user.click(trigger());

    const search = await screen.findByRole('combobox', { name: 'Project' });
    await waitFor(() => expect(document.activeElement).toBe(search));
    // The highlighted row is announced (cmdk lags a step; CommandInput fixes it).
    const active = () => document.getElementById(search.getAttribute('aria-activedescendant') ?? '')?.textContent;
    expect(active()).toBe('All projects');

    await user.type(search, 'view');
    await waitFor(() => expect(screen.queryByRole('option', { name: /retail/ })).toBeNull());
    await waitFor(() => expect(active()).toBe('harbour view'));
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenLastCalledWith('p3');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(document.activeElement).toBe(trigger());
    expect(trigger().getAttribute('aria-label')).toBe('Project: harbour view');

    // Reopening starts with an empty search and the full list.
    await user.click(trigger());
    const again = await screen.findByRole('combobox', { name: 'Project' });
    expect((again as HTMLInputElement).value).toBe('');
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  it('marks the current project aria-checked, offers "All projects", and Escape closes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switcher initial="p2" onChange={onChange} />);
    await user.click(trigger());
    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).getByRole('option', { name: 'l&t towers 71' }).getAttribute('aria-checked')).toBe('true');
    expect(within(listbox).getByRole('option', { name: /retail/ }).getAttribute('aria-checked')).toBe('false');
    const popover = screen.getByRole('dialog', { name: 'Project' });
    expect(popover.contains(listbox)).toBe(true);
    await expectNoAxeViolations(popover);

    await user.click(within(listbox).getByRole('option', { name: 'All projects' }));
    expect(onChange).toHaveBeenLastCalledWith(null);

    await user.click(trigger());
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(document.activeElement).toBe(trigger());
  });

  it('allLabel={null} removes the "all" row and shows the placeholder', async () => {
    const user = userEvent.setup();
    render(<Switcher allLabel={null} placeholder="Choose a project" />);
    expect(trigger().getAttribute('aria-label')).toBe('Project: Choose a project');
    await user.click(trigger());
    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).queryByRole('option', { name: /All projects/ })).toBeNull();
    expect(within(listbox).getAllByRole('option')).toHaveLength(3);
  });

  it('shows the empty state when nothing matches, and renders nothing with no projects', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Switcher />);
    await user.click(trigger());
    await user.type(await screen.findByRole('combobox', { name: 'Project' }), 'zzz');
    expect(await screen.findByText('No projects found.')).toBeTruthy();
    unmount();

    const { container } = render(<ProjectSwitcher projects={[]} value={null} onValueChange={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('pins: a Pinned group, "pinned" in the name, and Alt+P on the highlighted row', async () => {
    const user = userEvent.setup();
    function Pinnable() {
      const [pins, setPins] = useState<string[]>(['p3']);
      return (
        <Switcher
          pinnedIds={pins}
          onTogglePin={(id) => setPins((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
        />
      );
    }
    render(<Pinnable />);
    await user.click(trigger());
    const listbox = await screen.findByRole('listbox');
    const pinnedGroup = within(listbox).getByRole('group', { name: 'Pinned' });
    expect(within(pinnedGroup).getByRole('option', { name: 'harbour view, pinned' })).toBeTruthy();
    expect(screen.getByText(/pins or unpins the highlighted project/)).toBeTruthy();
    await expectNoAxeViolations(listbox);

    // Highlight "retail rollout" and pin it from the keyboard.
    const search = screen.getByRole('combobox', { name: 'Project' });
    await user.type(search, 'retail');
    await waitFor(() =>
      expect(document.getElementById(search.getAttribute('aria-activedescendant') ?? '')?.textContent).toMatch(/^retail rollout/)
    );
    await user.keyboard('{Alt>}p{/Alt}');
    await user.clear(search);
    await waitFor(() =>
      expect(within(screen.getByRole('group', { name: 'Pinned' })).getByRole('option', { name: 'retail rollout, pinned 92' })).toBeTruthy()
    );
    // Pinning doesn't select or close.
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(trigger().getAttribute('aria-label')).toBe('Project: All projects');
  });

  it('formatName applies to the trigger, rows and search (Data Vault title-casing)', async () => {
    const user = userEvent.setup();
    render(<Switcher initial="p2" formatName={formatProjectName} />);
    expect(trigger().getAttribute('aria-label')).toBe('Project: L&T Towers');
    await user.click(trigger());
    expect(await screen.findByRole('option', { name: 'Retail Rollout 92' })).toBeTruthy();
    expect(formatProjectName('L&t TOWERS phase-2')).toBe('L&T Towers Phase-2');
  });
});
