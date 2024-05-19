const UINT32_BITS_PER_ELEMENT = 32;

export const toArrayOfBoolLegacy = (array: number[]): Uint8Array => {
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
