import { StrictMode, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BarChart3, Info, Pencil, Plus, Search, Trash2, Users } from 'lucide-react';

import './preview.css';
import { Button } from '../src/components/button.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../src/components/avatar.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../src/components/alert-dialog.tsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../src/components/dialog.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../src/components/popover.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../src/components/sheet.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../src/components/tooltip.tsx';
import { Input } from '../src/components/input.tsx';
import { Textarea } from '../src/components/textarea.tsx';
import { Label } from '../src/components/label.tsx';
import { Checkbox } from '../src/components/checkbox.tsx';
import { RadioGroup, RadioGroupItem } from '../src/components/radio-group.tsx';
import { Switch } from '../src/components/switch.tsx';
import { Slider } from '../src/components/slider.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../src/components/select.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/components/tabs.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../src/components/table.tsx';
import { Badge } from '../src/components/badge.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../src/components/card.tsx';
import { Progress } from '../src/components/progress.tsx';
import { Skeleton } from '../src/components/skeleton.tsx';
import { Separator } from '../src/components/separator.tsx';
import { ScrollArea } from '../src/components/scroll-area.tsx';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '../src/components/calendar.tsx';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../src/components/chart.tsx';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../src/components/drawer.tsx';
import { Toaster } from '../src/components/sonner.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../src/components/dropdown-menu.tsx';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../src/components/command.tsx';

