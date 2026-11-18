// DS-3.4: accessibility and behaviour of the app shell sidebar.
import { forwardRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BarChart3, Home, Users } from 'lucide-react';

import {
  Sidebar,
  SidebarCollapseButton,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarLabel,
  SidebarNav,
  SidebarNavItem,
  SidebarProvider,
  SidebarTrigger,
  type SidebarProviderProps,
} from '../../src/components/sidebar.tsx';
import { expectNoAxeViolations } from './axe.ts';

// Stands in for next/link: a router link component the app passes with asChild.
const RouterLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
  ({ to, ...props }, ref) => <a ref={ref} href={to} data-router-link="" {...props} />
);
RouterLink.displayName = 'RouterLink';

function Shell(props: SidebarProviderProps & { onNavigate?: (event: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const { onNavigate, ...providerProps } = props;
  return (
    <SidebarProvider {...providerProps}>
      <Sidebar label="Data Vault">
        <SidebarHeader>
          <SidebarLabel>Data Vault</SidebarLabel>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav label="Main">
            <SidebarNavItem asChild icon={<Home />} label="Overview" active onClick={onNavigate}>
              <RouterLink to="/" />
            </SidebarNavItem>
            <SidebarNavItem href="/reports" icon={<BarChart3 />} label="Performance report" onClick={onNavigate} />
            <SidebarNavItem href="/leads" icon={<Users />} label="Manage leads" badge={<span>12</span>} />
          </SidebarNav>
        </SidebarContent>
        <SidebarFooter>
          <SidebarCollapseButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header>
          <SidebarTrigger />
        </header>
        <main>Page</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

const desktop = () => screen.getByRole('complementary', { name: 'Data Vault' });

describe('Sidebar', () => {
  it('is a named landmark with a nav of real links, the current page marked, and passes axe', async () => {
    render(<Shell />);
    const nav = within(desktop()).getByRole('navigation', { name: 'Main' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((l) => l.textContent)).toEqual(['Overview', 'Performance report', 'Manage leads 12']);
    expect(within(nav).getByRole('link', { name: 'Manage leads 12' })).toBeTruthy();

    const overview = within(nav).getByRole('link', { name: 'Overview' });
    expect(overview.getAttribute('aria-current')).toBe('page');
    expect(overview.getAttribute('href')).toBe('/');
    // asChild renders the app's router link, with the icon and label inside it.
    expect(overview.hasAttribute('data-router-link')).toBe(true);
    expect(overview.querySelector('svg')).toBeTruthy();
    expect(within(nav).getByRole('link', { name: 'Performance report' }).hasAttribute('aria-current')).toBe(false);
    await expectNoAxeViolations();
  });

  it('collapses to a rail: labels stay as accessible names, the inset follows, and the button says so', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    render(<Shell onCollapsedChange={onCollapsedChange} />);
    const toggle = within(desktop()).getByRole('button', { name: 'Collapse sidebar' });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    await user.click(toggle);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(desktop().getAttribute('data-collapsed')).toBe('true');
    const expand = within(desktop()).getByRole('button', { name: 'Expand sidebar' });
    expect(expand.getAttribute('aria-expanded')).toBe('false');

    // The label is visually hidden on the rail but still names the link.
    const report = within(desktop()).getByRole('link', { name: 'Performance report' });
    expect(within(report).getByText('Performance report').className).toContain('sr-only');
    expect(document.querySelector('[data-slot=sidebar-inset]')!.className).toContain('md:pl-(--sidebar-width-collapsed)');
    await expectNoAxeViolations();
  });

  it('shows the label as a tooltip when a rail item gets keyboard focus', async () => {
    const user = userEvent.setup();
    render(<Shell defaultCollapsed />);
    // Start on the first rail link, then Tab to the next one like a keyboard user.
    within(desktop()).getByRole('link', { name: 'Overview' }).focus();
    await user.keyboard('{Tab}');
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toBe('Performance report');
  });

  it('expandOnHover keeps labels in the tree (faded, not sr-only) and has no tooltips', async () => {
    const user = userEvent.setup();
    render(<Shell defaultCollapsed expandOnHover />);
    const report = within(desktop()).getByRole('link', { name: 'Performance report' });
    const label = within(report).getByText('Performance report');
    expect(label.className).not.toContain('sr-only');
    expect(label.className).toContain('group-focus-within/sidebar:opacity-100');
    expect(desktop().className).toContain('focus-within:w-(--sidebar-width)');
    report.focus();
    await user.keyboard('{Tab}');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('a controlled `collapsed` wins over clicks until the app updates it', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [collapsed, setCollapsed] = useState(false);
      return <Shell collapsed={collapsed} onCollapsedChange={setCollapsed} />;
    }
    render(<Controlled />);
    await user.click(within(desktop()).getByRole('button', { name: 'Collapse sidebar' }));
    expect(desktop().getAttribute('data-collapsed')).toBe('true');
  });

  it('a controlled `collapsed` the app never updates stays put', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    render(<Shell collapsed={false} onCollapsedChange={onCollapsedChange} />);
    await user.click(within(desktop()).getByRole('button', { name: 'Collapse sidebar' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(desktop().getAttribute('data-collapsed')).toBe('false');
  });

  it('on phones the trigger opens the same nav in a named sheet, which closes after navigating', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<Shell onNavigate={onNavigate} />);
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await user.click(trigger);

    const sheet = await screen.findByRole('dialog', { name: 'Navigation' });
    const nav = within(sheet).getByRole('navigation', { name: 'Main' });
    // Labels are always visible in the sheet, and there's no collapse button there.
    expect(within(nav).getByText('Performance report').className).not.toContain('sr-only');
    expect(within(sheet).queryByRole('button', { name: /sidebar/ })).toBeNull();
    await expectNoAxeViolations(sheet);

    // The app's onClick ran (here it prevents the jsdom navigation), so the sheet stays open...
    await user.click(within(nav).getByRole('link', { name: 'Performance report' }));
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('closes the sheet when a mobile item is followed', async () => {
    const user = userEvent.setup();
    // Swallow jsdom's "navigation not implemented" by cancelling at the document, after our handler runs.
    const cancel = (e: Event) => e.preventDefault();
    document.addEventListener('click', cancel);
    render(<Shell />);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    const sheet = await screen.findByRole('dialog', { name: 'Navigation' });
    await user.click(within(sheet).getByRole('link', { name: 'Manage leads 12' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded')).toBe('false');
    document.removeEventListener('click', cancel);
  });
});
