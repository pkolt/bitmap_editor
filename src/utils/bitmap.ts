import { clearBit, isSetBit, setBit } from './bitwise';

const BITS_PER_ELEMENT = 32;
const SSD1306_COLUMN_BITS = 8;

export class Bitmap {
  width: number;
  height: number;
  #data: Uint32Array;

  constructor(width: number, height: number, data?: number[]) {
    this.width = width;
    this.height = height;

    const bytesLength = Math.ceil((width * height) / BITS_PER_ELEMENT);

    if (data && data.length > 0) {
      if (data.length !== bytesLength) {
        throw new Error('Invalid image data');
      }
      this.#data = Uint32Array.from(data);
    } else {
      this.#data = new Uint32Array(bytesLength);
    }
  }

  get length(): number {
    return this.width * this.height;
  }

  get(index: number): boolean {
    const pos = Math.floor(index / BITS_PER_ELEMENT);
    const bit = index - (BITS_PER_ELEMENT * pos);
    return isSetBit(this.#data[pos], bit);
  }

  set(index: number, value: boolean): void {
    const pos = Math.floor(index / BITS_PER_ELEMENT);
    const bit = index - (BITS_PER_ELEMENT * pos);
    this.#data[pos] = value ? setBit(this.#data[pos], bit) : clearBit(this.#data[pos], bit);
  }

  toSSD1306(): Uint8Array {
    const result = new Uint8Array((this.width * this.height) / SSD1306_COLUMN_BITS);
    for (let page = 0; page < this.height / SSD1306_COLUMN_BITS; page++) {
      for (let column = 0; column < this.width; column++) {
        const dstIndex = column + page * this.width;
        for (let bit = 0; bit < SSD1306_COLUMN_BITS; bit++) {
          const srcIndex = bit * this.width + this.width * SSD1306_COLUMN_BITS * page + column;
          if (this.get(srcIndex)) {
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
