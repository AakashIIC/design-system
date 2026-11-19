// cn(): later Tailwind classes replace earlier ones, including the token control sizes.
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { cn } from '../../src/lib/utils.ts';
import { Button } from '../../src/components/button.tsx';

const classes = (s: string) => s.split(' ').sort();

describe('cn with token control sizes', () => {
  it('lets a caller height replace h-control-*', () => {
    expect(classes(cn('h-control-md px-4', 'h-8'))).toEqual(classes('px-4 h-8'));
    expect(classes(cn('h-control-sm', 'h-auto'))).toEqual(['h-auto']);
    expect(classes(cn('h-8', 'h-control-lg'))).toEqual(['h-control-lg']);
  });

  it('handles size, min-h and w the same way', () => {
    expect(cn('size-control-sm', 'size-6')).toBe('size-6');
    expect(cn('min-h-control-md', 'min-h-0')).toBe('min-h-0');
    expect(cn('w-control-md', 'w-full')).toBe('w-full');
  });

  it('keeps unrelated classes and the default text and radius behaviour', () => {
    expect(classes(cn('h-control-md px-4', 'py-2'))).toEqual(classes('h-control-md px-4 py-2'));
    expect(cn('text-sm', 'text-2xs')).toBe('text-2xs');
    expect(cn('rounded-lg', 'rounded-full')).toBe('rounded-full');
  });
});

describe('Button with a custom height', () => {
  it('drops the size height when the caller passes one', () => {
    render(
      <>
        <Button size="sm" className="h-10">Tall</Button>
        <Button className="h-auto">Inline</Button>
      </>
    );
    const tall = screen.getByRole('button', { name: 'Tall' }).className.split(' ');
    expect(tall).toContain('h-10');
    expect(tall).not.toContain('h-control-sm');
    const inline = screen.getByRole('button', { name: 'Inline' }).className.split(' ');
    expect(inline).toContain('h-auto');
    expect(inline).not.toContain('h-control-md');
  });
});
