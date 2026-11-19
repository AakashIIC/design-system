// DS-3.3a: accessibility and behaviour of the overlays (dialog, alert-dialog, sheet, popover, tooltip).
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../src/components/dialog.tsx';
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
} from '../../src/components/alert-dialog.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../src/components/sheet.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../src/components/popover.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../src/components/tooltip.tsx';
import { expectNoAxeViolations } from './axe.ts';

describe('Dialog', () => {
  function renderDialog() {
    return render(
      <Dialog>
        <DialogTrigger>Edit profile</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Change your name and email.</DialogDescription>
          </DialogHeader>
          <label>
            Name <input defaultValue="Asha" />
          </label>
          <DialogFooter>
            <button type="button">Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  it('opens as a labelled modal dialog and moves focus inside', async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));

    const dialog = screen.getByRole('dialog', { name: 'Edit profile' });
    // Modal: the rest of the page is hidden from assistive tech (Radix sets aria-hidden on it).
    expect(screen.queryByRole('button', { name: 'Edit profile' })).toBeNull();
    expect(dialog.getAttribute('aria-describedby')).toBe(screen.getByText('Change your name and email.').id);
    expect(dialog.contains(document.activeElement)).toBe(true);
    await expectNoAxeViolations();
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderDialog();
    const trigger = screen.getByRole('button', { name: 'Edit profile' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('closes with the labelled close button', async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('keeps Tab inside the dialog', async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    const dialog = screen.getByRole('dialog');
    for (let i = 0; i < 5; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('uses token classes for the backdrop and panel', async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole('button', { name: 'Edit profile' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('bg-surface');
    expect(dialog.className).toContain('rounded-2xl');
    const backdrop = document.querySelector('[data-state="open"].bg-overlay');
    expect(backdrop).not.toBeNull();
  });
});

describe('AlertDialog', () => {
  function renderAlert(onDelete = vi.fn()) {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete project</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
    return onDelete;
  }

  it('opens as a labelled alertdialog with focus on Cancel', async () => {
    const user = userEvent.setup();
    renderAlert();
    await user.click(screen.getByRole('button', { name: 'Delete project' }));

    const alert = screen.getByRole('alertdialog', { name: 'Delete this project?' });
    expect(alert.getAttribute('aria-describedby')).toBe(screen.getByText("This can't be undone.").id);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
    await expectNoAxeViolations();
  });

  it('does not close when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    renderAlert();
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    const backdrop = document.querySelector('.bg-overlay');
    expect(backdrop).not.toBeNull();
    await user.click(backdrop as Element);

    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });

  it('runs the action and closes', async () => {
    const user = userEvent.setup();
    const onDelete = renderAlert();
    await user.click(screen.getByRole('button', { name: 'Delete project' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onDelete).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  });

  it('closes with Cancel and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderAlert();
    const trigger = screen.getByRole('button', { name: 'Delete project' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });
});

describe('Sheet', () => {
  function renderSheet(side?: 'top' | 'right' | 'bottom' | 'left') {
    render(
      <Sheet>
        <SheetTrigger>Filters</SheetTrigger>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow down the list.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  it('opens as a labelled modal dialog on the right by default', async () => {
    const user = userEvent.setup();
    renderSheet();
    await user.click(screen.getByRole('button', { name: 'Filters' }));

    const sheet = screen.getByRole('dialog', { name: 'Filters' });
    expect(sheet.className).toContain('right-0');
    expect(sheet.className).toContain('bg-surface');
    await expectNoAxeViolations();
  });

  it('opens on the side it is given', async () => {
    const user = userEvent.setup();
    renderSheet('left');
    await user.click(screen.getByRole('button', { name: 'Filters' }));

    expect(screen.getByRole('dialog').className).toContain('left-0');
  });

  it('closes with Escape and with the close button', async () => {
    const user = userEvent.setup();
    renderSheet();
    const trigger = screen.getByRole('button', { name: 'Filters' });

    await user.click(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});

describe('Popover', () => {
  function renderPopover() {
    render(
      <Popover>
        <PopoverTrigger>Share</PopoverTrigger>
        <PopoverContent aria-label="Share options">
          <button type="button">Copy link</button>
        </PopoverContent>
      </Popover>
    );
  }

  it('toggles aria-expanded and shows its content', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const content = screen.getByRole('dialog', { name: 'Share options' });
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);
    expect(content.className).toContain('bg-surface');
    await expectNoAxeViolations();
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button', { name: 'Share' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('no longer forces icons inside it to the primary colour', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: 'Share' }));

    expect(screen.getByRole('dialog').className).not.toContain('[&_svg]:text-primary');
  });
});

describe('Tooltip', () => {
  function renderTooltip() {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Export</TooltipTrigger>
          <TooltipContent>Download as CSV</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  it('shows on keyboard focus and describes the trigger', async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Export' });
    expect(document.activeElement).toBe(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toBe('Download as CSV');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
    await expectNoAxeViolations();
  });

  it('shows on hover', async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.hover(screen.getByRole('button', { name: 'Export' }));

    expect((await screen.findByRole('tooltip')).textContent).toBe('Download as CSV');
  });

  it('hides with Escape', async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.tab();
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });

  it('uses the inverted text/surface colours', async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.tab();
    await screen.findByRole('tooltip');

    const bubble = document.querySelector('[data-side].bg-text');
    expect(bubble?.className).toContain('text-surface');
  });
});

describe('stacking (--ds-z-overlay)', () => {
  it('dialog backdrop and panel take their z-index from --ds-z-overlay, defaulting to 50', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Stacked</DialogTitle>
          <DialogDescription>Body</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    const panel = screen.getByRole('dialog');
    const backdrop = document.querySelector('.bg-overlay');
    expect(panel.className).toContain('z-(--ds-z-overlay,50)');
    expect(backdrop?.className).toContain('z-(--ds-z-overlay,50)');
  });

  it('alert dialog, sheet and popover use the same variable', () => {
    const alert = render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Alert</AlertDialogTitle>
          <AlertDialogDescription>Body</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(screen.getByRole('alertdialog').className).toContain('z-(--ds-z-overlay,50)');
    alert.unmount();

    const sheet = render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Sheet</SheetTitle>
          <SheetDescription>Body</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByRole('dialog', { name: 'Sheet' }).className).toContain('z-(--ds-z-overlay,50)');
    sheet.unmount();

    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Pop</PopoverContent>
      </Popover>
    );
    expect(screen.getByText('Pop').className).toContain('z-(--ds-z-overlay,100)');
  });
});
