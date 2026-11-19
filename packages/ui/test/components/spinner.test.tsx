import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Spinner, spinnerVariants } from '../../src/components/spinner.tsx';
import { expectNoAxeViolations } from './axe.ts';

describe('Spinner', () => {
  it('renders with role="status" and default accessible label', async () => {
    render(<Spinner />);
    const status = screen.getByRole('status');
    expect(status).toBeDefined();
    expect(status.textContent).toBe('Loading...');
    expect(status.className).toContain('text-primary');

    const svg = status.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('class')).toContain('animate-spin');
    expect(svg?.getAttribute('class')).toContain('size-6'); // default md size

    await expectNoAxeViolations();
  });

  it('supports custom label for screen readers', async () => {
    render(<Spinner label="Processing payment..." />);
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Processing payment...');
    await expectNoAxeViolations();
  });

  it('allows suppressing the label when embedded in an already-labelled control', () => {
    render(<Spinner label="" />);
    const status = screen.getByRole('status');
    expect(status.querySelector('.sr-only')).toBeNull();
  });

  it('renders all size variants correctly', () => {
    const { rerender } = render(<Spinner size="sm" />);
    let svg = screen.getByRole('status').querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('size-4');

    rerender(<Spinner size="md" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('size-6');

    rerender(<Spinner size="lg" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('size-8');
  });

  it('merges custom className for colour overrides', () => {
    render(<Spinner className="text-text-muted" />);
    const status = screen.getByRole('status');
    expect(status.className).toContain('text-text-muted');
    expect(status.className).not.toContain('text-primary');
  });

  it('exposes spinnerVariants for utility use', () => {
    expect(spinnerVariants({ size: 'sm' })).toContain('size-4');
    expect(spinnerVariants({ size: 'lg' })).toContain('size-8');
  });
});
