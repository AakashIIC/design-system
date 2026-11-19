import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../src/components/accordion.tsx';
import { expectNoAxeViolations } from './axe.ts';

describe('Accordion', () => {
  it('opens and closes panels in single mode and passes axe', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Question 2</AccordionTrigger>
          <AccordionContent>Answer 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole('button', { name: 'Question 1' });
    const trigger2 = screen.getByRole('button', { name: 'Question 2' });

    expect(trigger1.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Answer 1')).toBeNull();

    await user.click(trigger1);
    expect(trigger1.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Answer 1')).toBeDefined();

    // Clicking trigger 2 closes trigger 1 in single mode
    await user.click(trigger2);
    expect(trigger1.getAttribute('aria-expanded')).toBe('false');
    expect(trigger2.getAttribute('aria-expanded')).toBe('true');
    expect(screen.queryByText('Answer 1')).toBeNull();
    expect(screen.getByText('Answer 2')).toBeDefined();

    await expectNoAxeViolations();
  });

  it('supports multiple open items in multiple mode', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple" defaultValue={['item-1']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole('button', { name: 'Section 1' });
    const trigger2 = screen.getByRole('button', { name: 'Section 2' });

    expect(trigger1.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Content 1')).toBeDefined();

    await user.click(trigger2);
    expect(trigger1.getAttribute('aria-expanded')).toBe('true');
    expect(trigger2.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Content 1')).toBeDefined();
    expect(screen.getByText('Content 2')).toBeDefined();

    await expectNoAxeViolations();
  });

  it('supports keyboard navigation between accordion triggers', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>First item</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole('button', { name: 'First item' });
    const trigger2 = screen.getByRole('button', { name: 'Second item' });

    trigger1.focus();
    expect(document.activeElement).toBe(trigger1);

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(trigger2);

    await user.keyboard('{Enter}');
    expect(trigger2.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Content 2')).toBeDefined();
  });
});
