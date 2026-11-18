// DS-3.3c: accessibility and behaviour of the form controls.
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { useForm } from 'react-hook-form';

import { Input } from '../../src/components/input.tsx';
import { Textarea } from '../../src/components/textarea.tsx';
import { Label } from '../../src/components/label.tsx';
import { Checkbox } from '../../src/components/checkbox.tsx';
import { RadioGroup, RadioGroupItem } from '../../src/components/radio-group.tsx';
import { Switch } from '../../src/components/switch.tsx';
import { Slider } from '../../src/components/slider.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../src/components/select.tsx';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../src/components/form.tsx';
import { expectNoAxeViolations } from './axe.ts';

describe('Input, Textarea and Label', () => {
  it('labels the field, takes typing and passes axe', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input id="email" type="email" required placeholder="name@company.com" />
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" />
      </>
    );
    // The asterisk is hidden from assistive tech, so the name is just "Email".
    const email = screen.getByRole('textbox', { name: 'Email' });
    await user.type(email, 'asha@iiclab.com');
    await user.type(screen.getByRole('textbox', { name: 'Notes' }), 'Call back on Monday');

    expect((email as HTMLInputElement).value).toBe('asha@iiclab.com');
    expect((email as HTMLInputElement).required).toBe(true);
    expect(screen.getByText('*').getAttribute('aria-hidden')).toBe('true');
    await expectNoAxeViolations();
  });

  it('uses token classes, including the invalid state', () => {
    render(<Input aria-label="Name" aria-invalid="true" />);
    const input = screen.getByRole('textbox', { name: 'Name' });

    expect(input.className).toContain('h-control-md');
    expect(input.className).toContain('border-input');
    expect(input.className).toContain('aria-invalid:border-danger');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('ignores typing when disabled', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" disabled defaultValue="Asha" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    await user.type(input, 'x');

    expect((input as HTMLInputElement).value).toBe('Asha');
  });
});

describe('Checkbox', () => {
  it('toggles with click, Space and its label', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <>
        <Checkbox id="terms" onCheckedChange={onCheckedChange} />
        <Label htmlFor="terms">Accept terms</Label>
      </>
    );
    const box = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(box.getAttribute('aria-checked')).toBe('false');

    await user.click(box);
    expect(box.getAttribute('aria-checked')).toBe('true');
    await user.keyboard(' ');
    expect(box.getAttribute('aria-checked')).toBe('false');
    await user.click(screen.getByText('Accept terms'));
    expect(box.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    await expectNoAxeViolations();
  });

  it('reports the indeterminate state as mixed', () => {
    render(<Checkbox aria-label="Select all" checked="indeterminate" />);
    expect(screen.getByRole('checkbox', { name: 'Select all' }).getAttribute('aria-checked')).toBe('mixed');
  });

  it('uses a 3:1 border when unchecked and the primary fill when checked', () => {
    render(<Checkbox aria-label="Remember me" />);
    const box = screen.getByRole('checkbox');
    expect(box.className).toContain('border-text-muted');
    expect(box.className).toContain('data-[state=checked]:bg-primary');
  });
});

describe('RadioGroup', () => {
  it('is one tab stop and moves the selection with arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <>
        <RadioGroup aria-label="Plan" defaultValue="monthly">
          {['monthly', 'yearly', 'lifetime'].map((plan) => (
            <div key={plan}>
              <RadioGroupItem value={plan} id={plan} />
              <Label htmlFor={plan}>{plan}</Label>
            </div>
          ))}
        </RadioGroup>
        <button type="button">After</button>
      </>
    );
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeTruthy();

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'monthly' }));
    // Radix moves focus in a timeout and selects only while the arrow is still held (as in a real
    // keypress), so hold the key until the selection lands instead of releasing it at once.
    await user.keyboard('{ArrowDown>}');
    await waitFor(() =>
      expect(screen.getByRole('radio', { name: 'yearly' }).getAttribute('aria-checked')).toBe('true')
    );
    await user.keyboard('{/ArrowDown}');
    expect(screen.getByRole('radio', { name: 'monthly' }).getAttribute('aria-checked')).toBe('false');
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After' }));
    await expectNoAxeViolations();
  });
});

describe('Switch', () => {
  it('toggles with click and Space', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Switch id="alerts" />
        <Label htmlFor="alerts">Email alerts</Label>
      </>
    );
    const toggle = screen.getByRole('switch', { name: 'Email alerts' });
    expect(toggle.getAttribute('aria-checked')).toBe('false');

    await user.click(toggle);
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    await user.keyboard(' ');
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    expect(toggle.className).toContain('data-[state=unchecked]:bg-text-subtle');
    await expectNoAxeViolations();
  });
});

