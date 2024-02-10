import { clearBit, isSetBit, setBit } from './bitwise';

export enum BitOrder {
  BigEndian = 'big-endian', // MSB (Most Significant Byte) or BE (Big-Endian)
  LittleEndian = 'little-endian', // LSB (Least Significant Byte) or LE (Little-Endian)
}

const UINT32_BITS_PER_ELEMENT = 32;
const UINT8_BITS_PER_ELEMENT = 8;

export class Bitmap {
  width: number;
  height: number;
  #data: Uint32Array;

  constructor(width: number, height: number, data?: Uint32Array | number[]) {
    this.width = width;
    this.height = height;

    const arrayLength = Math.ceil((width * height) / UINT32_BITS_PER_ELEMENT);

    const isEmptyData = !data || data.length === 0;

    if (!isEmptyData && data.length !== arrayLength) {
      throw new Error('Invalid bitmap data');
    }

    this.#data = isEmptyData ? new Uint32Array(arrayLength) : new Uint32Array(data);
  }

  get length(): number {
    return this.width * this.height;
  }

  getByIndex(index: number): boolean {
    const pos = Math.floor(index / UINT32_BITS_PER_ELEMENT);
    const bit = index - UINT32_BITS_PER_ELEMENT * pos;
    return isSetBit(this.#data[pos], bit);
  }

  setByIndex(index: number, value: boolean): void {
    const pos = Math.floor(index / UINT32_BITS_PER_ELEMENT);
    const bit = index - UINT32_BITS_PER_ELEMENT * pos;
    this.#data[pos] = value ? setBit(this.#data[pos], bit) : clearBit(this.#data[pos], bit);
  }

  invertByIndex(index: number): void {
    this.setByIndex(index, !this.getByIndex(index));
  }

  #coordsToIndex(x: number, y: number): number {
    const index = y * this.width + x;
    if (index >= this.length) {
      throw new Error(`Invalid coordinates: ${x}, ${y}.`);
    }
    return index;
  }

  getByCoords(x: number, y: number): boolean {
    return this.getByIndex(this.#coordsToIndex(x, y));
  }

  setByCoords(x: number, y: number, value: boolean): void {
    return this.setByIndex(this.#coordsToIndex(x, y), value);
  }

  invertByCoords(x: number, y: number): void {
    this.invertByIndex(this.#coordsToIndex(x, y));
  }

  isEmpty(): boolean {
    return this.#data.every((v) => v === 0);
  }

  reset() {
    this.#data.fill(0);
  }

  invertColor() {
    for (let i = 0; i < this.length; i++) {
      this.invertByIndex(i);
    }
  }

  clone(): Bitmap {
    return new Bitmap(this.width, this.height, this.#data);
  }

  toXBitMap(bitOrder: BitOrder): Uint8Array {
    const result = new Uint8Array((this.width * this.height) / UINT8_BITS_PER_ELEMENT);
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

  toJSON(): number[] {
    return Array.from(this.#data);
  }
}
