import { useEffect, useState } from 'react';

const BOOTSTRAP_ICONS_DATA_URL = `${import.meta.env.BASE_URL}/images/bootstrap-icons/data.json`;

export const useFetchData = () => {
  const [data, setData] = useState<string[] | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(BOOTSTRAP_ICONS_DATA_URL);
      const value: string[] = await res.json();
      setData(value);
    })();
  }, []);

  return { data };
};
