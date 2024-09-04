const BITS_PER_NUMBER = 32;

/** @internal */
export const getArrayOfNumLength = (lengthArrayOfBool: number) => {
  return Math.ceil(lengthArrayOfBool / BITS_PER_NUMBER);
};

/** @internal */
export const binaryToNumber = (arrayOfBool: Uint8Array): number => {
  if (arrayOfBool.length > BITS_PER_NUMBER) {
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
    const start = i * BITS_PER_NUMBER;
    const end = start + BITS_PER_NUMBER;
    array[i] = binaryToNumber(arrayOfBool.slice(start, end));
  }
  return array;
};

export const toArrayOfBool = (input: number[], size: number): Uint8Array => {
  const validInputLength = getArrayOfNumLength(size);
  if (input.length !== validInputLength) {
    throw new Error(`Invalid array length: ${input.length} !== ${validInputLength}`);
  }
  const output = new Uint8Array(size);
  const tail = size % BITS_PER_NUMBER;
  for (let i = 0; i < input.length; i++) {
    const curSize = i === input.length - 1 && tail > 0 ? tail : BITS_PER_NUMBER;
    const value = numberToBinary(input[i], curSize);
    output.set(value, i * BITS_PER_NUMBER);
  }
  return output;
};
