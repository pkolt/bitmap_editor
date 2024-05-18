import { UINT32_BITS_PER_ELEMENT } from './constants';
import { clearBit, isSetBit, setBit } from '../bitwise';

export const convertBoolArrayToUint32Array = (boolArray: Uint8Array): number[] => {
  const uint32ArrayLength = Math.ceil(boolArray.length / UINT32_BITS_PER_ELEMENT);
  const uint32Array: number[] = new Array(uint32ArrayLength).fill(0);
  for (let i = 0; i < boolArray.length; i++) {
    const pos = Math.floor(i / UINT32_BITS_PER_ELEMENT);
    const bit = i - UINT32_BITS_PER_ELEMENT * pos;
    uint32Array[pos] = boolArray[i] ? setBit(uint32Array[pos], bit) : clearBit(uint32Array[pos], bit);
  }
  return [boolArray.length, ...uint32Array];
};

export const convertUint32ArrayToBoolArray = (array: number[]): Uint8Array => {
  const [boolArrayLength, ...uint32Array] = array;
  if (boolArrayLength > uint32Array.length * UINT32_BITS_PER_ELEMENT) {
    throw new Error(`Invalid bool array length: ${boolArrayLength}`);
  }
  const boolArray: Uint8Array = new Uint8Array(boolArrayLength);
  for (let i = 0; i < boolArray.length; i++) {
    const pos = Math.floor(i / UINT32_BITS_PER_ELEMENT);
    const bit = i - UINT32_BITS_PER_ELEMENT * pos;
    boolArray[i] = Number(isSetBit(uint32Array[pos], bit));
  }
  return boolArray;
};
