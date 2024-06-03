import { useEffect, useState } from 'react';
import { ICONS_DATA_URL } from '../constants';

export const useFetchData = () => {
  const [data, setData] = useState<string[] | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(ICONS_DATA_URL);
      const value: string[] = await res.json();
      setData(value);
    })();
  }, []);

  return { data };
};
