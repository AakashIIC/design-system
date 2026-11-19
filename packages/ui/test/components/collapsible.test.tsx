import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../../src/components/collapsible.tsx';
import { expectNoAxeViolations } from './axe.ts';

describe('Collapsible', () => {
  it('toggles visibility and sets aria-expanded on trigger click', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: 'Toggle details' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Hidden content')).toBeNull();

    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Hidden content')).toBeDefined();

    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Hidden content')).toBeNull();

    await expectNoAxeViolations();
  });

  it('supports defaultOpen and keyboard activation', async () => {
    const user = userEvent.setup();
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Section toggle</CollapsibleTrigger>
        <CollapsibleContent>Expanded by default</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: 'Section toggle' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Expanded by default')).toBeDefined();

    trigger.focus();
    await user.keyboard('{Enter}');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await user.keyboard(' ');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await expectNoAxeViolations();
  });
});
