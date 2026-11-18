import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BarChart3, Bell, Calendar, Database, Download, Headphones, Home, LogOut, MessageSquare, Phone, Presentation, Settings, Sparkles, Users } from 'lucide-react';

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
import { Button } from '../src/components/button.tsx';
import { ProjectSwitcher, formatProjectName, type Project } from '../src/components/project-switcher.tsx';
import { AppLauncher, AppSwitcher, type AppItem } from '../src/components/app-switcher.tsx';
import {
  AppHeader,
  AppHeaderActions,
  AppHeaderBack,
  AppHeaderEnd,
  AppHeaderTitle,
  SkipToContent,
} from '../src/components/app-header.tsx';
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

const PROJECTS: Project[] = [
  { id: 'p1', name: 'retail rollout q4', meta: 92 },
  { id: 'p2', name: 'l&t towers', meta: 71 },
  { id: 'p3', name: 'harbour view residences', meta: 64 },
  { id: 'p4', name: 'green valley', meta: 58 },
];

const APPS: AppItem[] = [
  { id: 'data-vault', name: 'Data Vault', href: '#', icon: <Database />, category: 'Speech intelligence', description: 'Call QA, insights and lead analytics.' },
  { id: 'agent-assist', name: 'Agent Assist', href: '#agent-assist', icon: <Headphones />, category: 'Real-time copilot', description: 'Live guidance during calls.' },
  { id: 'cloud-calling', name: 'Cloud Calling', href: '#cloud-calling', icon: <Phone />, category: 'Telephony', description: 'Outbound dialer and cloud telephony.' },
  { id: 'showcase', name: 'Showcase', href: 'https://example.com', icon: <Presentation />, category: 'Product demo', description: 'Try the AI on sample calls.', external: true },
];

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
  const [project, setProject] = useState<string | null>(null);
  const [pins, setPins] = useState<string[]>(['p2']);

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
      <SkipToContent href="#main" />
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
        <AppHeader>
          <SidebarTrigger />
          <AppHeaderBack onClick={() => setActive('#overview')} />
          <AppHeaderTitle>{MAIN.find((i) => i.href === active)?.label ?? 'Settings'}</AppHeaderTitle>
          <AppHeaderActions mobileToggleLabel="Filters" role="group" aria-label="Page filters">
            <Button variant="outline">
              <Calendar aria-hidden="true" /> This week
            </Button>
            <ProjectSwitcher
              projects={PROJECTS}
              value={project}
              onValueChange={setProject}
              showCount
              formatName={formatProjectName}
              pinnedIds={pins}
              onTogglePin={(id) => setPins((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
            />
            <Button>
              <Download aria-hidden="true" /> Export
            </Button>
          </AppHeaderActions>
          <AppHeaderEnd>
            <AppSwitcher apps={APPS} currentAppId="data-vault" allAppsHref="#workspaces" />
            <Button variant="ghost" size="icon" aria-label="Notifications, 3 unread">
              <Bell aria-hidden="true" />
            </Button>
          </AppHeaderEnd>
        </AppHeader>
        <main id="main" tabIndex={-1} className="flex flex-col gap-6 p-6 outline-none">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i} className={i === 0 ? 'hidden' : undefined}>
              <CardContent className="p-6 text-sm text-text-muted">Report section {i}: scroll to see the header pick up its border.</CardContent>
            </Card>
          ))}
          <Card id="workspaces" className="scroll-mt-24">
            <CardHeader>
              <CardTitle>Select your workspace (DS-3.7)</CardTitle>
              <CardDescription>The central portal's launcher: each card is one link. The grid button in the header switches apps from anywhere.</CardDescription>
            </CardHeader>
            <CardContent>
              <AppLauncher apps={APPS} currentAppId="data-vault" headingLevel={3} onSelect={(app) => console.info('app selected', app.id)} />
            </CardContent>
          </Card>
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
