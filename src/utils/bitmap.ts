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
    return index < this.length ? index : -1;
  }

  getByCoords(x: number, y: number): boolean {
    const index = this.#coordsToIndex(x, y);
    return index !== -1 ? this.getByIndex(index) : false;
  }

  setByCoords(x: number, y: number, value: boolean): void {
    const index = this.#coordsToIndex(x, y);
    if (index !== -1) {
      this.setByIndex(index, value);
    }
  }

  invertByCoords(x: number, y: number): void {
    const index = this.#coordsToIndex(x, y);
    if (index !== -1) {
      this.invertByIndex(index);
    }
  }

  findBitmapCoords() {
    const xArray: number[] = [];
    const yArray: number[] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const value = this.getByCoords(x, y);
        if (value) {
          xArray.push(x);
          yArray.push(y);
        }
      }
    }

    if (xArray.length === 0 || yArray.length === 0) {
      return null;
    }

    const xMin = Math.min(...xArray);
    const xMax = Math.max(...xArray);
    const yMin = Math.min(...yArray);
    const yMax = Math.max(...yArray);

    return {
      x: xMin,
      y: yMin,
      width: xMax - xMin + 1,
      height: yMax - yMin + 1,
    };
  }

  getBitmap(x: number, y: number, width: number, height: number): Bitmap {
    const bitmap = new Bitmap(width, height);
    for (let posX = 0; posX < width; posX++) {
      for (let posY = 0; posY < height; posY++) {
        const value = this.getByCoords(x + posX, y + posY);
        bitmap.setByCoords(posX, posY, value);
      }
    }
    return bitmap;
  }

  putBitmap(x: number, y: number, bitmap: Bitmap) {
    for (let posX = 0; posX < bitmap.width; posX++) {
      for (let posY = 0; posY < bitmap.height; posY++) {
        const value = bitmap.getByCoords(posX, posY);
        this.setByCoords(x + posX, y + posY, value);
      }
    }
  }

  resize(width: number, height: number) {
    let bitmap: Bitmap | null = null;
    const coords = this.findBitmapCoords();
    if (coords) {
      bitmap = this.getBitmap(coords.x, coords.y, coords.width, coords.height);
      // Crop bitmap
      if (bitmap.width > width || bitmap.height > height) {
        bitmap = bitmap.getBitmap(
          0,
          0,
          bitmap.width > width ? width : bitmap.width,
          bitmap.height > height ? height : bitmap.height,
        );
      }
    }

    this.width = width;
    this.height = height;
    this.#data = new Array(this.length).fill(false);

    if (bitmap) {
      this.putBitmap(0, 0, bitmap);
    }
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

  toJSON(): BitmapObject {
    return {
      width: this.width,
      height: this.height,
      data: convertBoolArrayToUint32Array(this.#data),
    };
  }
}