function Field({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

const THEMES = [
  { id: 'datavault', label: 'Data Vault' },
  { id: 'vretail', label: 'VRetail' },
  { id: 'vestate', label: 'V-Estate' },
  { id: 'vestate-dark', label: 'V-Estate dark' },
] as const;
type ThemeId = (typeof THEMES)[number]['id'];

const BUTTON_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'muted', 'link', 'destructive', 'success', 'warning'] as const;

function Section({ title, status, children }: { title: string; status: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">{status}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

function NavigationDemo() {
  const [archived, setArchived] = useState(true);
  const [range, setRange] = useState('week');
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="calls">
        <TabsList aria-label="Report">
          <TabsTrigger value="calls">
            <BarChart3 aria-hidden="true" /> Calls
          </TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="agents">
            <Users aria-hidden="true" /> Agents
          </TabsTrigger>
          <TabsTrigger value="archive" disabled>
            Archive
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calls" className="text-sm text-text-muted">
          1,284 calls this week.
        </TabsContent>
        <TabsContent value="leads" className="text-sm text-text-muted">
          312 new leads.
        </TabsContent>
        <TabsContent value="agents" className="text-sm text-text-muted">
          18 agents online.
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Project actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Q4 retail rollout</DropdownMenuLabel>
            <DropdownMenuItem>
              <Pencil aria-hidden="true" /> Rename <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Duplicate</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Retail</DropdownMenuItem>
                <DropdownMenuItem>Real estate</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2 aria-hidden="true" /> Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">View options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuCheckboxItem checked={archived} onCheckedChange={setArchived}>
              Show archived calls
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Range</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={range} onValueChange={setRange}>
              <DropdownMenuRadioItem value="day">Today</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="week">This week</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="month">This month</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" onClick={() => setPaletteOpen(true)}>
          <Search aria-hidden="true" /> Open command palette
        </Button>
        <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
          <CommandInput placeholder="Type a command or search" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Go to">
              <CommandItem onSelect={() => setPaletteOpen(false)}>Daily snapshot</CommandItem>
              <CommandItem onSelect={() => setPaletteOpen(false)}>Lead management</CommandItem>
              <CommandItem onSelect={() => setPaletteOpen(false)}>Bookmarks</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => setPaletteOpen(false)}>
                <Plus aria-hidden="true" /> New project <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <Command label="Find an agent" className="max-w-sm border border-border shadow-sm">
        <CommandInput placeholder="Search agents" />
        <CommandList>
          <CommandEmpty>No agents found.</CommandEmpty>
          <CommandGroup heading="Agents">
            <CommandItem>Asha Verma</CommandItem>
            <CommandItem>Ravi Kumar</CommandItem>
            <CommandItem disabled>Meera Iyer (on leave)</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

const AGENTS = [
  { name: 'Asha Verma', calls: 42, status: 'success', label: 'Online' },
  { name: 'Ravi Kumar', calls: 37, status: 'warning', label: 'On a call' },
  { name: 'Meera Iyer', calls: 0, status: 'secondary', label: 'On leave' },
  { name: 'Dev Shah', calls: 18, status: 'danger', label: 'Missed 3' },
] as const;

function DataDisplayDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {(['default', 'secondary', 'outline', 'success', 'warning', 'danger', 'info'] as const).map((v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily snapshot</CardTitle>
            <CardDescription>Calls and leads since midnight.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-3xl font-semibold">1,284</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span id="pv-target">Weekly target</span>
                <span className="text-text-muted">64%</span>
              </div>
              <Progress value={64} aria-labelledby="pv-target" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span id="pv-quota">Storage used</span>
                <span className="text-text-muted">180 of 200 GB</span>
              </div>
              <Progress value={180} max={200} aria-labelledby="pv-quota" indicatorClassName="bg-warning" />
            </div>
          </CardContent>
          <CardFooter className="text-xs text-text-muted">Updated 5 minutes ago</CardFooter>
        </Card>

        <Card aria-busy="true">
          <CardHeader>
            <span className="sr-only">Loading leads…</span>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-2 w-2/3 rounded-full" />
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableCaption className="sr-only">Agents today</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Agent</TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col" className="text-right">
                Calls
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AGENTS.map((a, i) => (
              <TableRow key={a.name} data-state={i === 1 ? 'selected' : undefined}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell>
                  <Badge variant={a.status}>{a.label}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{a.calls}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex flex-wrap items-start gap-6">
        <ScrollArea className="h-40 w-56 rounded-xl border border-border" aria-label="Recent calls">
          <div className="p-3">
            <p className="mb-2 text-sm font-semibold">Recent calls</p>
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i}>
                <p className="py-1.5 text-sm">Call #{1284 - i}</p>
                {i < 15 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex h-6 items-center gap-3 text-sm">
          <span>Calls</span>
          <Separator orientation="vertical" />
          <span>Leads</span>
          <Separator orientation="vertical" />
          <span>Agents</span>
        </div>
      </div>
    </div>
  );
}

const CHART_DATA = [
  { day: 'Mon', calls: 186, leads: 80 },
  { day: 'Tue', calls: 305, leads: 120 },
  { day: 'Wed', calls: 237, leads: 0 },
  { day: 'Thu', calls: 273, leads: 190 },
  { day: 'Fri', calls: 209, leads: 130 },
];
const CHART_CONFIG = {
  calls: { label: 'Calls', color: 'var(--color-chart-1)' },
  leads: { label: 'Leads', color: 'var(--color-chart-2)' },
} satisfies ChartConfig;

function RestDemo() {
  const [range, setRange] = useState<DateRange | undefined>({ from: new Date(2026, 10, 9), to: new Date(2026, 10, 13) });

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-start gap-6">
        <Card className="w-fit">
          <Calendar mode="range" selected={range} onSelect={setRange} defaultMonth={new Date(2026, 10, 1)} />
        </Card>
        <Card className="min-w-0 flex-1 p-4">
          <p className="mb-2 text-sm font-semibold">Calls and leads this week</p>
          <ChartContainer config={CHART_CONFIG} className="h-56 w-full">
            <BarChart data={CHART_DATA} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="calls" fill="var(--color-calls)" radius={4} />
              <Bar dataKey="leads" fill="var(--color-leads)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Call filters</DrawerTitle>
              <DrawerDescription>Narrow the list by agent, date and outcome.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Apply</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Button
          variant="outline"
          onClick={() =>
            toast('Report saved', {
              description: 'Shared with everyone on the project.',
              action: { label: 'Undo', onClick: () => {} },
            })
          }
        >
          Toast
        </Button>
        <Button variant="outline" onClick={() => toast.success('Lead assigned to Asha Verma')}>
          Success toast
        </Button>
        <Button variant="outline" onClick={() => toast.error('Could not reach the dialler', { description: 'Retrying in 30 seconds.' })}>
          Error toast
        </Button>
        <Button variant="outline" onClick={() => toast.warning('Storage is 90% full')}>
          Warning toast
        </Button>
      </div>
    </div>
  );
}

function Preview() {
  const [theme, setTheme] = useState<ThemeId>('datavault');

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.app = theme === 'vestate-dark' ? 'vestate' : theme;
    html.classList.toggle('dark', theme === 'vestate-dark');
  }, [theme]);

  return (
    <TooltipProvider delayDuration={200}>
      <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">@aakashiic/ui</h1>
            <p className="text-sm text-text-muted">
              Every component on the tokens. Pick an app theme, or open the{' '}
              <a href="./shell.html" className="font-medium text-text underline decoration-primary underline-offset-4">
                app shell preview
              </a>
              .
            </p>
          </div>
          <div role="radiogroup" aria-label="App theme" className="flex flex-wrap gap-1 rounded-lg bg-surface-muted p-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={theme === t.id}
                onClick={() => setTheme(t.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  theme === t.id ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <Section title="Button" status="DS-3.3b">
          <div className="flex w-full flex-col gap-4">
            {(['default', 'sm', 'lg'] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-3">
                {BUTTON_VARIANTS.map((variant) => (
                  <Button key={variant} variant={variant} size={size}>
                    {variant}
                  </Button>
                ))}
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3">
              <Button>
                <Plus aria-hidden="true" /> New project
              </Button>
              <Button size="icon" variant="outline" aria-label="Add">
                <Plus />
              </Button>
              <Button size="icon-sm" variant="ghost" aria-label="Delete">
                <Trash2 />
              </Button>
              <Button loading>Saving</Button>
              <Button disabled>Disabled</Button>
              <Button asChild variant="link">
                <a href="#button">A link styled as a button</a>
              </Button>
            </div>
          </div>
        </Section>

        <Section title="Form controls" status="DS-3.3c">
          <div className="grid w-full gap-6 md:grid-cols-2">
            <Field>
              <Label htmlFor="pv-name" required>
                Project name
              </Label>
              <Input id="pv-name" required placeholder="e.g. Q4 retail rollout" />
              <p className="text-sm text-text-muted">Everyone on the project sees this.</p>
            </Field>
            <Field>
              <Label htmlFor="pv-email">Email</Label>
              <Input id="pv-email" type="email" defaultValue="asha@" aria-invalid="true" aria-describedby="pv-email-error" />
              <p id="pv-email-error" className="text-sm font-medium text-danger-strong">
                Enter a full email address.
              </p>
            </Field>
            <Field>
              <Label htmlFor="pv-agent">Agent</Label>
              <Select>
                <SelectTrigger id="pv-agent">
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asha">Asha Verma</SelectItem>
                  <SelectItem value="ravi">Ravi Kumar</SelectItem>
                  <SelectItem value="meera" disabled>
                    Meera Iyer (on leave)
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="pv-disabled">Workspace ID</Label>
              <Input id="pv-disabled" disabled defaultValue="ws_48213" />
            </Field>
            <Field>
              <Label htmlFor="pv-notes">Notes</Label>
              <Textarea id="pv-notes" placeholder="Anything the team should know" />
            </Field>
            <Field>
              <span className="text-sm font-medium">Budget range</span>
              <Slider defaultValue={[25, 75]} thumbLabels={['Minimum budget', 'Maximum budget']} className="py-2" />
              <span className="text-sm font-medium">Volume</span>
              <Slider defaultValue={[40]} aria-label="Volume" className="py-2" />
            </Field>
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox id="pv-c1" defaultChecked />
                <Label htmlFor="pv-c1">Email me a weekly summary</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="pv-c2" />
                <Label htmlFor="pv-c2">Include archived calls</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="pv-c3" checked="indeterminate" />
                <Label htmlFor="pv-c3">Select all agents</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="pv-s1" defaultChecked />
                <Label htmlFor="pv-s1">Live transcription</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="pv-s2" />
                <Label htmlFor="pv-s2">Auto-assign leads</Label>
              </div>
            </Field>
            <Field>
              <span className="text-sm font-medium" id="pv-plan">
                Billing
              </span>
              <RadioGroup defaultValue="monthly" aria-labelledby="pv-plan">
                {[
                  ['monthly', 'Monthly'],
                  ['yearly', 'Yearly (save 20%)'],
                  ['custom', 'Custom contract'],
                ].map(([value, label]) => (
                  <div key={value} className="flex items-center gap-2">
                    <RadioGroupItem value={value} id={`pv-r-${value}`} />
                    <Label htmlFor={`pv-r-${value}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Field>
          </div>
        </Section>

        <Section title="Navigation" status="DS-3.3d">
          <NavigationDemo />
        </Section>

        <Section title="Data display" status="DS-3.3e">
          <DataDisplayDemo />
        </Section>

        <Section title="Calendar, chart, drawer and toasts" status="DS-3.3f">
          <RestDemo />
        </Section>

        <Section title="Dialog" status="DS-3.3a">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit project</DialogTitle>
                <DialogDescription>Change the project name. Everyone on the project sees the new name.</DialogDescription>
              </DialogHeader>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Project name
                <input
                  defaultValue="Q4 retail rollout"
                  className="h-control-md rounded-lg border border-input bg-surface px-3 text-sm font-regular focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section title="Alert dialog" status="DS-3.3a">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Delete project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                <AlertDialogDescription>
                  Its calls, reports and settings are removed for everyone. This can't be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>

        <Section title="Sheet" status="DS-3.3a">
          {(['right', 'left', 'top', 'bottom'] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline">Sheet: {side}</Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow the call list by agent, date and outcome.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          ))}
        </Section>

        <Section title="Popover and tooltip" status="DS-3.3a">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent aria-label="Share">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Share report</p>
                <p className="text-sm text-text-muted">Anyone on the project with the link can view it.</p>
              </div>
            </PopoverContent>
          </Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <Info className="size-4" aria-hidden="true" /> Hover or focus me
              </Button>
            </TooltipTrigger>
            <TooltipContent>Calls longer than 30 seconds</TooltipContent>
          </Tooltip>
        </Section>

        <Section title="Avatar" status="DS-2.5">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <span className="text-xs text-text-muted">sm (32px)</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar size="default">
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <span className="text-sm text-text-muted">default (40px)</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar size="lg">
                <AvatarFallback>DV</AvatarFallback>
              </Avatar>
              <span className="text-base text-text-muted">lg (48px)</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Sarah Chen" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <span className="text-sm text-text-muted">with image</span>
            </div>
          </div>
        </Section>
      </main>
      {/* Same setup as V-Estate's layout. */}
      <Toaster richColors closeButton position="bottom-center" theme={theme === 'vestate-dark' ? 'dark' : 'light'} />
    </TooltipProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preview />
  </StrictMode>
);
