import { UINT8_BITS_PER_ELEMENT } from './constants';
import { setBit } from '../bitwise';
import { convertBoolArrayToUint32Array, convertUint32ArrayToBoolArray } from './convert';
import { BitOrder, BitmapJSON } from './types';
import { Area } from './Area';
import { Point } from './Point';

export class Bitmap {
  width: number;
  height: number;
  _data: Uint8Array;

  static fromJSON({ width, height, data }: BitmapJSON): Bitmap {
    return new Bitmap(width, height, convertUint32ArrayToBoolArray(data));
  }

  constructor(width: number, height: number, data?: Uint8Array) {
    this.width = width;
    this.height = height;

    if (data && data.length !== this.getPixelCount()) {
      throw new Error('Invalid bitmap data');
    }

    this._data = data ? new Uint8Array(data) : this.#createData();
  }

  #createData(): Uint8Array {
    return new Uint8Array(this.getPixelCount());
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
    return this.#isValidIndex(index) ? !!this._data[index] : false;
  }

  setPixelValue(coords: Point | number, value: boolean): void {
    const index = this.#prepareCoords(coords);
    if (this.#isValidIndex(index)) {
      this._data[index] = Number(value);
    }
  }

  invertPixelValue(coords: Point | number): void {
    const index = this.#prepareCoords(coords);
    if (this.#isValidIndex(index)) {
      this._data[index] = Number(!this._data[index]);
    }
  }

  findFillPixelsArea(area?: Area): Area | null {
    let minX: number | null = null;
    let maxX: number | null = null;
    let minY: number | null = null;
    let maxY: number | null = null;

    (area ?? this.getArea()).forEach((p) => {
      const isFill = this.getPixelValue(p);
      if (!isFill) {
        return;
      }
      minX = minX === null || p.x < minX ? p.x : minX;
      maxX = maxX === null || p.x > maxX ? p.x : maxX;
      minY = minY === null || p.y < minY ? p.y : minY;
      maxY = maxY === null || p.y > maxY ? p.y : maxY;
    });

    if (minX !== null && maxX !== null && minY !== null && maxY !== null) {
      return new Area(new Point(minX, minY), new Point(maxX, maxY));
    }
    return null;
  }

  copy(area: Area): Bitmap {
    const bitmap = new Bitmap(area.width, area.height);
    area.forEach((p) => {
      const pixelValue = this.getPixelValue(p);
      const absPoint = p.minus(area.minPoint);
      bitmap.setPixelValue(absPoint, pixelValue);
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
    const fillPixelsArea = this.findFillPixelsArea();
    if (fillPixelsArea) {
      bitmap = this.copy(fillPixelsArea);
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
    this._data = this.#createData();

    if (bitmap) {
      this.paste(new Point(0, 0), bitmap);
    }
  }

  move(offset: Point, area?: Area): void {
    const moveArea = this.findFillPixelsArea(area) ?? this.getArea();
    const bitmap = this.copy(moveArea);
    this.clear(area);
    this.paste(moveArea.minPoint.plus(offset), bitmap);
  }

  isEmpty(area?: Area): boolean {
    if (area) {
      return this.copy(area).isEmpty();
    }
    return this._data.every((v) => !v);
  }

  clear(area?: Area): void {
    if (area && area.isNotEqual(this.getArea())) {
      area.forEach((p) => {
        this.setPixelValue(p, false);
      });
    } else {
      this._data.fill(0);
    }
  }

  invertColor(area?: Area): void {
    if (area && area.isNotEqual(this.getArea())) {
      area.forEach((p) => {
        this.invertPixelValue(p);
      });
    } else {
      this._data = this._data.map((val) => Number(!val));
    }
  }

  clone(): Bitmap {
    return new Bitmap(this.width, this.height, this._data);
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
      data: convertBoolArrayToUint32Array(this._data),
    };
  }
}
