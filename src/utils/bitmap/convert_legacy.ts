import { UINT32_BITS_PER_ELEMENT } from './constants';

export const convertBoolArrayToNumberArrayV1 = (boolArray: Uint8Array): number[] => {
  const uint32ArrayLength = Math.ceil(boolArray.length / UINT32_BITS_PER_ELEMENT);
  const uint32Array: number[] = new Array(uint32ArrayLength).fill(0);
  for (let i = 0; i < boolArray.length; i++) {
    const pos = Math.floor(i / UINT32_BITS_PER_ELEMENT);
    const bit = i - UINT32_BITS_PER_ELEMENT * pos;
    if (boolArray[i]) {
      uint32Array[pos] |= 1 << bit; // Set bit to 1
    } else {
      uint32Array[pos] &= ~(1 << bit); // Set bit to 0
    }
  }
  return [boolArray.length, ...uint32Array];
};

export const convertNumberArrayToBoolArrayV1 = (array: number[]): Uint8Array => {
  const [boolArrayLength, ...uint32Array] = array;
  if (boolArrayLength > uint32Array.length * UINT32_BITS_PER_ELEMENT) {
    throw new Error(`Invalid bool array length: ${boolArrayLength}`);
  }
  const boolArray: Uint8Array = new Uint8Array(boolArrayLength);
  for (let i = 0; i < boolArray.length; i++) {
    const pos = Math.floor(i / UINT32_BITS_PER_ELEMENT);
    const bit = i - UINT32_BITS_PER_ELEMENT * pos;
    const value: boolean = !!(uint32Array[pos] & (1 << bit));
    boolArray[i] = Number(value);
  }
  return boolArray;
};
