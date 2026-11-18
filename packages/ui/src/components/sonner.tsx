'use client';

import * as React from 'react';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Sonner colours toasts from its own CSS variables, set on the toaster element. Point them at the tokens
 * (inline style beats sonner's theme defaults), so plain and `richColors` toasts follow the app theme.
 * Status toasts are soft background + strong text, like the badges.
 */
const tokenVariables = {
  '--normal-bg': 'var(--ds-color-surface)',
  '--normal-text': 'var(--ds-color-text)',
  '--normal-border': 'var(--ds-color-border)',
  '--success-bg': 'var(--ds-color-success-soft)',
  '--success-text': 'var(--ds-color-success-strong)',
  '--success-border': 'var(--ds-color-success-soft)',
  '--info-bg': 'var(--ds-color-info-soft)',
  '--info-text': 'var(--ds-color-info-strong)',
  '--info-border': 'var(--ds-color-info-soft)',
  '--warning-bg': 'var(--ds-color-warning-soft)',
  '--warning-text': 'var(--ds-color-warning-strong)',
  '--warning-border': 'var(--ds-color-warning-soft)',
  '--error-bg': 'var(--ds-color-danger-soft)',
  '--error-text': 'var(--ds-color-danger-strong)',
  '--error-border': 'var(--ds-color-danger-soft)',
  '--border-radius': 'var(--ds-radius-xl)',
  fontFamily: 'var(--ds-font-family-sans)',
} as React.CSSProperties;

// The app passes `theme` itself (V-Estate read it from next-themes), so the package has no theme library dependency.
const Toaster = ({ theme = 'system', style, toastOptions, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{ ...tokenVariables, ...style }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: 'shadow-lg!',
          // Sonner sets the description colour with a 3-attribute selector (#3f3f3f / #e8e8e8), which beats
          // any plain class, hence `!`. Status toasts (success, error, …: they carry data-type) inherit the
          // strong status text instead; plain toasts have no data-type, even with `richColors` on.
          description: 'text-text-muted! in-data-[type]:text-inherit!',
          actionButton: 'bg-primary! text-on-primary!',
          cancelButton: 'bg-surface-muted! text-text!',
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
};

export { Toaster, type ToasterProps };
