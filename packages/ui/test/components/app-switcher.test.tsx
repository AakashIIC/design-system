// DS-3.7: accessibility and behaviour of the app switcher and launcher.
import { forwardRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Headphones, Phone, Presentation, Database } from 'lucide-react';

import { AppLauncher, AppSwitcher, type AppItem } from '../../src/components/app-switcher.tsx';
import { expectNoAxeViolations } from './axe.ts';

const APPS: AppItem[] = [
  { id: 'data-vault', name: 'Data Vault', href: '/', icon: <Database />, category: 'Speech intelligence', description: 'Call QA and analytics.' },
  { id: 'agent-assist', name: 'Agent Assist', href: '/portal/agent-assist', icon: <Headphones />, description: 'Live in-call guidance.' },
  { id: 'cloud-calling', name: 'Cloud Calling', href: '/portal/cloud-calling', icon: <Phone /> },
  { id: 'showcase', name: 'Showcase', href: 'https://showcase.example.com', icon: <Presentation />, external: true, description: 'Try the AI on sample calls.' },
];

// Stands in for next/link.
const RouterLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => (
  <a ref={ref} data-router-link="" {...props} />
));
RouterLink.displayName = 'RouterLink';

// jsdom can't navigate; keep link clicks from logging "not implemented".
document.addEventListener('click', (e) => {
  if ((e.target as Element).closest?.('a')) e.preventDefault();
});

describe('AppSwitcher', () => {
  it('opens a named list of app links with the current one marked, and passes axe', async () => {
    const user = userEvent.setup();
    render(<AppSwitcher apps={APPS} currentAppId="data-vault" allAppsHref="/select-portal" linkAs={RouterLink} />);
    const trigger = screen.getByRole('button', { name: 'Switch app' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await user.click(trigger);

    const popover = await screen.findByRole('dialog', { name: 'Switch app' });
    const nav = within(popover).getByRole('navigation', { name: 'Switch app' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((l) => l.textContent)).toEqual(['Data Vault', 'Agent Assist', 'Cloud Calling', 'Showcase (opens in a new tab)']);

    const current = within(nav).getByRole('link', { name: 'Data Vault' });
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.hasAttribute('data-router-link')).toBe(true);
    expect(within(popover).getByRole('link', { name: /All workspaces/ }).getAttribute('href')).toBe('/select-portal');
    await expectNoAxeViolations(popover);
  });

  it('external apps open in a new tab with a plain <a>, and say so', async () => {
    const user = userEvent.setup();
    render(<AppSwitcher apps={APPS} linkAs={RouterLink} />);
    await user.click(screen.getByRole('button', { name: 'Switch app' }));
    const showcase = await screen.findByRole('link', { name: 'Showcase (opens in a new tab)' });
    expect(showcase.getAttribute('target')).toBe('_blank');
    expect(showcase.getAttribute('rel')).toBe('noopener noreferrer');
    expect(showcase.hasAttribute('data-router-link')).toBe(false);
  });

  it('choosing an app calls onSelect and closes; Escape closes and returns focus', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<AppSwitcher apps={APPS} onSelect={onSelect} />);
    const trigger = screen.getByRole('button', { name: 'Switch app' });

    await user.click(trigger);
    await user.click(await screen.findByRole('link', { name: 'Cloud Calling' }));
    expect(onSelect).toHaveBeenCalledWith(APPS[2]);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    await user.click(trigger);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('is reachable with Tab inside the popover (links, not a menu)', async () => {
    const user = userEvent.setup();
    render(<AppSwitcher apps={APPS} allAppsHref="/select-portal" />);
    await user.click(screen.getByRole('button', { name: 'Switch app' }));
    await screen.findByRole('dialog');
    await waitFor(() => expect(document.activeElement?.closest('[role=dialog]')).toBeTruthy());
    const seen: string[] = [];
    for (let i = 0; i < 5; i++) {
      if (document.activeElement?.tagName === 'A') seen.push(document.activeElement.textContent ?? '');
      await user.tab();
    }
    expect(seen.length).toBeGreaterThanOrEqual(4);
  });
});

describe('AppLauncher', () => {
  it('renders one link per app, named by its heading and described by its text, and passes axe', async () => {
    render(
      <main>
        <h1>Select your workspace</h1>
        <AppLauncher apps={APPS} currentAppId="data-vault" linkAs={RouterLink} />
      </main>
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
    // Each card is one link; nothing interactive is nested inside it.
    for (const link of links) expect(link.querySelector('a, button, [role=button], [tabindex]')).toBeNull();

    const dv = screen.getByRole('link', { name: 'Data Vault' });
    expect(dv.getAttribute('aria-current')).toBe('page');
    expect(dv.getAttribute('aria-describedby')).toBeTruthy();
    expect(document.getElementById(dv.getAttribute('aria-describedby')!)?.textContent).toBe('Call QA and analytics.');
    expect(screen.getByRole('heading', { level: 2, name: 'Data Vault' })).toBeTruthy();

    const showcase = screen.getByRole('link', { name: 'Showcase' });
    const description = showcase
      .getAttribute('aria-describedby')!
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .join(' ');
    expect(description).toBe('Try the AI on sample calls. (opens in a new tab)');
    await expectNoAxeViolations();
  });

  it('headingLevel and actionLabel are configurable; onSelect fires on click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <AppLauncher
        apps={APPS}
        currentAppId="agent-assist"
        headingLevel={3}
        actionLabel={(app, current) => (current ? 'Back to it' : `Launch ${app.name}`)}
        onSelect={onSelect}
      />
    );
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(screen.getByText('Back to it')).toBeTruthy();
    expect(screen.getByText('Launch Cloud Calling')).toBeTruthy();
    await user.click(screen.getByRole('link', { name: 'Cloud Calling' }));
    expect(onSelect).toHaveBeenCalledWith(APPS[2]);
  });
});
