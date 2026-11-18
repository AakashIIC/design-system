// DS-3.3e: accessibility and behaviour of the data-display components
// (table, badge, card, progress, skeleton, separator, scroll-area).
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import axe from 'axe-core';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src/components/table.tsx';
import { Badge, badgeVariants } from '../../src/components/badge.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../src/components/card.tsx';
import { Progress } from '../../src/components/progress.tsx';
import { Skeleton } from '../../src/components/skeleton.tsx';
import { Separator } from '../../src/components/separator.tsx';
import { ScrollArea } from '../../src/components/scroll-area.tsx';
import { expectNoAxeViolations } from './axe.ts';

describe('Table', () => {
  function CallsTable() {
    return (
      <Table>
        <TableCaption>Calls this week</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Agent</TableHead>
            <TableHead scope="col">Calls</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Asha Verma</TableCell>
            <TableCell>42</TableCell>
          </TableRow>
          <TableRow data-state="selected">
            <TableCell>Ravi Kumar</TableCell>
            <TableCell>37</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>79</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  it('is a real table with a caption and column headers, and passes axe', async () => {
    render(<CallsTable />);
    const table = screen.getByRole('table', { name: 'Calls this week' });
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Agent', 'Calls']);
    expect(within(table).getByRole('cell', { name: 'Asha Verma' })).toBeTruthy();
    await expectNoAxeViolations();
  });

  it('names the border colour on every rule (a bare `border` is currentColor in Tailwind v4)', () => {
    render(<CallsTable />);
    for (const row of screen.getAllByRole('row')) {
      if (/(^|\s)border-b(\s|$)/.test(row.className)) expect(row.className).toContain('border-border');
    }
    const selected = screen.getByRole('row', { name: /Ravi Kumar/ });
    expect(selected.className).toContain('data-[state=selected]:bg-primary-soft');
    expect(screen.getAllByRole('columnheader')[0]!.className).toContain('text-text-muted');
  });
});

describe('Badge', () => {
  it('is an inline span, so it can sit inside a paragraph', () => {
    render(
      <p>
        Status <Badge variant="success">Active</Badge>
      </p>
    );
    const badge = screen.getByText('Active');
    expect(badge.tagName).toBe('SPAN');
    expect(badge.getAttribute('data-variant')).toBe('success');
  });

  it('status variants are soft background + strong text; destructive matches danger', () => {
    for (const status of ['success', 'warning', 'danger', 'info'] as const) {
      const cls = badgeVariants({ variant: status });
      expect(cls).toContain(`bg-${status}-soft`);
      expect(cls).toContain(`text-${status}-strong`);
    }
    expect(badgeVariants({ variant: 'destructive' })).toBe(badgeVariants({ variant: 'danger' }));
    expect(badgeVariants()).toContain('text-on-primary');
  });
});

describe('Card', () => {
  it('renders the title as a heading and lets className override the look', async () => {
    render(
      <Card className="shadow-md" data-testid="card">
        <CardHeader>
          <CardTitle>Daily snapshot</CardTitle>
          <CardDescription>Calls and leads since midnight.</CardDescription>
        </CardHeader>
        <CardContent>1,284 calls</CardContent>
        <CardFooter>Updated 5 minutes ago</CardFooter>
      </Card>
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Daily snapshot' })).toBeTruthy();
    const card = screen.getByTestId('card');
    // V-Estate's copy forced `shadow-none!`, so a shadow passed in className never showed.
    expect(card.className).toContain('shadow-md');
    expect(card.className).not.toMatch(/!/);
    expect(card.className).toContain('border-border');
    await expectNoAxeViolations();
  });
});

describe('Progress', () => {
  it('is a named progressbar that reports its value', async () => {
    render(<Progress value={60} aria-label="Upload" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar.getAttribute('aria-valuenow')).toBe('60');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    await expectNoAxeViolations();
  });

  it('axe flags a progressbar with no name', async () => {
    render(<Progress value={10} />);
    const { violations } = await axe.run(document.body, { runOnly: ['aria-progressbar-name'] });
    expect(violations.map((v) => v.id)).toEqual(['aria-progressbar-name']);
  });

  it('fills to the value, clamps out-of-range values, and takes a status colour', () => {
    const { rerender } = render(<Progress value={25} aria-label="Quota" indicatorClassName="bg-warning" />);
    const indicator = () => screen.getByRole('progressbar').firstElementChild as HTMLElement;
    expect(indicator().style.transform).toBe('translateX(-75%)');
    expect(indicator().className).toContain('bg-warning');
    expect(indicator().className).not.toMatch(/(^|\s)bg-primary(\s|$)/);
    // A share of max, not of 100.
    rerender(<Progress value={140} max={200} aria-label="Quota" />);
    expect(indicator().style.transform).toBe('translateX(-30%)');
    rerender(<Progress value={0} aria-label="Quota" />);
    expect(indicator().style.transform).toBe('translateX(-100%)');
  });
});

describe('Skeleton, Separator and ScrollArea', () => {
  it('Skeleton is hidden from screen readers and respects reduced motion', async () => {
    render(
      <div aria-busy="true">
        <span className="sr-only">Loading calls…</span>
        <Skeleton className="h-4 w-32" data-testid="sk" />
      </div>
    );
    const sk = screen.getByTestId('sk');
    expect(sk.getAttribute('aria-hidden')).toBe('true');
    expect(sk.className).toContain('motion-reduce:animate-none');
    await expectNoAxeViolations();
  });

  it('Separator is decorative by default and a separator when asked', () => {
    render(
      <>
        <Separator data-testid="decorative" />
        <Separator decorative={false} orientation="vertical" />
      </>
    );
    expect(screen.getByTestId('decorative').getAttribute('role')).toBe('none');
    const sep = screen.getByRole('separator');
    expect(sep.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('ScrollArea renders its content in a viewport and passes axe', async () => {
    render(
      <ScrollArea className="h-24" aria-label="Recent activity">
        <ul>
          {Array.from({ length: 20 }, (_, i) => (
            <li key={i}>Call {i + 1}</li>
          ))}
        </ul>
      </ScrollArea>
    );
    expect(screen.getByText('Call 20')).toBeTruthy();
    const viewport = document.querySelector('[data-scroll-viewport]')!;
    expect(viewport.className).toContain('focus-visible:ring-ring');
    await expectNoAxeViolations();
  });
});
