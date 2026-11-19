import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '../lib/utils.ts';

const spinnerVariants = cva('animate-spin text-current', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-6',
      lg: 'size-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  /** Screen-reader label. Default "Loading...". Pass "" for a decorative spinner (e.g. inside a labelled button): it then has no role and is hidden from assistive tech. */
  label?: string;
}

/**
 * Loading spinner. With a label it is a role="status" live region with screen-reader text; with label="" it is
 * decorative (aria-hidden).
 * Defaults to text-primary; inherits parent text colour when text-current or
 * another colour class is passed.
 */
const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label = 'Loading...', ...props }, ref) => {
    return (
      <span
        ref={ref}
        role={label ? "status" : undefined}
        aria-hidden={label ? undefined : true}
        className={cn('inline-flex items-center justify-center text-primary', className)}
        {...props}
      >
        <Loader2
          aria-hidden="true"
          className={cn(spinnerVariants({ size }))}
        />
        {label ? <span className="sr-only">{label}</span> : null}
      </span>
    );
  }
);
Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
