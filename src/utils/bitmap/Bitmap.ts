import { UINT8_BITS_PER_ELEMENT } from './constants';
import { setBit } from '../bitwise';
import { convertBoolArrayToUint32Array, convertUint32ArrayToBoolArray } from './convert';
import { BitOrder, BitmapJSON } from './types';
import { Area } from './Area';

export class Bitmap {
  width: number;
  height: number;
  #data: boolean[];

  static fromJSON({ width, height, data }: BitmapJSON): Bitmap {
    return new Bitmap(width, height, convertUint32ArrayToBoolArray(data));
  }

  constructor(width: number, height: number, data?: boolean[]) {
    this.width = width;
    this.height = height;

    if (data && data.length !== this.getPixelCount()) {
      throw new Error('Invalid bitmap data');
    }

    this.#data = data ? [...data] : new Array(this.getPixelCount()).fill(false);
  }

  getPixelCount(): number {
    return this.width * this.height;
  }

  getArea(): Area {
    return Area.fromRectangle(0, 0, this.width, this.height);
  }

  getPixelByIndex(index: number): boolean {
    return this.#data[index];
  }

  setPixelByIndex(index: number, value: boolean): void {
    this.#data[index] = value;
  }

  invertPixelByIndex(index: number): void {
    this.#data[index] = !this.#data[index];
  }

  #coordsToIndex(x: number, y: number): number {
    const index = y * this.width + x;
    // Return -1 if invalid coords
    return index < this.getPixelCount() ? index : -1;
  }

  getPixelByCoords(x: number, y: number): boolean {
    const index = this.#coordsToIndex(x, y);
    return index !== -1 ? this.getPixelByIndex(index) : false;
  }

  setPixelByCoords(x: number, y: number, value: boolean): void {
    const index = this.#coordsToIndex(x, y);
    if (index !== -1) {
      this.setPixelByIndex(index, value);
    }
  }

  invertPixelByCoords(x: number, y: number): void {
    const index = this.#coordsToIndex(x, y);
    if (index !== -1) {
      this.invertPixelByIndex(index);
    }
  }

  //! bad method
  findBitmapCoords() {
    const xArray: number[] = [];
    const yArray: number[] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const value = this.getPixelByCoords(x, y);
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

  copy(area: Area): Bitmap {
    const bitmap = new Bitmap(area.width, area.height);
    for (let posX = 0; posX < area.width; posX++) {
      for (let posY = 0; posY < area.height; posY++) {
        const pixelValue = this.getPixelByCoords(area.xMin + posX, area.yMin + posY);
        bitmap.setPixelByCoords(posX, posY, pixelValue);
      }
    }
    return bitmap;
  }

  paste(x: number, y: number, bitmap: Bitmap): void {
    for (let posX = 0; posX < bitmap.width; posX++) {
      for (let posY = 0; posY < bitmap.height; posY++) {
        const value = bitmap.getPixelByCoords(posX, posY);
        this.setPixelByCoords(x + posX, y + posY, value);
      }
    }
  }

  resize(width: number, height: number): void {
    let bitmap: Bitmap | null = null;
    const coords = this.findBitmapCoords();
    if (coords) {
      bitmap = this.copy(Area.fromRectangle(coords.x, coords.y, coords.width, coords.height));
      // Crop bitmap
      if (bitmap.width > width || bitmap.height > height) {
        bitmap = bitmap.copy(
          Area.fromRectangle(
            0,
            0,
            bitmap.width > width ? width : bitmap.width,
            bitmap.height > height ? height : bitmap.height,
          ),
        );
      }
    }

    this.width = width;
    this.height = height;
    this.#data = new Array(this.getPixelCount()).fill(false);

    if (bitmap) {
      this.paste(0, 0, bitmap);
    }
  }

  move(x: number, y: number, area?: Area) {
    const moveArea = area ? area : this.getArea();
    const bitmap = this.copy(moveArea);
    this.clear(area);
    this.paste(moveArea.xMin + x, moveArea.yMin + y, bitmap);
  }

  //! bad method
  moveBitmap(x: number, y: number): void {
    const coords = this.findBitmapCoords();
    if (coords) {
      const bitmap = this.copy(Area.fromRectangle(coords.x, coords.y, coords.width, coords.height));
      this.clear();
      this.paste(coords.x + x, coords.y + y, bitmap);
    }
  }

  isEmpty(area?: Area): boolean {
    if (area) {
      return this.copy(area).isEmpty();
    }
    return this.#data.every((v) => !v);
  }

  clear(area?: Area): void {
    if (area && !this.getArea().equal(area)) {
      for (let posX = 0; posX < area.width; posX++) {
        for (let posY = 0; posY < area.height; posY++) {
          this.setPixelByCoords(posX, posY, false);
        }
      }
    } else {
      this.#data.fill(false);
    }
  }

  invertColor() {
    this.#data = this.#data.map((val) => !val);
  }

  clone(): Bitmap {
    return new Bitmap(this.width, this.height, this.#data);
  }

  toXBitMap(bitOrder: BitOrder): Uint8Array {
    const result = new Uint8Array(Math.ceil(this.getPixelCount() / UINT8_BITS_PER_ELEMENT));
    for (let dstIndex = 0; dstIndex < result.length; dstIndex++) {
      for (let bit = 0; bit < UINT8_BITS_PER_ELEMENT; bit++) {
        const srcIndex = dstIndex * UINT8_BITS_PER_ELEMENT + bit;
        if (this.getPixelByIndex(srcIndex)) {
          const resBit = bitOrder === BitOrder.BigEndian ? bit : UINT8_BITS_PER_ELEMENT - 1 - bit;
          result[dstIndex] = setBit(result[dstIndex], resBit);
        }
      }
    }
    return result;
  }

  toJSON(): BitmapJSON {
    return {
      width: this.width,
      height: this.height,
      data: convertBoolArrayToUint32Array(this.#data),
    };
  }
}
