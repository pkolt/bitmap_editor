import { UINT32_BITS } from './constants';

/** @internal */
export const getArrayOfNumLength = (lengthArrayOfBool: number) => {
  return Math.ceil(lengthArrayOfBool / UINT32_BITS);
};

/** @internal */
export const binaryToNumber = (arrayOfBool: Uint8Array): number => {
  if (arrayOfBool.length > UINT32_BITS) {
    throw new Error('Invalid bool array size.');
  }
  const bigResult = arrayOfBool.toReversed().reduce((accum, value, index) => {
    // Integer overflow.
    // BAD: (1 << 31) // -2147483648
    // GOOD: (1n << 31n) // 2147483648n
    const bigIndex = BigInt(index);
    return value ? accum | (1n << bigIndex) : accum & ~(1n << bigIndex);
  }, 0n);
  return Number(bigResult);
};

/** @internal */
export const numberToBinary = (value: number, size: number): Uint8Array => {
  return Uint8Array.from({ length: size })
    .map((_, index) => Number(!!(value & (1 << index))))
    .toReversed();
};

export const toArrayOfNumber = (arrayOfBool: Uint8Array): number[] => {
  const length = getArrayOfNumLength(arrayOfBool.length);
  const array: number[] = Array.from({ length });
  for (let i = 0; i < array.length; i++) {
    const start = i * UINT32_BITS;
    const end = start + UINT32_BITS;
    array[i] = binaryToNumber(arrayOfBool.slice(start, end));
  }
  return array;
};

export const reverseBits = (n: number) => {
  let value = BigInt(n);
  let result = BigInt(0);
  for (let i = 0; i < UINT32_BITS; i++) {
    result = (result << 1n) | value % 2n;
    value = BigInt(Math.floor(Number(value / 2n)));
  }
  return Number(result);
};
