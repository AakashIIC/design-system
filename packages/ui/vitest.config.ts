import { defineConfig } from 'vitest/config';

// Accessibility and behaviour tests for the components (jsdom + Testing Library + axe-core).
// The package-level checks (exports, Tailwind compile, tokens-only) run with `node --test`.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/components/**/*.test.tsx'],
    setupFiles: ['test/components/setup.ts'],
  },
});
