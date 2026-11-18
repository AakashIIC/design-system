// Remove dist before a build so deleted components don't linger in the package.
import { rmSync } from 'node:fs';

rmSync(new URL('../dist', import.meta.url), { recursive: true, force: true });
