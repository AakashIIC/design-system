import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils.ts';

// Data Vault's status pill. Status variants are soft background + strong text (no white on status colours).
// A <span>, so it can sit inside a paragraph or a table cell.
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-transparent px-2 py-0.5 text-xs font-semibold [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary text-on-primary',
        secondary: 'bg-surface-muted text-text',
        outline: 'border-border text-text',
        success: 'bg-success-soft text-success-strong',
        warning: 'bg-warning-soft text-warning-strong',
        danger: 'bg-danger-soft text-danger-strong',
        info: 'bg-info-soft text-info-strong',
        /** Same as `danger`; kept for V-Estate's shadcn name. */
        destructive: 'bg-danger-soft text-danger-strong',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-variant={variant ?? 'default'} className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
