import { BitmapEntity } from '@/utils/bitmap/types';
import { SortDirection } from './types';

const orderByFavorite = (list: BitmapEntity[]): BitmapEntity[] => {
  return list.toSorted((a, b) => Number(b.favorite) - Number(a.favorite));
};

const applyOrderDirection = (value: number, dir: SortDirection): number => {
  return value * (dir === SortDirection.DESC ? -1 : 1);
};

const orderByDate = (list: BitmapEntity[], dir: SortDirection): BitmapEntity[] => {
  return list.toSorted((a, b) => applyOrderDirection(a.createdAt - b.createdAt, dir));
};

const orderByName = (list: BitmapEntity[], dir: SortDirection): BitmapEntity[] => {
  return list.toSorted((a, b) => applyOrderDirection(b.name.localeCompare(a.name), dir));
};

export const orderBitmaps = (
  bitmaps: BitmapEntity[],
  nameDir: SortDirection,
  dateDir: SortDirection,
): BitmapEntity[] => {
  let orderedList: BitmapEntity[] = bitmaps;
  if (dateDir !== SortDirection.NONE) {
    orderedList = orderByDate(orderedList, dateDir);
  }
  if (nameDir !== SortDirection.NONE) {
    orderedList = orderByName(orderedList, nameDir);
  }
  return orderByFavorite(orderedList);
};
