# @aakashiic/ui

Shared React components for **Data Vault**, **V-Estate** and the central portal: Radix primitives styled with
Tailwind CSS v4. VRetail is Angular and uses only [`@aakashiic/tokens`](../tokens).

> **Status: Phase 3 in progress.** These are V-Estate's 29 generic shadcn components, restyled to the tokens
> group by group in DS-3.3 (see the [Phase 3 plan](../../docs/phase-3-plan.md)). All 29 now use **only token
> names**:
>
> | Group | Components |
> |---|---|
> | DS-3.3a overlays | dialog, alert-dialog, sheet, popover, tooltip |
> | DS-3.3b buttons | button |
> | DS-3.3c form controls | input, textarea, select, checkbox, radio-group, switch, slider, label, form |
> | DS-3.3d navigation | tabs, dropdown-menu, command |
> | DS-3.3e data display | table, badge, card, progress, skeleton, separator, scroll-area |
> | DS-3.3f the rest | calendar, chart, drawer, sonner (`Toaster`) |
>
> The shared app shell is done too: sidebar (DS-3.4), header (DS-3.5), project switcher (DS-3.6) and app
> switcher (DS-3.7). Next is adopting the package in the apps (Phase 4 for V-Estate, DS-2.5 for Data Vault).

- [1. Install](#1-install)
- [2. Set up your app](#2-set-up-your-app)
- [3. Colours](#3-colours)
- [4. Use the components](#4-use-the-components)
- [5. Pin and upgrade versions](#5-pin-and-upgrade-versions)
- [Troubleshooting](#troubleshooting)

---

## 1. Install

The package is private on GitHub Packages, like `@aakashiic/tokens`. If the app already installs the tokens,
the `.npmrc` and `NPM_TOKEN` are already set up; otherwise follow
[the tokens install steps](../tokens/README.md#1-install) first (access, token, `.npmrc`, CI).

```bash
npm install --save-exact @aakashiic/ui
```

This installs the latest version and pins it exactly (`npm view @aakashiic/ui versions` lists them).

**Peer dependencies.** The app provides these (Data Vault and V-Estate already have them):

| Package | Version | Needed for |
|---|---|---|
| `react`, `react-dom` | 19 | everything |
| `tailwindcss` | 4.1 or later | everything |
| `@aakashiic/tokens` | 0.5.0 or later (adds `overlay`) | every component |
| `lucide-react` | 0.400 or later | icons inside the components |
| `react-day-picker` | 9 | `@aakashiic/ui/calendar` only |
| `recharts` | 2.15 | `@aakashiic/ui/chart` only |
| `cmdk` | 1 | `@aakashiic/ui/command` and `@aakashiic/ui/project-switcher` only |
| `vaul` | 1 | `@aakashiic/ui/drawer` only |
| `react-hook-form` | 7 | `@aakashiic/ui/form` only |

The last five are optional: install one only if you import that component.

---

## 2. Set up your app

Add **one line** to the global CSS (`src/app/globals.css`), after Tailwind and the tokens:

```css
@import "tailwindcss";
@import "@aakashiic/tokens/tokens.css";
@import "@aakashiic/tokens/tailwind.css";
@import "@aakashiic/ui/styles.css";
```

Why it's needed: **Tailwind v4 never scans `node_modules`**, so without it the classes the components use are
never generated and the components render unstyled. `styles.css` does two things:

- `@source` pointing at the package's components, relative to the package itself, so it works however npm
  installs it. You don't need your own `@source` line.
- Imports [`tw-animate-css`](https://github.com/Wombosvideo/tw-animate-css) for the open/close animations
  (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*`).

> **V-Estate:** the app lists `tailwindcss-animate` but never loads it (Tailwind v4 needs `@plugin`, and there
> is no `@config`), so its dialogs, popovers and menus don't animate today. They will once `styles.css` is
> imported. Remove `tailwindcss-animate` from `package.json` at the same time.

No `tailwind.config.js`, PostCSS change or Next.js `transpilePackages` is needed: the package ships plain
JavaScript with `'use client'` already on the components that need it.

### Stacking (`--ds-z-overlay`)

Everything the package portals to `<body>` (dialog, alert-dialog, sheet, drawer and their backdrops, plus
popover, tooltip, dropdown-menu and select) takes its `z-index` from `--ds-z-overlay`. By default that's
`50` (`100` for popovers), shadcn's values. If the app's own fixed chrome (headers, drawers, banners) uses a
higher `z-index`, it shows above the dialogs and their backdrop. Set the variable above the app's highest
chrome layer:

```css
:root {
  --ds-z-overlay: 10000; /* Data Vault: its headers use z-1000 and some popups z-9999 */
}
```

Nested layers still stack correctly with one value: a menu opened from a dialog is portaled after it, so it
paints on top.

---

## 3. Colours

Every component uses only token names (`bg-surface`, `text-text-muted`, `bg-overlay`, …), so it needs
`@aakashiic/tokens` set up as in [section 2](#2-set-up-your-app), with `data-app` on `<html>`, and nothing
else. None of them reads shadcn's colour names (`background`, `muted-foreground`, `popover`, …), so an app
doesn't need to define those for the package.

That includes V-Estate: import the tokens with `data-app="vestate"` before upgrading, or the components lose
their colours.

Careful with `accent` in **your own** code: in shadcn it's a hover background; in the tokens it's the brand
purple. If an app imports the tokens' `tailwind.css` after its own `@theme`, its own `bg-accent` hovers turn
purple. The package's components don't use `accent`.

---

## 4. Use the components

Most components come from the package root:

```tsx
import { Button, Dialog, DialogContent, DialogTrigger, Toaster, cn } from '@aakashiic/ui';
```

accordion, alert-dialog, app-header, app-switcher, badge, button, card, checkbox, collapsible, dialog, dropdown-menu, input, label, popover, progress,
radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner (`Toaster`), switch,
table, tabs, textarea, tooltip, and `cn`.

The six that need an optional peer dependency are only on their own path, so an app without that library can
still import the root:

```tsx
import { Calendar } from '@aakashiic/ui/calendar';
import { ChartContainer } from '@aakashiic/ui/chart';
import { Command } from '@aakashiic/ui/command';
import { Drawer } from '@aakashiic/ui/drawer';
import { Form, FormField } from '@aakashiic/ui/form';
import { ProjectSwitcher } from '@aakashiic/ui/project-switcher';
```

Every component also has its own path (`@aakashiic/ui/button`), and `cn` is at `@aakashiic/ui/utils`.

### Button

```tsx
<Button>Save</Button>                                     {/* primary, 40px */}
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive" loading={isDeleting}>Delete</Button>
<Button size="icon" variant="ghost" aria-label="Edit"><Pencil /></Button>
<Button asChild variant="link"><Link href="/reports">Reports</Link></Button>
```

| Variant | Use for | Looks like |
|---|---|---|
| `default` | The main action | Brand fill: indigo (Data Vault, VRetail), gold with dark text (V-Estate) |
| `secondary` | A strong action that isn't the brand one | Navy in Data Vault, charcoal in V-Estate |
| `outline` | Secondary actions; the unselected half of a toggle group | Neutral border on the surface |
| `ghost` | Toolbars, icon buttons | No background until hovered |
| `muted` | A quiet filled button | Neutral tint |
| `link` | An action that should read as a link | Body text with a brand-coloured underline |
| `destructive`, `success`, `warning` | Delete / approve / block | Tinted background with the strong status colour as text |

Sizes: `default` 40px, `sm` 32px, `lg` 48px, `icon` 40px square, `icon-sm` 32px square (icon buttons need an
`aria-label`). `loading` shows a spinner, disables the button and sets `aria-busy`.

Like HTML, a `Button` without `type` inside a `<form>` submits it. Pass `type="button"` for buttons that
shouldn't. (Data Vault's own button defaults to `type="button"`, so its form buttons already say `submit`.)

To make an alert dialog's action destructive, pass the variant's classes:
`<AlertDialogAction className={buttonVariants({ variant: 'destructive' })}>`.

`DialogContent` and `SheetContent` draw an X in the top-right corner. If the dialog already has its own Close
or Cancel button, pass `showCloseButton={false}` so there's one control per action. Escape and the backdrop
still close it.

### Form controls

```tsx
<Label htmlFor="name" required>Project name</Label>
<Input id="name" required aria-invalid={!!error} aria-describedby="name-error" />
<p id="name-error">…</p>

<Checkbox checked="indeterminate" aria-label="Select all" />
<Slider defaultValue={[20, 80]} thumbLabels={['Minimum price', 'Maximum price']} />
```

- **Fields** (input, textarea, select trigger) are 40px (`h-control-md`) with an 8px radius and the `input`
  border. Focus turns the border to `ring` with a soft halo; `aria-invalid` turns it red. `FormControl`
  sets `aria-invalid` and `aria-describedby` for you.
- **`Label required`** adds a red asterisk that screen readers skip. Also put `required` on the field: that's
  what gets announced.
- **Checkbox, radio and switch** borders and the unchecked switch track meet 3:1 against the surface
  (WCAG 1.4.11), so they use `text-muted` / `text-subtle` rather than the lighter `input` colour.
  `Checkbox` shows a dash for `checked="indeterminate"`.
- **`Slider`** renders one thumb per value, so `defaultValue={[20, 80]}` is a range. The thumbs are what
  screen readers focus, so name them: `thumbLabels`, or `aria-label` (numbered "Price 1 of 2" for ranges).

### Navigation

```tsx
<Tabs defaultValue="calls">
  <TabsList aria-label="Report">
    <TabsTrigger value="calls">Calls</TabsTrigger>
    <TabsTrigger value="leads">Leads</TabsTrigger>
  </TabsList>
  <TabsContent value="calls">…</TabsContent>
</Tabs>

<DropdownMenuItem variant="destructive" onSelect={remove}>Delete</DropdownMenuItem>

<CommandDialog open={open} onOpenChange={setOpen} title="Search projects">…</CommandDialog>
```

- **`Tabs`** is Data Vault's segmented control: a `surface-muted` track with the active tab raised on
  `surface`. Arrow keys move between tabs; disabled tabs are skipped.
- **Menus** (dropdown-menu, command) share the select menu's panel: `rounded-xl`, `bg-surface`, `shadow-md`,
  with the highlighted row on `surface-muted`. Checked items use a `text-primary` check.
- **`DropdownMenuItem variant="destructive"`** colours a delete-style row (`danger-strong`, on `danger-soft`
  when highlighted). Disabled items are now visibly dimmed.
- **`CommandDialog`** takes `title` and `description` (visually hidden, default "Command palette"). The title
  also names the search box.
- **`CommandInput`** keeps `aria-activedescendant` on the highlighted option. cmdk 1.1.1 sets it one step
  late (empty at first, then pointing at an option the filter removed), so screen readers announced the
  wrong option or none.
- Radix menu checkbox items and radio groups are controlled: pass `checked` / `onCheckedChange` and
  `value` / `onValueChange` (there is no `defaultChecked`).

### Data display

```tsx
<Card>
  <CardHeader>
    <CardTitle>Daily snapshot</CardTitle>
    <CardDescription>Since midnight</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>

<Badge variant="success">Active</Badge>
<Progress value={uploaded} max={total} aria-label="Upload" indicatorClassName="bg-success" />
<div aria-busy="true"><span className="sr-only">Loading calls…</span><Skeleton className="h-4 w-40" /></div>
```

- **`Card`** is Data Vault's: `rounded-2xl`, `border-border`, `bg-surface`, no shadow. `className` overrides
  apply (no `!` modifiers).
- **`Table`** has a `surface-muted` header with small uppercase labels, hairline `border-border` rows and a
  soft hover. `data-state="selected"` on a row tints it `primary-soft`. Add `scope="col"` to `TableHead`
  and a `TableCaption` (it can be `sr-only`) so screen readers get the table's name.
- **`Badge`** is a pill: `default` (primary), `secondary`, `outline`, and the statuses `success`, `warning`,
  `danger` (`destructive` is the same) and `info` as soft background + strong text.
- **`Progress`** needs a name (`aria-label` or `aria-labelledby`), or axe reports `aria-progressbar-name`. It
  fills as a share of `max`. `indicatorClassName` takes a status colour. Show the value as text too: the
  bar's colour alone can be below 3:1 against the track.
- **`Skeleton`** is hidden from screen readers and stops pulsing under reduced motion. Put
  `aria-busy="true"` and a text status on the loading region.
- **`ScrollArea`**'s thumb is `text-subtle` (3:1 against the surface), and the viewport shows a focus ring
  when a keyboard user scrolls it.

### Accordion and Collapsible

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Call summary</AccordionTrigger>
    <AccordionContent>Caller enquired about 3-bedroom unit pricing...</AccordionContent>
  </AccordionItem>
</Accordion>

<Collapsible defaultOpen>
  <CollapsibleTrigger asChild><Button variant="ghost">Toggle filters</Button></CollapsibleTrigger>
  <CollapsibleContent>Filters panel content...</CollapsibleContent>
</Collapsible>
```

- **`Accordion`** groups collapsible disclosure panels. Built on `@radix-ui/react-accordion` with `type="single"`
  or `type="multiple"`. Supports `collapsible` so an open panel can be collapsed by clicking again. Triggers
  rotate their Chevron icon on open and support Arrow Up/Down keyboard navigation.
- **`Collapsible`** is a single disclosure control built on `@radix-ui/react-collapsible`. Use `open` + `onOpenChange`
  for controlled state or `defaultOpen`.
- **Migration from DaisyUI:** Replaces DaisyUI `collapse`, `collapse-arrow`, `collapse-title`, and `collapse-content`.
  Does not require `<input type="checkbox" />` hacks inside the container.

### Calendar, chart, drawer and toasts

```tsx
<Calendar mode="range" selected={range} onSelect={setRange} />

const config = {
  calls: { label: 'Calls', color: 'var(--color-chart-1)' },
  leads: { label: 'Leads', color: 'var(--color-chart-2)' },
} satisfies ChartConfig;

<Toaster richColors theme={resolvedTheme} />
```

- **`Calendar`**: the selected day and range ends are `bg-primary`, the middle of a range is `primary-soft`,
  and today is bold on `surface-muted`. Arrow keys move between days.
- **`ChartContainer`**: give series the tokens' chart palette (`var(--color-chart-1)` to `-6`) so charts
  follow the app theme. A `theme: { light, dark }` colour switches on `.dark` or `data-theme="dark"`, like the
  tokens. Tooltips use the token surface.
- **`Drawer`** uses the dialogs' `overlay` scrim and a `rounded-t-2xl` surface. Give it a `DrawerTitle`.
- **`Toaster`** sets sonner's colour variables to the tokens, so plain and `richColors` toasts follow the
  theme. Your own `style` and `toastOptions.classNames` are merged in, not replaced.

### App shell sidebar

```tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarLabel,
  SidebarNav, SidebarNavItem, SidebarProvider, SidebarTrigger, SidebarCollapseButton,
} from '@aakashiic/ui';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <SidebarProvider defaultCollapsed expandOnHover>
      <Sidebar label="Data Vault">
        <SidebarHeader>
          <Logo aria-hidden="true" />
          <SidebarLabel>Data Vault</SidebarLabel>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav label="Main">
            {items.map((item) => (
              <SidebarNavItem key={item.href} asChild icon={<item.Icon />} label={item.label}
                active={pathname === item.href}>
                <Link href={item.href} />
              </SidebarNavItem>
            ))}
          </SidebarNav>
        </SidebarContent>
        <SidebarFooter>{/* account menu, then <SidebarCollapseButton /> */}</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header><SidebarTrigger />…</header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

- **Desktop (md and up):** a fixed sidebar, 256px wide or collapsed to an 80px icon rail
  (`defaultCollapsed`, or control it with `collapsed` / `onCollapsedChange`, e.g. to keep it in a cookie).
  `SidebarCollapseButton` toggles it. `SidebarInset` pads the page to match.
  - **V-Estate** today: full width, no rail. Use the defaults.
  - **Data Vault** today: `defaultCollapsed expandOnHover`. The rail widens over the page on hover **and on
    keyboard focus** (Data Vault's only widened on hover, so keyboard users never saw the labels).
  - A plain rail (`defaultCollapsed` without `expandOnHover`) shows each label as a tooltip on hover or focus.
- **Phones:** the same children render in a left sheet that `SidebarTrigger` (the hamburger, hidden from md up)
  opens. It traps focus, closes on Escape or the scrim, and closes when an item is followed.
- **Items are links.** Pass your router's link with `asChild` (`<Link href="/" />`), or give `href` for a plain
  `<a>`. Data Vault uses `<button>` + `router.push` today: switching to links gives middle-click, "open in new
  tab" and the link role for screen readers. `active` sets `aria-current="page"`; the active item is
  `primary-soft` and semibold, so it doesn't rely on colour alone.
- **Labels** stay in the accessibility tree on the rail (`sr-only` or faded), so every item keeps its name.
  `SidebarLabel` hides any other text (the app name, the user's name) the same way.
- **`badge`** puts a count at the end of an item, read as part of its name ("Manage leads 12").
- The package doesn't know routes, roles or feature flags. Filter the items in the app, as both apps do today.

### App shell header

```tsx
<SidebarProvider>
  <SkipToContent href="#main" />
  <Sidebar>…</Sidebar>
  <SidebarInset>
    <AppHeader>
      <SidebarTrigger />
      <AppHeaderBack onClick={() => router.back()} />
      <AppHeaderTitle>Performance report</AppHeaderTitle>
      <AppHeaderActions mobileToggleLabel="Filters" role="group" aria-label="Report filters">
        <ProjectPicker />
        <DateRangePicker />
        <Button>Export</Button>
      </AppHeaderActions>
      <AppHeaderEnd>
        <NotificationBell />
        <ThemeToggle />
      </AppHeaderEnd>
    </AppHeader>
    <main id="main" tabIndex={-1}>{children}</main>
  </SidebarInset>
</SidebarProvider>
```

- **`AppHeader`** is `sticky` at the top of `SidebarInset`. It needs no spacer, unlike Data Vault's `fixed`
  header with a measured spacer. Once the page scrolls it gains the `surface` background, a border and
  `shadow-sm` (V-Estate's "bg-card when scrolled").
- **`AppHeaderTitle`** is the page's `<h1>` (`asChild` for another level). V-Estate's title is a `<div>` today.
- **`AppHeaderBack`** is a real button named "Go back", or your router's link with `asChild`. V-Estate's is a
  `<div onClick>` today, which a keyboard can't reach and a screen reader can't name.
- **`AppHeaderActions`** holds page filters and actions: inline on desktop, a full-width row under the title
  on phones. With `mobileToggleLabel` the row hides behind a toggle button (`aria-expanded`), like Data
  Vault's "Show filters". Give it `role="group"` and an `aria-label` when it holds filters. V-Estate's
  `HeaderActionPortal` can portal into it.
- **`AppHeaderEnd`** keeps notifications, the theme toggle and the like in the top row on every screen.
- **`SkipToContent`** is a "Skip to content" link that shows only when focused. Put it first and point it at
  `<main id="main" tabIndex={-1}>`, so keyboard users can skip the sidebar on every page.

### Project switcher

```tsx
import { ProjectSwitcher, formatProjectName } from '@aakashiic/ui/project-switcher';

<AppHeaderActions>
  <ProjectSwitcher
    projects={projects.map((p) => ({ id: p.productId, name: p.productName, meta: p.score?.toFixed(0) }))}
    value={selectedProduct?.productId ?? null}
    onValueChange={(id) => dispatch(setSelectedProduct(projects.find((p) => p.productId === id) ?? null))}
    formatName={formatProjectName}
    pinnedIds={pinnedIds}
    onTogglePin={togglePin}
  />
</AppHeaderActions>
```

A searchable project picker in a popover, built on `Command`, so it needs `cmdk` and is only on its own path.

- **`value`** is the selected project id. `null` means "all projects", and the top row (`allLabel`, default
  "All projects") selects it. `allLabel={null}` removes that row when a project must be chosen, as in
  V-Estate; the trigger then shows `placeholder`.
- **Search** matches any part of the name, like Data Vault's dropdown (cmdk's own matching is fuzzy).
  The search is cleared every time it opens.
- **`showCount`** adds V-Estate's "N projects" line above the selected name. **`meta`** puts a detail at the
  end of a row, like Data Vault's score. **`formatName`** changes how names show; `formatProjectName` is Data
  Vault's title-casing, which also turns "L&t" into "L&T".
- **Pins:** `pinnedIds` lists pinned projects in a "Pinned" group at the top. With `onTogglePin`, **Alt+P**
  pins or unpins the highlighted row, and the popover says so. The pin icon is a mouse shortcut. Data Vault
  put a `role="button"` inside each option, which isn't allowed and which screen readers can't reach.
- **Screen readers:** the trigger reads "Project: Acme" (`label`), the popover and search are named, the
  highlighted row is announced as you arrow through, and the current project is `aria-checked`. Rows aren't
  Tab stops: arrows move, Enter picks, and Escape closes and returns focus to the trigger.
- With no projects it renders nothing, like Data Vault's.

### App switcher (central portal)

```tsx
import Link from 'next/link';
import { AppLauncher, AppSwitcher, type AppItem } from '@aakashiic/ui';

const apps: AppItem[] = PORTALS.map((p) => ({
  id: p.id,
  name: p.title,
  category: p.category,
  description: p.description,
  icon: <RenderSVG name={p.svgName} />,
  href: p.isInternal ? '/' : `/select-portal/${p.id}`,
}));

// In the header, on every page:
<AppHeaderEnd>
  <AppSwitcher apps={apps} currentAppId="data-vault" allAppsHref="/select-portal" linkAs={Link}
    onSelect={(app) => posthog.capture('portal_selected', { portal_id: app.id })} />
</AppHeaderEnd>

// The "Select your workspace" page, under its <h1>:
<AppLauncher apps={apps} currentAppId="data-vault" linkAs={Link} />
```

Built from Data Vault's central-portal pages (`select-portal` and the portal rail).

- **`AppSwitcher`** is a grid button for the header ("Switch app"). It opens the apps as tiles in a popover,
  with the current app marked `aria-current="page"`. `allAppsHref` adds an "All workspaces" link to the
  launcher page.
- **`AppLauncher`** is the workspace page: one card per app with its icon, category, name (a heading,
  `headingLevel`, default 2), description and a call to action (`actionLabel`). The current app's card is
  outlined and its action reads "Continue in …".
- **Every app is a link,** with `linkAs` for the router. Data Vault's cards are a `<div role="button">`
  around a second, unfocusable `<button>`, which is nested interactive content; middle-click and "open in new
  tab" don't work on them either. Each launcher card is named by its heading and described by its
  description, not by every line of text in it.
- **`external: true`** apps open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`), always with a
  plain `<a>`, and are announced as "(opens in a new tab)". Data Vault opens other portals in an iframe page
  instead; point `href` at that page (`/select-portal/agent-assist`) to keep doing so.
- **`onSelect`** runs when an app is chosen, before navigation: Data Vault's PostHog `portal_selected` event.
- Roles, feature flags and the `NEXT_PUBLIC_ENV === 'live'` check stay in the app: pass only the apps the user
  may open.

### Differences from V-Estate's own copies

Moving V-Estate from `@/components/ui/*` to this package (Phase 4) is a find-and-replace on the import path,
except for:

- **`Calendar`** no longer reads the project's creation date from the Redux store. Pass the month range
  yourself, or the dropdowns show react-day-picker's default range:
  ```tsx
  const createdAt = useAppSelector((s) => s.user.projectCreatedAt);
  <Calendar
    startMonth={createdAt ? new Date(createdAt) : new Date(2023, 0, 1)}
    endMonth={new Date(new Date().getFullYear(), 11, 1)}
  />
  ```
- **`Toaster`** no longer imports `next-themes`. Pass the theme:
  ```tsx
  const { resolvedTheme } = useTheme();
  <Toaster theme={resolvedTheme as 'light' | 'dark'} />
  ```
- **`Button`** has a different variant set and **defaults to `default` (primary)**; V-Estate's copy defaulted
  to `grey`. Measured on `staging` (18 Nov 2026, 330 buttons):

  | V-Estate today | Uses | Change to |
  |---|---|---|
  | no `variant` (was `grey`) | 56 | `variant="secondary"` (same charcoal look), or nothing to make it primary |
  | `grey` | 4 | `secondary` |
  | `secondary` (light grey), `edit` | 5, 9 | `muted` |
  | `delete` | 6 | `destructive` (now the tinted style; was solid red for `destructive`) |
  | `destructive` | 8 | `destructive` |
  | `green`, `block` | 1, 1 | `success`, `warning` |
  | `default`, `outline`, `ghost`, `link` | ~28, ~150, 91, 2 | unchanged |

  Sizes: `lg` is now 48px (was 44px), and `sm` no longer forces `w-fit`. Add `w-fit` where a small button
  sits in a column and shouldn't stretch.
- **Form controls** keep their props; only the look changes. Two things to check:
  - **Focus** on text fields is now a `ring`-coloured border with a soft halo, not an offset ring.
  - **`Switch`** is 44px wide (was 48px), with a 20px thumb.
- **Navigation** keeps its props. To check:
  - **Tabs:** the active tab is white on a grey track (was `primary-foreground`). Layout overrides on
    `TabsList` such as `grid w-full grid-cols-2` still work.
  - **Dropdown items:** disabled items now look disabled. Swap `text-red-*` classes on delete items for
    `variant="destructive"`, and a `bg-accent` "selected" override for a `DropdownMenuCheckboxItem` or
    `DropdownMenuRadioItem`.
  - **Command:** the separator is hidden from screen readers (cmdk's `role="separator"` isn't allowed inside
    the listbox), and `CommandDialog` now has a hidden title.
- **Data display** keeps its props. To check:
  - **`Card`** no longer forces `rounded-2xl! border! shadow-none!`, so `className` overrides now apply. Cards
    passing `shadow-md`, `shadow-sm`, `rounded-xl` or `rounded-lg` (about 10 on `staging`) will show them for
    the first time: drop the class where the flat card was intended. `CardTitle` is `text-lg` (was `text-2xl`).
  - **`Table`:** header labels are small uppercase `text-text-muted` on `surface-muted` (Data Vault's style),
    and the header no longer reads V-Estate's `--custom-bg`. Cells are `px-4 py-3` (was `p-4`).
  - **`Badge`** is a `<span>` (was a `<div>`), with no hover colour. `default`, `secondary` and `outline` keep
    their names; use `success` / `warning` / `danger` / `info` instead of colour classes for statuses.
  - **`Progress`** is 8px tall and `bg-primary` (was a 16px gold gradient). Most V-Estate uses pass `h-2`
    already. It now respects `max`.
- **Calendar, chart and toasts** keep their props. To check:
  - **Calendar ranges** use `primary-soft` between the ends (was `accent`). Today is bold on `surface-muted`.
  - **Chart tooltips** now show their colour swatches and zero values; both were missing.
  - **Toasts** (`<Toaster richColors …>`) take their colours from the tokens. Status toasts are soft
    background + strong text, the description is `text-muted`, and the action button is primary. Before,
    sonner's own grey beat the shadcn classes, so descriptions and actions ignored the theme.
  - **`Drawer`** isn't used on `staging` today.

---

## 5. Pin and upgrade versions

Same rules as the tokens ([details](../tokens/README.md#5-pin-and-upgrade-versions)): pin an **exact**
version, upgrade one app at a time, read [CHANGELOG.md](./CHANGELOG.md) first, and while the version is `0.x`
treat a minor bump like a major one.

The DS-3.3 releases restyle one group of components each. Each one changes how those components look in every
app that upgrades, so check the screens that use them.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Components render unstyled (no padding, borders or layout) | `@import "@aakashiic/ui/styles.css";` is missing from the global CSS. |
| Layout is right but colours are missing | The tokens aren't imported, or `<html>` has no `data-app`; see [section 3](#3-colours). |
| Dialogs and menus appear without animation | `styles.css` isn't imported (it brings `tw-animate-css`). |
| The app's header or banners show above a dialog's backdrop | Set `--ds-z-overlay` above them; see [Stacking](#stacking---ds-z-overlay). |
| Your own hover backgrounds turn purple | The tokens' `accent` overrides shadcn's; see [section 3](#3-colours). |
| `Module not found: Can't resolve 'recharts'` (or `cmdk`, `vaul`, …) | Install the optional peer dependency for that component. |
| `401` / `404` on install | See the [tokens troubleshooting](../tokens/README.md#troubleshooting). |

## Working on this package

```bash
npm run build      # tsc → dist/ (one file per component, 'use client' kept)
npm run typecheck  # src, tests and the preview
npm test           # build first (and build the tokens): see below
npm run preview    # http://localhost:5180: every component in every app theme; /shell.html: the app shell
```

`npm test` runs two suites:

- **`node --test`** (`test/*.test.js`): package checks against `dist/`: exports, a real Tailwind v4 compile of
  `styles.css`, and **tokens-only**: every restyled file may use only token colours, radii, shadows and
  motion, and no `dark:`. Add a component to `RESTYLED` in `test/tokens-only.test.js` when its group lands.
- **Vitest** (`test/components/*.test.tsx`, jsdom): accessibility and behaviour per component: roles and
  accessible names, focus moving in and back out, Escape, focus trapping, and an axe-core scan
  (colour contrast excluded: jsdom has no CSS; the token pairs are contrast-checked in the tokens package).

### Restyling a group (DS-3.3)

1. Replace shadcn names with token names; check the [tokens README](../tokens/README.md#4-use-the-tokens) for
   which one fits. Shared overlay classes live in `src/lib/overlay.ts`.
2. Add the files to `RESTYLED`, write the Vitest file for the group, and add a section to `preview/main.tsx`.
3. Check every theme in the preview, at desktop and phone width.
4. Changeset: **minor** (it changes how the components look in every app that upgrades), listing what changed.