describe('Slider', () => {
  it('names its thumb from aria-label and moves with arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={[40]} step={10} onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });

    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb.getAttribute('aria-valuenow')).toBe('50');
    expect(onValueChange).toHaveBeenLastCalledWith([50]);
    await expectNoAxeViolations();
  });

  it('renders one named thumb per value (a range slider has two)', async () => {
    render(<Slider defaultValue={[20, 80]} thumbLabels={['Minimum price', 'Maximum price']} />);
    const thumbs = screen.getAllByRole('slider');

    expect(thumbs).toHaveLength(2);
    expect(screen.getByRole('slider', { name: 'Minimum price' }).getAttribute('aria-valuenow')).toBe('20');
    expect(screen.getByRole('slider', { name: 'Maximum price' }).getAttribute('aria-valuenow')).toBe('80');
    await expectNoAxeViolations();
  });

  it('numbers the thumbs when only aria-label is given', () => {
    render(<Slider aria-label="Price" defaultValue={[10, 90]} />);
    expect(screen.getByRole('slider', { name: 'Price 1 of 2' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Price 2 of 2' })).toBeTruthy();
  });

  it('axe flags a slider with no name (the check works)', async () => {
    render(<Slider defaultValue={[50]} />);
    const { violations } = await axe.run(document.body, { rules: { region: { enabled: false } } });
    expect(violations.map((v) => v.id)).toContain('aria-input-field-name');
  });
});

describe('Select', () => {
  function renderSelect(onValueChange = vi.fn()) {
    render(
      <>
        <Label htmlFor="agent">Agent</Label>
        <Select onValueChange={onValueChange}>
          <SelectTrigger id="agent">
            <SelectValue placeholder="Choose an agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asha">Asha</SelectItem>
            <SelectItem value="ravi">Ravi</SelectItem>
            <SelectItem value="meera" disabled>
              Meera
            </SelectItem>
          </SelectContent>
        </Select>
      </>
    );
    return onValueChange;
  }

  it('is a labelled combobox showing the placeholder', async () => {
    renderSelect();
    const trigger = screen.getByRole('combobox', { name: 'Agent' });

    expect(trigger.textContent).toContain('Choose an agent');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.className).toContain('data-placeholder:text-text-subtle');
    await expectNoAxeViolations();
  });

  it('opens a listbox and picks an option with the mouse', async () => {
    const user = userEvent.setup();
    const onValueChange = renderSelect();
    const trigger = screen.getByRole('combobox', { name: 'Agent' });
    await user.click(trigger);

    const listbox = await screen.findByRole('listbox');
    expect(listbox.className).toContain('bg-surface');
    expect(screen.getByRole('option', { name: 'Meera' }).getAttribute('aria-disabled')).toBe('true');
    await user.click(screen.getByRole('option', { name: 'Ravi' }));

    expect(onValueChange).toHaveBeenCalledWith('ravi');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(trigger.textContent).toContain('Ravi');
  });

  it('opens with the keyboard and closes with Escape, returning focus', async () => {
    const user = userEvent.setup();
    renderSelect();
    const trigger = screen.getByRole('combobox', { name: 'Agent' });
    trigger.focus();
    await user.keyboard('{Enter}');

    expect(await screen.findByRole('listbox')).toBeTruthy();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });
});

describe('Form (react-hook-form)', () => {
  function ProfileForm({ onSubmit }: { onSubmit: (values: { name: string }) => void }) {
    const form = useForm<{ name: string }>({ defaultValues: { name: '' } });
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            rules={{ required: 'Enter a project name' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Everyone on the project sees this.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit">Save</button>
        </form>
      </Form>
    );
  }

  it('links label and description, and passes axe', async () => {
    render(<ProfileForm onSubmit={vi.fn()} />);
    const input = screen.getByRole('textbox', { name: 'Project name' });

    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByText('Everyone on the project sees this.').id);
    await expectNoAxeViolations();
  });

  it('shows the error, marks the field invalid and describes it with the message', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ProfileForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    const message = await screen.findByText('Enter a project name');
    const input = screen.getByRole('textbox', { name: 'Project name' });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(message.id);
    expect(message.className).toContain('text-danger-strong');
    expect(screen.getByText('Project name').className).toContain('text-danger-strong');
    await expectNoAxeViolations();
  });

  it('submits once the field is valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ProfileForm onSubmit={onSubmit} />);
    await user.type(screen.getByRole('textbox', { name: 'Project name' }), 'Q4 rollout');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'Q4 rollout' });
  });
});
