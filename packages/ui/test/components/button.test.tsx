// DS-3.3b: accessibility and behaviour of Button.
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { Trash2 } from 'lucide-react';

import { Button, buttonVariants } from '../../src/components/button.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../src/components/alert-dialog.tsx';
import { expectNoAxeViolations } from './axe.ts';

const VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'muted', 'link', 'destructive', 'success', 'warning'] as const;
const SIZES = ['default', 'xs', 'sm', 'lg'] as const;

describe('Button', () => {
  it('renders every variant and size accessibly', async () => {
    render(
      <div>
        {VARIANTS.flatMap((variant) =>
          SIZES.map((size) => (
            <Button key={`${variant}-${size}`} variant={variant} size={size}>
              {variant} {size}
            </Button>
          ))
        )}
        <Button size="icon" aria-label="Delete row">
          <Trash2 />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Delete row">
          <Trash2 />
        </Button>
      </div>
    );
    expect(screen.getAllByRole('button')).toHaveLength(VARIANTS.length * SIZES.length + 2);
    await expectNoAxeViolations();
  });

  it('axe flags an icon button with no accessible name (the check works)', async () => {
    render(
      <Button size="icon">
        <Trash2 aria-hidden="true" />
      </Button>
    );
    const { violations } = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(violations.map((v) => v.id)).toContain('button-name');
  });

  it('defaults to the primary variant at 40px', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.className).toContain('bg-primary');
    expect(button.className).toContain('text-on-primary');
    expect(button.className).toContain('h-control-md');
    expect(button.className).toContain('rounded-lg');
  });

  it('uses tinted backgrounds with strong text for the status variants', () => {
    render(
      <>
        <Button variant="destructive">Delete</Button>
        <Button variant="success">Approve</Button>
        <Button variant="warning">Block</Button>
      </>
    );
    expect(screen.getByRole('button', { name: 'Delete' }).className).toMatch(/bg-danger-soft.*text-danger-strong/);
    expect(screen.getByRole('button', { name: 'Approve' }).className).toMatch(/bg-success-soft.*text-success-strong/);
    expect(screen.getByRole('button', { name: 'Block' }).className).toMatch(/bg-warning-soft.*text-warning-strong/);
  });

  it('supports xs as a compact size', () => {
    render(<Button size="xs">Compact</Button>);
    const compact = screen.getByRole('button', { name: 'Compact' });
    expect(compact.className).toContain('h-6');
    expect(compact.className).toContain('px-2');
    expect(compact.className).toContain('text-xs');
    expect(compact.className).toContain('rounded-md');
  });

  it('activates with click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });

    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('does nothing when disabled and is skipped by Tab', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <Button disabled onClick={onClick}>
          Save
        </Button>
        <Button>Next</Button>
      </>
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.tab();

    expect(onClick).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Next' }));
  });

  it('shows a hidden spinner, sets aria-busy and blocks clicks while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save' });

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    // The spinner is decorative inside the button: no nested status live region.
    expect(button.querySelector('[role="status"]')).toBeNull();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
    await expectNoAxeViolations();
  });

  it('renders its child with button styles when asChild is set', async () => {
    render(
      <Button asChild variant="outline">
        <a href="/reports">Reports</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Reports' });

    expect(link.getAttribute('href')).toBe('/reports');
    expect(link.className).toContain('border-input');
    expect(screen.queryByRole('button')).toBeNull();
    await expectNoAxeViolations();
  });

  it('merges a className over the variant', () => {
    render(<Button className="w-full px-8">Continue</Button>);
    const button = screen.getByRole('button', { name: 'Continue' });

    expect(button.className).toContain('w-full');
    expect(button.className).toContain('px-8');
    expect(button.className).not.toContain('px-4');
  });

  it('exposes buttonVariants for styling other elements', () => {
    expect(buttonVariants({ variant: 'ghost', size: 'icon' })).toMatch(/hover:bg-surface-muted.*size-control-md/);
  });
});

describe('AlertDialog actions (use buttonVariants)', () => {
  it('styles Action as the primary button and Cancel as outline', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete project</AlertDialogTrigger>
        <AlertDialogContent aria-describedby={undefined}>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );
    await user.click(screen.getByRole('button', { name: 'Delete project' }));

    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('bg-primary');
    expect(screen.getByRole('button', { name: 'Cancel' }).className).toContain('border-input');
  });
});
