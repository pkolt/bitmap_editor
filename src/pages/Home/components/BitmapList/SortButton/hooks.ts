import { useCallback, useMemo, useState } from 'react';
import { SortDirection } from '../types';

const DIR_ARRAY: SortDirection[] = [SortDirection.NONE, SortDirection.DESC, SortDirection.ASC] as const;

export const useSortButton = (initial: SortDirection) => {
  const [direction, setDirection] = useState<SortDirection>(initial);

  const toggle = useCallback(() => {
    setDirection((value) => {
      const index = DIR_ARRAY.indexOf(value);
      const nextIndex = index < DIR_ARRAY.length - 1 ? index + 1 : 0;
      return DIR_ARRAY[nextIndex];
    });
  }, []);

  return useMemo(() => ({ direction, toggle }), [direction, toggle]);
};
