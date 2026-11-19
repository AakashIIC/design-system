// DS-3.3f: accessibility and behaviour of the components outside the DS-3.3 groups
// (calendar, chart, drawer, sonner).
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

// jsdom has no layout, so ResponsiveContainer measures 0×0. recharts 3 then renders nothing (recharts 2
// rendered its children anyway); pass the children straight through so the chart tests run on both.
vi.mock('recharts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('recharts')>()),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { Calendar } from '../../src/components/calendar.tsx';
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
  type ChartConfig,
} from '../../src/components/chart.tsx';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../src/components/drawer.tsx';
import { Toaster } from '../../src/components/sonner.tsx';
import { Button } from '../../src/components/button.tsx';
import { expectNoAxeViolations } from './axe.ts';

// vaul and sonner read matchMedia, which jsdom doesn't have.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('Calendar', () => {
  const june = new Date(2026, 5, 1);

  it('selects a day by click and marks it with the token classes', async () => {
    const user = userEvent.setup();
    function Single() {
      const [day, setDay] = useState<Date | undefined>();
      return <Calendar mode="single" selected={day} onSelect={setDay} defaultMonth={june} />;
    }
    render(<Single />);
    expect(screen.getByRole('grid', { name: 'June 2026' })).toBeTruthy();
    const day = screen.getByRole('button', { name: /June 15th, 2026/ });
    await user.click(day);
    const selected = screen.getByRole('button', { name: /June 15th, 2026.*selected/ });
    expect(selected.getAttribute('data-selected-single')).toBe('true');
    expect(selected.className).toContain('data-[selected-single=true]:bg-primary');
    expect(selected.className).toContain('data-[selected-single=true]:text-on-primary');
    await expectNoAxeViolations();
  });

  it('moves between days with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Calendar mode="single" defaultMonth={june} selected={new Date(2026, 5, 10)} />);
    screen.getByRole('button', { name: /June 10th, 2026/ }).focus();
    await user.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent).toMatch(/11/)
    );
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent).toMatch(/18/)
    );
  });

  it('colours a range with primary ends and a primary-soft middle (not `accent`)', () => {
    render(
      <Calendar mode="range" defaultMonth={june} selected={{ from: new Date(2026, 5, 8), to: new Date(2026, 5, 12) }} />
    );
    const middle = screen.getByRole('button', { name: /June 10th, 2026/ });
    expect(middle.getAttribute('data-range-middle')).toBe('true');
    expect(middle.className).toContain('data-[range-middle=true]:bg-primary-soft');
    expect(document.querySelector('[data-slot=calendar]')!.innerHTML).not.toMatch(/\baccent\b/);
  });
});

describe('Chart', () => {
  const config = {
    calls: { label: 'Calls', color: 'var(--color-chart-1)' },
    leads: { label: 'Leads', color: 'var(--color-chart-2)' },
  } satisfies ChartConfig;

  function Wrap({ children }: { children: React.ReactNode }) {
    // ChartContainer needs a chart child; the tooltip and legend contents are rendered on their own here,
    // since jsdom has no layout for recharts to draw into.
    return (
      <ChartContainer config={config} id="test">
        <>{children}</>
      </ChartContainer>
    );
  }

  it('writes the config colours as --color-<key>, with a dark-mode block matching the tokens', () => {
    render(<Wrap>{null}</Wrap>);
    const css = [...document.querySelectorAll('style')].map((s) => s.textContent).find((t) => t?.includes('data-chart'))!;
    expect(css).toContain('--color-calls: var(--color-chart-1);');
    expect(css).toContain(':is(.dark, [data-theme="dark"]) [data-chart=chart-test]');
  });

  it('tooltip shows zero values and colours each swatch from the series', () => {
    render(
      <Wrap>
        <ChartTooltipContent
          active
          label="Monday"
          payload={[
            { dataKey: 'calls', name: 'calls', value: 42, color: '#4338ca', payload: {} },
            { dataKey: 'leads', name: 'leads', value: 0, color: '#0f766e', payload: {} },
          ]}
        />
      </Wrap>
    );
    expect(screen.getByText('Calls')).toBeTruthy();
    // V-Estate's copy hid the value when it was 0 (`item.value && …`).
    expect(screen.getByText('0')).toBeTruthy();
    const swatch = screen.getByText('Leads').closest('.flex.w-full')!.firstElementChild as HTMLElement;
    // v4 syntax: `bg-[--x]` would compile to `background-color: --x` (no colour); `bg-(--x)` reads the variable.
    expect(swatch.className).toContain('bg-(--color-bg)');
    expect(swatch.style.getPropertyValue('--color-bg')).toBe('#0f766e');
  });

  it('legend lists each series with its label', () => {
    render(
      <Wrap>
        <ChartLegendContent
          payload={[
            { value: 'calls', dataKey: 'calls', color: '#4338ca', type: 'square' },
            { value: 'leads', dataKey: 'leads', color: '#0f766e', type: 'square' },
          ]}
        />
      </Wrap>
    );
    expect(screen.getByText('Calls')).toBeTruthy();
    expect(screen.getByText('Leads')).toBeTruthy();
  });
});

describe('Drawer', () => {
  it('opens as a named dialog on the token surface and passes axe', async () => {
    const user = userEvent.setup();
    render(
      <Drawer shouldScaleBackground={false}>
        <DrawerTrigger asChild>
          <Button>Filters</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Narrow the call list.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const dialog = await screen.findByRole('dialog', { name: 'Filters' });
    expect(dialog.className).toContain('bg-surface');
    expect(dialog.className).toContain('rounded-t-2xl');
    await expectNoAxeViolations(dialog);
    // vaul unmounts after its CSS transition ends, which jsdom never fires; the closed state is what matters.
    await user.keyboard('{Escape}');
    await waitFor(() => expect(dialog.getAttribute('data-state')).toBe('closed'));
  });
});

describe('Toaster', () => {
  it('points sonner at the tokens and styles descriptions and actions', async () => {
    render(<Toaster />);
    act(() => {
      toast('Report saved', { description: 'Shared with the project.', action: { label: 'Undo', onClick: () => {} } });
    });
    const title = await screen.findByText('Report saved');
    const toaster = document.querySelector<HTMLElement>('[data-sonner-toaster]')!;
    expect(toaster.style.getPropertyValue('--normal-bg')).toBe('var(--ds-color-surface)');
    expect(toaster.style.getPropertyValue('--error-text')).toBe('var(--ds-color-danger-strong)');
    const description = screen.getByText('Shared with the project.');
    expect(description.className).toContain('text-text-muted!');
    // Plain toasts carry no data-type, so the status override (`in-data-[type]:`) doesn't apply to them.
    expect(description.closest('[data-sonner-toast]')!.hasAttribute('data-type')).toBe(false);
    expect(screen.getByRole('button', { name: 'Undo' }).className).toContain('bg-primary!');
    expect(title).toBeTruthy();
    act(() => toast.dismiss());
  });

  it('keeps an app-supplied style and classNames', async () => {
    render(<Toaster style={{ '--normal-bg': 'red' } as React.CSSProperties} toastOptions={{ classNames: { toast: 'my-toast' } }} />);
    act(() => {
      toast('Hello');
    });
    await screen.findByText('Hello');
    const toaster = document.querySelector<HTMLElement>('[data-sonner-toaster]')!;
    expect(toaster.style.getPropertyValue('--normal-bg')).toBe('red');
    expect(toaster.style.getPropertyValue('--normal-text')).toBe('var(--ds-color-text)');
    expect(document.querySelector('[data-sonner-toast]')!.className).toContain('my-toast');
    act(() => toast.dismiss());
  });
});
