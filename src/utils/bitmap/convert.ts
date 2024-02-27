import { UINT32_BITS_PER_ELEMENT } from './constants';
import { clearBit, isSetBit, setBit } from '../bitwise';

export const convertBoolArrayToUint32Array = (boolArray: boolean[]): number[] => {
  const uint32ArrayLength = Math.ceil(boolArray.length / UINT32_BITS_PER_ELEMENT);
  const uint32Array: number[] = new Array(uint32ArrayLength).fill(0);
  for (let i = 0; i < boolArray.length; i++) {
    const pos = Math.floor(i / UINT32_BITS_PER_ELEMENT);
    const bit = i - UINT32_BITS_PER_ELEMENT * pos;
    uint32Array[pos] = boolArray[i] ? setBit(uint32Array[pos], bit) : clearBit(uint32Array[pos], bit);
  }
  return [boolArray.length, ...uint32Array];
};

export const convertUint32ArrayToBoolArray = (array: number[]): boolean[] => {
  const [boolArrayLength, ...uint32Array] = array;
  if (boolArrayLength > uint32Array.length * UINT32_BITS_PER_ELEMENT) {
    throw new Error(`Invalid bool array length: ${boolArrayLength}`);
  }
  const boolArray: boolean[] = new Array(boolArrayLength).fill(false);
  for (let i = 0; i < boolArray.length; i++) {
    const pos = Math.floor(i / UINT32_BITS_PER_ELEMENT);
    const bit = i - UINT32_BITS_PER_ELEMENT * pos;
    boolArray[i] = isSetBit(uint32Array[pos], bit);
  }
  return boolArray;
};
