import * as zustandMiddleware from 'zustand/middleware';

type ZustandMiddleware = typeof zustandMiddleware;
type Persist = ZustandMiddleware['persist'];

// Skip persist logic
export const persist = (...args: Parameters<Persist>) => args[0];
