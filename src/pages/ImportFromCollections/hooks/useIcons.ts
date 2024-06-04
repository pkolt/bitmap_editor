import { useMemo } from 'react';

interface Icon {
  name: string;
  filename: string;
}

interface IconsHookParams {
  data: string[] | null;
  searchText: string;
}

export const useIcons = ({ data, searchText }: IconsHookParams) => {
  const icons = useMemo(() => {
    let icons: Icon[] | undefined;
    if (data) {
      icons = [...data]
        .sort((a, b) => a.localeCompare(b))
        .map((filename) => ({
          name: filename.slice(0, -4), // delete ".svg" extension
          filename,
        }));
    }
    return icons;
  }, [data]);

  const filteredIcons = useMemo(() => {
    const query = searchText.trim();
    if (searchText && icons) {
      return icons.filter((it) => {
        const str1 = it.name.toLocaleLowerCase();
        const str2 = query.toLocaleLowerCase();
        return str1.includes(str2);
      });
    }
    return icons;
  }, [icons, searchText]);

  return useMemo(() => {
    return { icons: filteredIcons };
  }, [filteredIcons]);
};
