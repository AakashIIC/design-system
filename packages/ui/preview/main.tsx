import { StrictMode, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Info } from 'lucide-react';

import './preview.css';
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

const THEMES = [
  { id: 'datavault', label: 'Data Vault' },
  { id: 'vretail', label: 'VRetail' },
  { id: 'vestate', label: 'V-Estate' },
  { id: 'vestate-dark', label: 'V-Estate dark' },
] as const;
type ThemeId = (typeof THEMES)[number]['id'];

// Triggers only. Button itself is restyled in DS-3.3b, so the preview uses its own token-styled buttons.
function PreviewButton({ variant = 'primary', ...props }: React.ComponentProps<'button'> & { variant?: 'primary' | 'outline' }) {
  const look =
    variant === 'primary'
      ? 'bg-primary text-on-primary hover:bg-primary-hover'
      : 'border border-input bg-surface text-text hover:bg-surface-muted';
  return (
    <button
      type="button"
      className={`inline-flex h-control-md items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors duration-(--ds-motion-duration-fast) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${look}`}
      {...props}
    />
  );
}

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
            <p className="text-sm text-text-muted">Components restyled to the tokens so far. Pick an app theme.</p>
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

        <Section title="Dialog" status="DS-3.3a">
          <Dialog>
            <DialogTrigger asChild>
              <PreviewButton>Open dialog</PreviewButton>
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
                  <PreviewButton variant="outline">Cancel</PreviewButton>
                </DialogClose>
                <DialogClose asChild>
                  <PreviewButton>Save</PreviewButton>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section title="Alert dialog" status="DS-3.3a · buttons in DS-3.3b">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <PreviewButton variant="outline">Delete project</PreviewButton>
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
                <PreviewButton variant="outline">Sheet: {side}</PreviewButton>
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
              <PreviewButton variant="outline">Open popover</PreviewButton>
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
              <PreviewButton variant="outline">
                <Info className="size-4" aria-hidden="true" /> Hover or focus me
              </PreviewButton>
            </TooltipTrigger>
            <TooltipContent>Calls longer than 30 seconds</TooltipContent>
          </Tooltip>
        </Section>
      </main>
    </TooltipProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preview />
  </StrictMode>
);
