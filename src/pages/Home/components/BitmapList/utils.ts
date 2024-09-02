import { BitmapEntity } from '@/utils/bitmap/types';
import { SortValue } from '@/stores/settings';

const orderByFavorite = (list: BitmapEntity[]): BitmapEntity[] => {
  return list.toSorted((a, b) => Number(b.favorite) - Number(a.favorite));
};

const applyOrderDirection = (value: number, dir: SortValue): number => {
  return value * (dir === SortValue.DESC ? -1 : 1);
};

const orderByDate = (list: BitmapEntity[], dir: SortValue): BitmapEntity[] => {
  return list.toSorted((a, b) => applyOrderDirection(a.createdAt - b.createdAt, dir));
};

const orderByName = (list: BitmapEntity[], dir: SortValue): BitmapEntity[] => {
  return list.toSorted((a, b) => applyOrderDirection(b.name.localeCompare(a.name), dir));
};

export const orderBitmaps = (bitmaps: BitmapEntity[], nameDir: SortValue, dateDir: SortValue): BitmapEntity[] => {
  let orderedList: BitmapEntity[] = bitmaps;
  if (dateDir !== SortValue.NONE) {
    orderedList = orderByDate(orderedList, dateDir);
  }
  if (nameDir !== SortValue.NONE) {
    orderedList = orderByName(orderedList, nameDir);
  }
  return orderByFavorite(orderedList);
};

const ORDERED_VALUES: SortValue[] = [SortValue.NONE, SortValue.DESC, SortValue.ASC] as const;

export const getNextSortValue = (curSortValue: SortValue): SortValue => {
  const index = ORDERED_VALUES.indexOf(curSortValue);
  const nextIndex = index < ORDERED_VALUES.length - 1 ? index + 1 : 0;
  const nextValue = ORDERED_VALUES[nextIndex];
  return nextValue;
};
