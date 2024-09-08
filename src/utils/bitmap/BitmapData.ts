import { UINT32_BITS } from './constants';
import { Point } from './Point';
import { Coords } from './types';

interface Position {
  arrayIndex: number;
  bit: number;
}

export class BitmapData {
  #width: number;
  #height: number;
  #array: Uint32Array;

  static create(width: number, height: number) {
    const array = new Uint32Array(Math.ceil((width * height) / UINT32_BITS));
    return new BitmapData(width, height, array);
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  get pixelCount(): number {
    return this.#width * this.#height;
  }

  get array(): Uint32Array {
    return Uint32Array.from(this.#array);
  }

  constructor(width: number, height: number, array: Uint32Array) {
    this.#width = width;
    this.#height = height;
    this.#array = Uint32Array.from(array);

    const validLength = Math.ceil(this.pixelCount / UINT32_BITS);
    if (validLength !== array.length) {
      throw new Error(`Invalid bitmap data: ${validLength} !== ${array.length}`);
    }
  }

  pointToIndex(p: Point): number {
    const index = p.y * this.#width + p.x;
    // Return -1 if invalid coords
    return index < this.pixelCount ? index : -1;
  }

  coordsToPosition(coords: Coords): Position | null {
    const index = coords instanceof Point ? this.pointToIndex(coords) : coords;
    const isValidIndex = index >= 0 && index < this.pixelCount;

    if (isValidIndex) {
      const arrayIndex = Math.floor(index / UINT32_BITS);
      const bit = index % UINT32_BITS;
      return { arrayIndex, bit };
    }
    return null;
  }

  getValue(coords: Coords): boolean {
    const position = this.coordsToPosition(coords);
    if (position) {
      const { arrayIndex, bit } = position;
      return !!(BigInt(this.#array[arrayIndex]) & (1n << BigInt(bit)));
    }
    return false;
  }

  setValue(coords: Coords, value: boolean): void {
    const position = this.coordsToPosition(coords);
    if (position) {
      const { arrayIndex, bit } = position;
      if (value) {
        this.#array[arrayIndex] = Number(BigInt(this.#array[arrayIndex]) | (1n << BigInt(bit)));
      } else {
        this.#array[arrayIndex] = Number(BigInt(this.#array[arrayIndex]) & ~(1n << BigInt(bit)));
      }
    }
  }

  isEmpty(): boolean {
    return this.#array.every((val) => val === 0);
  }

  clone(): BitmapData {
    return new BitmapData(this.#width, this.#height, Uint32Array.from(this.#array));
  }
}
