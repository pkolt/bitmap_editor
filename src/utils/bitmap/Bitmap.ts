import { UINT8_BITS_PER_ELEMENT } from './constants';
import { setBit } from '../bitwise';
import { convertBoolArrayToUint32Array, convertUint32ArrayToBoolArray } from './convert';
import { BitOrder, BitmapJSON } from './types';
import { Area } from './Area';
import { Point } from './Point';

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

    this.#data = data ? [...data] : this.#createData();
  }

  #createData() {
    return new Array(this.getPixelCount()).fill(false);
  }

  #pointToIndex(p: Point): number {
    const index = p.y * this.width + p.x;
    // Return -1 if invalid coords
    return index < this.getPixelCount() ? index : -1;
  }

  #prepareCoords(coords: Point | number): number {
    return coords instanceof Point ? this.#pointToIndex(coords) : coords;
  }

  #isValidIndex(index: number): boolean {
    return index >= 0 && index < this.getPixelCount();
  }

  getPixelCount(): number {
    return this.width * this.height;
  }

  getArea(): Area {
    return Area.fromRectangle(0, 0, this.width, this.height);
  }

  getPixelValue(coords: Point | number): boolean {
    const index = this.#prepareCoords(coords);
    return this.#isValidIndex(index) ? this.#data[index] : false;
  }

  setPixelValue(coords: Point | number, value: boolean): void {
    const index = this.#prepareCoords(coords);
    if (this.#isValidIndex(index)) {
      this.#data[index] = value;
    }
  }

  invertPixelValue(coords: Point | number): void {
    const index = this.#prepareCoords(coords);
    if (this.#isValidIndex(index)) {
      this.#data[index] = !this.#data[index];
    }
  }

  //! bad method
  findBitmapCoords(): Area | null {
    const xArray: number[] = [];
    const yArray: number[] = [];

    this.getArea().forEach((p) => {
      const value = this.getPixelValue(p);
      if (value) {
        xArray.push(p.x);
        yArray.push(p.y);
      }
    });

    if (xArray.length === 0 || yArray.length === 0) {
      return null;
    }

    const minX = Math.min(...xArray);
    const maxX = Math.max(...xArray);
    const minY = Math.min(...yArray);
    const maxY = Math.max(...yArray);

    return Area.fromRectangle(minX, minY, maxX - minX + 1, maxY - minY + 1);
  }

  copy(area: Area): Bitmap {
    const bitmap = new Bitmap(area.width, area.height);
    area.forEach((p) => {
      const pixelValue = this.getPixelValue(area.minPoint.plus(p));
      bitmap.setPixelValue(p, pixelValue);
    });
    return bitmap;
  }

  paste(offset: Point, bitmap: Bitmap): void {
    bitmap.getArea().forEach((p) => {
      const value = bitmap.getPixelValue(p);
      this.setPixelValue(p.plus(offset), value);
    });
  }

  resize(width: number, height: number): void {
    let bitmap: Bitmap | null = null;
    const area = this.findBitmapCoords();
    if (area) {
      bitmap = this.copy(area);
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
    this.#data = this.#createData();

    if (bitmap) {
      this.paste(new Point(0, 0), bitmap);
    }
  }

  move(offset: Point, area?: Area) {
    const moveArea = area ? area : this.getArea();
    const bitmap = this.copy(moveArea);
    this.clear(area);
    this.paste(moveArea.minPoint.plus(offset), bitmap);
  }

  isEmpty(area?: Area): boolean {
    if (area) {
      return this.copy(area).isEmpty();
    }
    return this.#data.every((v) => !v);
  }

  clear(area?: Area): void {
    if (area && area.isNotEqual(this.getArea())) {
      area.forEach((p) => {
        this.setPixelValue(p, false);
      });
    } else {
      this.#data.fill(false);
    }
  }

  invertColor(area?: Area): void {
    if (area && area.isNotEqual(this.getArea())) {
      area.forEach((p) => {
        this.invertPixelValue(p);
      });
    } else {
      this.#data = this.#data.map((val) => !val);
    }
  }

  clone(): Bitmap {
    return new Bitmap(this.width, this.height, this.#data);
  }

  toXBitMap(bitOrder: BitOrder): Uint8Array {
    const result = new Uint8Array(Math.ceil(this.getPixelCount() / UINT8_BITS_PER_ELEMENT));
    for (let dstIndex = 0; dstIndex < result.length; dstIndex++) {
      for (let bit = 0; bit < UINT8_BITS_PER_ELEMENT; bit++) {
        const srcIndex = dstIndex * UINT8_BITS_PER_ELEMENT + bit;
        if (this.getPixelValue(srcIndex)) {
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
