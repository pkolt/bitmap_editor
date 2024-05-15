import * as zustandMiddleware from 'zustand/middleware';
import { vi } from 'vitest';

const { persist: actualPersist } = await vi.importActual<typeof zustandMiddleware>('zustand/middleware');

// Skip persist logic
export const persist = (...args: Parameters<typeof actualPersist>) => args[0];
