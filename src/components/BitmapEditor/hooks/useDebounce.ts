import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionLike = (...args: any[]) => void;

interface DebounceHookParams<T> {
  fn: T;
  delayMs: number;
}

export const useDebounce = <T extends FunctionLike>({ fn, delayMs }: DebounceHookParams<T>) => {
  const refTimeout = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      // Drop previous timer
      if (refTimeout.current) {
        clearTimeout(refTimeout.current);
        refTimeout.current = null;
      }
      refTimeout.current = setTimeout(() => fn(...args), delayMs);
    },
    [fn, delayMs],
  );
};
