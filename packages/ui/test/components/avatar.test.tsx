import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Avatar, AvatarFallback, AvatarImage, avatarVariants } from '../../src/components/avatar.tsx';
import { expectNoAxeViolations } from './axe.ts';

describe('Avatar', () => {
  it('renders fallback text when image is absent and passes axe', async () => {
    render(
      <Avatar>
        <AvatarFallback>AV</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText('AV');
    expect(fallback).toBeDefined();
    expect(fallback.className).toContain('bg-surface-muted');
    expect(fallback.className).toContain('text-text');

    await expectNoAxeViolations();
  });

  it('renders with image props', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="Asha Verma" />
        <AvatarFallback>AV</AvatarFallback>
      </Avatar>
    );

    // In jsdom without loading events, fallback is visible or image element exists
    const avatar = screen.getByText('AV').parentElement;
    expect(avatar?.className).toContain('rounded-full');
  });

  it('renders size variants correctly', () => {
    const { rerender } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
    );
    let avatar = screen.getByText('SM').parentElement;
    expect(avatar?.className).toContain('size-control-sm');

    rerender(
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
    );
    avatar = screen.getByText('MD').parentElement;
    expect(avatar?.className).toContain('size-control-md');

    rerender(
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    );
    avatar = screen.getByText('LG').parentElement;
    expect(avatar?.className).toContain('size-control-lg');
  });

  it('exposes avatarVariants for utility use', () => {
    expect(avatarVariants({ size: 'sm' })).toContain('size-control-sm');
    expect(avatarVariants({ size: 'lg' })).toContain('size-control-lg');
  });
});
