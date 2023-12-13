import { PIXELS_PER_COLUMN } from '@/constants/image';
import { ImageEntityData } from '@/types/image';
import { invertBit, isSetBit } from '@/utils/bitwise';

export const getImageDataLength = (width: number, height: number): number => {
  return (width * height) / PIXELS_PER_COLUMN;
};

export const createImageData = (width: number, height: number): ImageEntityData => {
  const length = getImageDataLength(width, height);
  return new Array(length).fill(0);
};

export const isSetBitImageData = (data: ImageEntityData, index: number): boolean => {
  const pos = Math.floor(index / PIXELS_PER_COLUMN);
  const value = data[pos];
  const bit = index - pos * PIXELS_PER_COLUMN;
  return isSetBit(value, bit);
};

export const invertBitImageData = (data: ImageEntityData, index: number) => {
  const pos = Math.floor(index / PIXELS_PER_COLUMN);
  const value = data[pos];
  const bit = index - pos * PIXELS_PER_COLUMN;
  data[pos] = invertBit(value, bit);
  return data;
};
