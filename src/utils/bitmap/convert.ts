const BITS_PER_NUMBER = Uint32Array.BYTES_PER_ELEMENT * 8;

export const getArrayOfNumLength = (lengthArrayOfBool: number) => {
  return Math.ceil(lengthArrayOfBool / BITS_PER_NUMBER);
};

export const binaryToNumber = (arrayOfBool: Uint8Array): number => {
  if (arrayOfBool.length > BITS_PER_NUMBER) {
    throw new Error('Invalid bool array size.');
  }
  const bigResult = arrayOfBool.toReversed().reduce((accum, value, index) => {
    // Integer overflow.
    // BAD: (1 << 31) // -2147483648
    // GOOD: (1n << 31n) // 2147483648n
    const bigValue = BigInt(value);
    const bigIndex = BigInt(index);
    return bigValue ? accum | (1n << bigIndex) : accum & ~(1n << bigIndex);
  }, 0n);
  return Number(bigResult);
};

export const numberToBinary = (value: number, size: number): Uint8Array => {
  return Uint8Array.from({ length: size })
    .map((_, index) => Number(!!(value & (1 << index))))
    .toReversed();
};

export const toArrayOfNumber = (arrayOfBool: Uint8Array): Uint32Array => {
  const length = getArrayOfNumLength(arrayOfBool.length);
  const array = new Uint32Array(length + 1); // + 1 byte for array size
  array[0] = arrayOfBool.length; // First byte is array size
  for (let i = 1; i < array.length; i++) {
    const start = (i - 1) * BITS_PER_NUMBER;
    const end = start + BITS_PER_NUMBER;
    array[i] = binaryToNumber(arrayOfBool.slice(start, end));
  }
  return array;
};

export const toArrayOfBool = (arrayOfNumber: Uint32Array): Uint8Array => {
  const length = arrayOfNumber[0];
  const validArrayLength = getArrayOfNumLength(length) + 1; // + 1 byte for array size
  if (arrayOfNumber.length !== validArrayLength) {
    throw new Error(`Invalid array length: ${arrayOfNumber.length} !== ${validArrayLength}`);
  }
  const array = new Uint8Array(length);
  const tail = length % BITS_PER_NUMBER;
  for (let i = 1; i < arrayOfNumber.length; i++) {
    const size = i === arrayOfNumber.length - 1 && tail > 0 ? tail : BITS_PER_NUMBER;
    const value = numberToBinary(arrayOfNumber[i], size);
    array.set(value, (i - 1) * BITS_PER_NUMBER);
  }
  return array;
};
