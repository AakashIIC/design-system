import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '../lib/utils.ts';

// DS-3.3b: Data Vault's button (solid primary, navy secondary, rounded-lg, 40px) with token colours only.
// The soft status variants are tinted backgrounds with strong text: white text on status colours fails AA.
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-(--ds-motion-duration-fast) ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /** Main action. Indigo in Data Vault and VRetail, gold in V-Estate. */
        default: 'bg-primary text-on-primary hover:bg-primary-hover',
        /** Strong but not the brand colour: navy in Data Vault, charcoal in V-Estate. */
        secondary: 'bg-text text-surface hover:bg-text/90',
        /** Neutral bordered button; also the "unselected" half of a toggle group. */
        outline: 'border border-input bg-surface text-text hover:bg-surface-muted',
        /** No background until hovered: toolbars, icon buttons. */
        ghost: 'text-text hover:bg-surface-muted',
        /** Quiet filled button on a neutral tint. */
        muted: 'bg-surface-muted text-text hover:bg-border',
        /** Reads as a link. Body-coloured text so it passes contrast in every theme; the underline carries the brand colour. */
        link: 'text-text underline decoration-primary underline-offset-4 hover:decoration-2',
        /** Delete, remove, revoke. */
        destructive: 'bg-danger-soft text-danger-strong hover:brightness-95',
        /** Approve, enable, activate. */
        success: 'bg-success-soft text-success-strong hover:brightness-95',
        /** Block, pause, needs attention. */
        warning: 'bg-warning-soft text-warning-strong hover:brightness-95',
      },
      size: {
        /** 40px: the default control height. */
        default: 'h-control-md px-4',
        /** 32px. */
        sm: 'h-control-sm px-3 text-xs',
        /** 48px. */
        lg: 'h-control-lg px-6 text-base',
        /** 40px square. Give it an aria-label. */
        icon: 'size-control-md',
        /** 32px square. Give it an aria-label. */
        'icon-sm': 'size-control-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a link) with button styles instead of a <button>. */
  asChild?: boolean;
  /** Shows a spinner, disables the button and sets aria-busy. Ignored with asChild. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
