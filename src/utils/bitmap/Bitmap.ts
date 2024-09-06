import { BitmapJSON, Coords } from './types';
import { Area } from './Area';
import { Point } from './Point';
import { BitmapData } from './BitmapData';

export class Bitmap {
  #data: BitmapData;

  static create(width: number, height: number): Bitmap {
    const data = BitmapData.create(width, height);
    return new Bitmap(data);
  }

  static fromJSON({ width, height, data }: BitmapJSON): Bitmap {
    const array = Uint32Array.from(data);
    const bitmapData = new BitmapData(width, height, array);
    return new Bitmap(bitmapData);
  }

  get data() {
    return this.#data;
  }

  get width() {
    return this.#data.width;
  }

  get height() {
    return this.#data.height;
  }

  get area(): Area {
    return Area.fromRectangle(0, 0, this.width, this.height);
  }

  constructor(data: BitmapData) {
    this.#data = data;
  }

  getPixelValue(coords: Coords): boolean {
    return this.#data.getValue(coords);
  }

  setPixelValue(coords: Coords, value: boolean): void {
    return this.#data.setValue(coords, value);
  }

  invertPixelValue(coords: Coords): void {
    this.#data.setValue(coords, !this.#data.getValue(coords));
  }

  findFillPixelsArea(area?: Area): Area | null {
    let minX: number | null = null;
    let maxX: number | null = null;
    let minY: number | null = null;
    let maxY: number | null = null;

    (area ?? this.area).forEach((p) => {
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
    const bitmap = Bitmap.create(area.width, area.height);

    area.forEach((p) => {
      const pixelValue = this.getPixelValue(p);
      const absPoint = p.minus(area.minPoint);
      bitmap.setPixelValue(absPoint, pixelValue);
    });

    return bitmap;
  }

  paste(offset: Point, bitmap: Bitmap): void {
    bitmap.area.forEach((p) => {
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

    this.#data = BitmapData.create(width, height);

    if (bitmap) {
      this.paste(new Point(0, 0), bitmap);
    }
  }

  move(offset: Point, area?: Area): void {
    const moveArea = this.findFillPixelsArea(area) ?? this.area;
    const bitmap = this.copy(moveArea);
    this.clear(area);
    this.paste(moveArea.minPoint.plus(offset), bitmap);
  }

  isEmpty(area?: Area): boolean {
    if (area) {
      return this.copy(area).isEmpty();
    }
    return this.#data.isEmpty();
  }

  clear(area?: Area): void {
    (area ?? this.area).forEach((p) => {
      this.setPixelValue(p, false);
    });
  }

  invertColor(area?: Area): void {
    (area ?? this.area).forEach((p) => {
      this.invertPixelValue(p);
    });
  }

  clone(): Bitmap {
    return new Bitmap(this.#data.clone());
  }

  toJSON(): BitmapJSON {
    return {
      width: this.width,
      height: this.height,
      data: Array.from(this.#data.array),
    };
  }
}
