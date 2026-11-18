'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '../lib/utils.ts';

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    /** Classes for the filled bar, e.g. `bg-success` for a status colour. */
    indicatorClassName?: string;
  }
>(({ className, indicatorClassName, value, max = 100, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={value}
    max={max}
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-surface-muted', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 rounded-full bg-primary transition-transform duration-(--ds-motion-duration-base) ease-standard motion-reduce:transition-none',
        indicatorClassName
      )}
      // Fill as a share of `max` (V-Estate's copy assumed max = 100), clamped to 0–100%.
      style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, ((value ?? 0) / max) * 100))}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
