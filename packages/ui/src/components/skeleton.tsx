import * as React from 'react';

import { cn } from '../lib/utils.ts';

/**
 * Loading placeholder. Hidden from screen readers: mark the loading region with `aria-busy="true"` and
 * give it a text status (e.g. a visually hidden "Loading calls…") instead.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-surface-muted motion-reduce:animate-none', className)}
      {...props}
    />
  );
}

export { Skeleton };
