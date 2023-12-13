import { PIXELS_PER_COLUMN } from '@/constants/image';
import { ImageEntityData } from '@/types/image';
import { invertBit, isSetBit, setBit, clearBit } from '@/utils/bitwise';

export const getImageDataLength = (width: number, height: number): number => {
  return (width * height) / PIXELS_PER_COLUMN;
};

export const createImageData = (width: number, height: number): ImageEntityData => {
  const length = getImageDataLength(width, height);
  return new Array(length).fill(0);
};

export const convertParamsBitImageData = (data: ImageEntityData, index: number) => {
  const pos = Math.floor(index / PIXELS_PER_COLUMN);
  const reg = data[pos];
  const bit = index - pos * PIXELS_PER_COLUMN;
  return { pos, reg, bit };
};

export const isSetBitImageData = (data: ImageEntityData, index: number): boolean => {
  const { reg, bit } = convertParamsBitImageData(data, index);
  return isSetBit(reg, bit);
};

export const setBitImageData = (data: ImageEntityData, index: number, value: boolean) => {
  const { pos, reg, bit } = convertParamsBitImageData(data, index);
  data[pos] = value ? setBit(reg, bit) : clearBit(reg, bit);
  return data;
};

export const invertBitImageData = (data: ImageEntityData, index: number) => {
  const { pos, reg, bit } = convertParamsBitImageData(data, index);
  data[pos] = invertBit(reg, bit);
  return data;
};
