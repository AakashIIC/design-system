// DS-3.5: accessibility and behaviour of the app shell header.
import { forwardRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bell } from 'lucide-react';

import {
  AppHeader,
  AppHeaderActions,
  AppHeaderBack,
  AppHeaderEnd,
  AppHeaderTitle,
  SkipToContent,
} from '../../src/components/app-header.tsx';
import { Button } from '../../src/components/button.tsx';
import { expectNoAxeViolations } from './axe.ts';

const RouterLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
  ({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />
);
RouterLink.displayName = 'RouterLink';

function Page({ onBack = () => {}, toggle }: { onBack?: () => void; toggle?: string }) {
  return (
    <>
      <SkipToContent href="#main" />
      <AppHeader>
        <AppHeaderBack onClick={onBack} />
        <AppHeaderTitle>Performance report</AppHeaderTitle>
        <AppHeaderActions mobileToggleLabel={toggle} aria-label="Report filters" role="group">
          <Button variant="outline">This week</Button>
          <Button>Export</Button>
        </AppHeaderActions>
        <AppHeaderEnd>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell aria-hidden="true" />
          </Button>
        </AppHeaderEnd>
      </AppHeader>
      <main id="main" tabIndex={-1}>
        Report
      </main>
    </>
  );
}

describe('AppHeader', () => {
  it('is a banner with the page h1, a named back button and its actions, and passes axe', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<Page onBack={onBack} />);
    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('heading', { level: 1, name: 'Performance report' })).toBeTruthy();

    // V-Estate's back control was a <div onClick>: no role, no name, not reachable by keyboard.
    const back = within(banner).getByRole('button', { name: 'Go back' });
    back.focus();
    await user.keyboard('{Enter}');
    expect(onBack).toHaveBeenCalledOnce();

    expect(within(banner).getByRole('group', { name: 'Report filters' })).toBeTruthy();
    expect(within(banner).getByRole('button', { name: 'Notifications' })).toBeTruthy();
    await expectNoAxeViolations();
  });

  it('back can be the router link instead of a button', () => {
    render(
      <AppHeader>
        <AppHeaderBack asChild label="Back to projects">
          <RouterLink to="/projects">
            <span aria-hidden="true">‹</span>
          </RouterLink>
        </AppHeaderBack>
        <AppHeaderTitle>Project details</AppHeaderTitle>
      </AppHeader>
    );
    const link = screen.getByRole('link', { name: 'Back to projects' });
    expect(link.getAttribute('href')).toBe('/projects');
    expect(link.hasAttribute('type')).toBe(false);
  });

  it('the title can be another heading level', () => {
    render(
      <AppHeader>
        <AppHeaderTitle asChild>
          <h2>Settings</h2>
        </AppHeaderTitle>
      </AppHeader>
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).toBeTruthy();
  });

  it('on phones, mobileToggleLabel hides the actions behind a toggle that reports its state', async () => {
    const user = userEvent.setup();
    render(<Page toggle="Filters" />);
    const toggle = screen.getByRole('button', { name: 'Filters' });
    const region = screen.getByRole('group', { name: 'Report filters' });
    expect(toggle.getAttribute('aria-controls')).toBe(region.id);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(region.getAttribute('data-mobile-open')).toBe('false');
    expect(region.className).toContain('data-[mobile-open=false]:max-md:hidden');
    // The toggle itself only shows on phones.
    expect(toggle.className).toContain('md:hidden');

    await user.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(region.getAttribute('data-mobile-open')).toBe('true');
    await expectNoAxeViolations();
  });

  it('without a toggle label, the actions just wrap to their own row (no toggle button)', () => {
    render(<Page />);
    expect(screen.queryByRole('button', { name: 'Filters' })).toBeNull();
    const region = screen.getByRole('group', { name: 'Report filters' });
    expect(region.hasAttribute('data-mobile-open')).toBe(false);
    expect(region.className).toContain('basis-full');
  });

  it('gets a border and surface once the page scrolls, and drops them back near the top', () => {
    render(<Page />);
    const banner = screen.getByRole('banner');
    expect(banner.getAttribute('data-scrolled')).toBe('false');
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 40, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(banner.getAttribute('data-scrolled')).toBe('true');
    expect(banner.className).toContain('data-[scrolled=true]:border-border');
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(banner.getAttribute('data-scrolled')).toBe('false');
  });
});

describe('SkipToContent', () => {
  it('is the first Tab stop and points at main', async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.tab();
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    expect(document.activeElement).toBe(skip);
    expect(skip.getAttribute('href')).toBe('#main');
    expect(skip.className).toContain('sr-only');
    expect(skip.className).toContain('focus:not-sr-only');
  });
});
