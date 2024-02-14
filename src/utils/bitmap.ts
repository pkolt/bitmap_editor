import { clearBit, isSetBit, setBit } from './bitwise';

export enum BitOrder {
  BigEndian = 'BE', // MSB (Most Significant Byte) or BE (Big-Endian)
  LittleEndian = 'LE', // LSB (Least Significant Byte) or LE (Little-Endian)
}

interface BitmapObject {
  width: number;
  height: number;
  data: number[];
}

export const UINT8_BITS_PER_ELEMENT = 8;
export const UINT32_BITS_PER_ELEMENT = 32;

const convertBoolArrayToUint32Array = (boolArray: boolean[]): number[] => {
  const uint32ArrayLength = Math.ceil(boolArray.length / UINT32_BITS_PER_ELEMENT);
  const uint32Array: number[] = new Array(uint32ArrayLength).fill(0);
  for (let i = 0; i < boolArray.length; i++) {
    const pos = Math.floor(i / UINT32_BITS_PER_ELEMENT);
    const bit = i - UINT32_BITS_PER_ELEMENT * pos;
    uint32Array[pos] = boolArray[i] ? setBit(uint32Array[pos], bit) : clearBit(uint32Array[pos], bit);
  }
  return [boolArray.length, ...uint32Array];
};

const convertUint32ArrayToBoolArray = (array: number[]): boolean[] => {
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

export class Bitmap {
  width: number;
  height: number;
  #data: boolean[];

  static fromJSON({ width, height, data }: BitmapObject): Bitmap {
    return new Bitmap(width, height, convertUint32ArrayToBoolArray(data));
  }

  constructor(width: number, height: number, data?: boolean[]) {
    this.width = width;
    this.height = height;

    if (data && data.length !== this.length) {
      throw new Error('Invalid bitmap data');
    }

    this.#data = data ? [...data] : new Array(this.length).fill(false);
  }

  get length(): number {
    return this.width * this.height;
  }

  getByIndex(index: number): boolean {
    return this.#data[index];
  }

  setByIndex(index: number, value: boolean): void {
    this.#data[index] = value;
  }

  invertByIndex(index: number): void {
    this.#data[index] = !this.#data[index];
  }

  #coordsToIndex(x: number, y: number): number {
    const index = y * this.width + x;
    if (index >= this.length) {
      throw new Error(`Invalid coordinates: ${x}, ${y}.`);
    }
    return index;
  }

  getByCoords(x: number, y: number): boolean {
    const index = this.#coordsToIndex(x, y);
    return this.getByIndex(index);
  }

  setByCoords(x: number, y: number, value: boolean): void {
    const index = this.#coordsToIndex(x, y);
    this.setByIndex(index, value);
  }

  invertByCoords(x: number, y: number): void {
    const index = this.#coordsToIndex(x, y);
    this.invertByIndex(index);
  }

  isEmpty(): boolean {
    return this.#data.every((v) => !v);
  }

  reset() {
    this.#data.fill(false);
  }

  invertColor() {
    this.#data = this.#data.map((val) => !val);
  }

  clone(): Bitmap {
    return new Bitmap(this.width, this.height, this.#data);
  }

  toXBitMap(bitOrder: BitOrder): Uint8Array {
    const result = new Uint8Array(Math.ceil(this.length / UINT8_BITS_PER_ELEMENT));
    for (let dstIndex = 0; dstIndex < result.length; dstIndex++) {
      for (let bit = 0; bit < UINT8_BITS_PER_ELEMENT; bit++) {
        const srcIndex = dstIndex * UINT8_BITS_PER_ELEMENT + bit;
        if (this.getByIndex(srcIndex)) {
          const resBit = bitOrder === BitOrder.BigEndian ? bit : UINT8_BITS_PER_ELEMENT - 1 - bit;
          result[dstIndex] = setBit(result[dstIndex], resBit);
        }
      }
    }
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resize(width: number, height: number) {}

  toJSON(): BitmapObject {
    return {
      width: this.width,
      height: this.height,
      data: convertBoolArrayToUint32Array(this.#data),
    };
  }
}
