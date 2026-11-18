import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BarChart3, Database, Home, LogOut, MessageSquare, Settings, Sparkles, Users } from 'lucide-react';

import './preview.css';
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
} from '../src/components/sidebar.tsx';
import { Badge } from '../src/components/badge.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../src/components/card.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../src/components/dropdown-menu.tsx';

const THEMES = [
  { id: 'datavault', label: 'Data Vault' },
  { id: 'vretail', label: 'VRetail' },
  { id: 'vestate', label: 'V-Estate' },
  { id: 'vestate-dark', label: 'V-Estate dark' },
] as const;
type ThemeId = (typeof THEMES)[number]['id'];

const MAIN = [
  { href: '#overview', label: 'Overview', icon: <Home /> },
  { href: '#calls', label: 'Top calls analysis', icon: <BarChart3 /> },
  { href: '#agents', label: 'Sales agent calls', icon: <Users /> },
  { href: '#vault', label: 'Data Vault +', icon: <Database /> },
  { href: '#chat', label: 'AI chat', icon: <MessageSquare /> },
  { href: '#leads', label: 'Manage leads', icon: <Sparkles />, badge: <Badge variant="info">12</Badge> },
];

function Shell() {
  const [theme, setTheme] = useState<ThemeId>('datavault');
  const [mode, setMode] = useState<'full' | 'rail' | 'hover'>('full');
  const [active, setActive] = useState('#overview');

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.app = theme === 'vestate-dark' ? 'vestate' : theme;
    html.classList.toggle('dark', theme === 'vestate-dark');
  }, [theme]);

  const go = (href: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setActive(href);
  };

  return (
    <SidebarProvider
      key={mode}
      defaultCollapsed={mode !== 'full'}
      expandOnHover={mode === 'hover'}
    >
      <Sidebar label="Data Vault">
        <SidebarHeader>
          <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-on-primary">
            DV
          </span>
          <SidebarLabel className="text-lg font-semibold">Data Vault</SidebarLabel>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav label="Main">
            {MAIN.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                active={active === item.href}
                onClick={go(item.href)}
              />
            ))}
          </SidebarNav>
          <SidebarNav label="Workspace" heading="Workspace">
            <SidebarNavItem href="#settings" icon={<Settings />} label="Settings" active={active === '#settings'} onClick={go('#settings')} />
          </SidebarNav>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl p-1.5 text-left outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring">
              <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold">
                AV
              </span>
              <SidebarLabel className="flex flex-col">
                <span className="text-sm font-semibold">Asha Verma</span>
                <span className="text-xs text-text-muted">Team lead</span>
              </SidebarLabel>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuLabel>asha@example.com</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Product tour</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut aria-hidden="true" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SidebarCollapseButton className="self-start" />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">{MAIN.find((i) => i.href === active)?.label ?? 'Settings'}</h1>
        </header>
        <main className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>App shell sidebar (DS-3.4)</CardTitle>
              <CardDescription>
                Resize below 768px for the phone layout: the hamburger opens the same nav in a sheet.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <fieldset className="flex flex-wrap gap-2">
                <legend className="mb-2 text-sm font-medium">Desktop mode</legend>
                {(
                  [
                    ['full', 'Full (V-Estate)'],
                    ['rail', 'Icon rail + tooltips'],
                    ['hover', 'Rail, expands on hover (Data Vault)'],
                  ] as const
                ).map(([value, text]) => (
                  <label key={value} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                    <input type="radio" name="mode" checked={mode === value} onChange={() => setMode(value)} />
                    {text}
                  </label>
                ))}
              </fieldset>
              <fieldset className="flex flex-wrap gap-2">
                <legend className="mb-2 text-sm font-medium">Theme</legend>
                {THEMES.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                    <input type="radio" name="theme" checked={theme === t.id} onChange={() => setTheme(t.id)} />
                    {t.label}
                  </label>
                ))}
              </fieldset>
              <a href="./" className="text-sm font-medium underline decoration-primary underline-offset-4">
                Back to the component preview
              </a>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Shell />
  </StrictMode>
);
