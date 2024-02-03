import { clearBit, isSetBit, setBit } from './bitwise';

const BITS_PER_ELEMENT = 32;
const SSD1306_COLUMN_BITS = 8;

export class Bitmap {
  width: number;
  height: number;
  #data: Uint32Array;

  static fromObject({ width, height, data }: { width: number; height: number; data: number[] }): Bitmap {
    return new Bitmap(width, height, data && data.length > 0 ? Uint32Array.from(data) : undefined);
  }

  constructor(width: number, height: number, data?: Uint32Array) {
    this.width = width;
    this.height = height;

    const arrLength = Math.ceil((width * height) / BITS_PER_ELEMENT);

    if (data && data.length !== arrLength) {
      throw new Error('Invalid bitmap data');
    }

    this.#data = data ? new Uint32Array(data) : new Uint32Array(arrLength);
  }

  get length(): number {
    return this.width * this.height;
  }

  getByIndex(index: number): boolean {
    const pos = Math.floor(index / BITS_PER_ELEMENT);
    const bit = index - BITS_PER_ELEMENT * pos;
    return isSetBit(this.#data[pos], bit);
  }

  setByIndex(index: number, value: boolean): void {
    const pos = Math.floor(index / BITS_PER_ELEMENT);
    const bit = index - BITS_PER_ELEMENT * pos;
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

  clone(): Bitmap {
    return new Bitmap(this.width, this.height, this.#data);
  }

  toSSD1306(): Uint8Array {
    const result = new Uint8Array((this.width * this.height) / SSD1306_COLUMN_BITS);
    for (let page = 0; page < this.height / SSD1306_COLUMN_BITS; page++) {
      for (let column = 0; column < this.width; column++) {
        const dstIndex = column + page * this.width;
        for (let bit = 0; bit < SSD1306_COLUMN_BITS; bit++) {
          const srcIndex = bit * this.width + this.width * SSD1306_COLUMN_BITS * page + column;
          if (this.getByIndex(srcIndex)) {
            result[dstIndex] = setBit(result[dstIndex], bit);
          }
        }
      }
    }
    return result;
  }

  toJSON(): number[] {
    return Array.from(this.#data);
  }
}
