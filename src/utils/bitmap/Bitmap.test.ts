import { test, expect, beforeEach } from '@/test-utils';
import { Bitmap } from './Bitmap';
import { bitmapEntity } from '@/test-utils/bitmaps';
import { Point } from './Point';
import { Area } from './Area';
import { BitOrder } from './types';

const bitmapData8x8 = new Uint8Array([
  1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
  1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
]);

let bitmap: Bitmap;

beforeEach(() => {
  bitmap = new Bitmap(8, 8, bitmapData8x8);
});

test('fromJSON', () => {
  const bitmapFromJson = Bitmap.fromJSON(bitmapEntity);
  expect(bitmapFromJson.width).toBe(8);
  expect(bitmapFromJson.height).toBe(8);
  expect(bitmapFromJson._data).toEqual(bitmapData8x8);
});

test('constructor', () => {
  expect(bitmap.width).toBe(8);
  expect(bitmap.height).toBe(8);
});

test('constructor (invalid data)', () => {
  expect(() => new Bitmap(8, 10, bitmapData8x8)).toThrowError();
});

test('getPixelCount', () => {
  expect(bitmap.getPixelCount()).toBe(64);
});

test('getArea', () => {
  const area = bitmap.getArea();
  expect(area.width).toBe(8);
  expect(area.height).toBe(8);
  expect(area.minX).toBe(0);
  expect(area.minY).toBe(0);
  expect(area.maxX).toBe(7); //! Why 7?
  expect(area.maxY).toBe(7); //! Why 7?
});

test('getPixelValue', () => {
  expect(bitmap.getPixelValue(0)).toBeTruthy();
  expect(bitmap.getPixelValue(new Point(0, 0))).toBeTruthy();
  expect(bitmap.getPixelValue(4)).toBeFalsy();
  expect(bitmap.getPixelValue(new Point(0, 4))).toBeFalsy();
  expect(bitmap.getPixelValue(bitmap.getPixelCount() + 10)).toBeFalsy(); // invalid value (no throw error)
});

test('setPixelValue', () => {
  bitmap.setPixelValue(0, false);
  bitmap.setPixelValue(4, true);
  expect(bitmap.getPixelValue(0)).toBeFalsy();
  expect(bitmap.getPixelValue(4)).toBeTruthy();
});

test('invertPixelValue', () => {
  bitmap.invertPixelValue(0);
  expect(bitmap.getPixelValue(0)).toBeFalsy();
});

test('findFillPixelsArea (2x2)', () => {
  bitmap = new Bitmap(8, 8);
  bitmap.setPixelValue(new Point(0, 0), true);
  bitmap.setPixelValue(new Point(0, 1), true);
  bitmap.setPixelValue(new Point(1, 0), true);
  bitmap.setPixelValue(new Point(1, 1), true);
  const area = bitmap.findFillPixelsArea();
  expect(area).not.toBeNull();
  expect(area?.width).toBe(2);
  expect(area?.height).toBe(2);
  expect(area?.minX).toBe(0);
  expect(area?.minY).toBe(0);
  expect(area?.maxX).toBe(1); //! Why 1?
  expect(area?.maxY).toBe(1); //! Why 1?
});

test('findFillPixelsArea (empty)', () => {
  bitmap = new Bitmap(8, 8);
  const area = bitmap.findFillPixelsArea();
  expect(area).toBeNull();
});

test('copy', () => {
  const copied = bitmap.copy(Area.fromRectangle(0, 0, 4, 4));
  expect(copied.toJSON()).toMatchObject({ width: 4, height: 4, data: [16, 63903] });
});

test('paste', () => {
  bitmap.paste(new Point(3, 3), new Bitmap(4, 4));
  expect(bitmap.toJSON()).toMatchObject({ width: 8, height: 8, data: [64, 118081999, -209485696] });
});

test('resize (8x8 -> 16x16)', () => {
  bitmap.resize(16, 16);
  expect(bitmap.toJSON()).toMatchObject({
    width: 16,
    height: 16,
    data: [256, 13172943, 983049, 15728880, 15925491, 0, 0, 0, 0],
  });
});

test('resize (8x8 -> 4x4)', () => {
  bitmap.resize(4, 4);
  expect(bitmap.toJSON()).toMatchObject({
    width: 4,
    height: 4,
    data: [16, 63903],
  });
});

test('move', () => {
  bitmap.move(new Point(2, 2));
  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [64, 658243584, -1010811865],
  });
});

test('isEmpty', () => {
  expect(bitmap.isEmpty()).toBeFalsy();
  expect(new Bitmap(8, 8).isEmpty()).toBeTruthy();
});

test('isEmpty (with area)', () => {
  const area = Area.fromRectangle(0, 0, 4, 4);
  expect(bitmap.isEmpty(area)).toBeFalsy();
  expect(new Bitmap(8, 8).isEmpty(area)).toBeTruthy();
});

test('clear', () => {
  bitmap.clear();
  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [64, 0, 0],
  });
});

test('clear (with area)', () => {
  const area = Area.fromRectangle(0, 0, 4, 4);
  bitmap.clear(area);
  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [64, 49344, -202116880],
  });
});

test('invertColor', () => {
  bitmap.invertColor();
  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [64, -252299728, 202116879],
  });
});

test('invertColor (with area)', () => {
  const area = Area.fromRectangle(0, 0, 4, 4);
  bitmap.invertColor(area);
  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [64, 444096, -202116880],
  });
});

test('clone', () => {
  const copied = bitmap.clone();
  expect(copied).not.toBe(bitmap);
  expect(copied.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [64, 252299727, -202116880],
  });
});

test('toXBitMap (BE)', () => {
  const arr = bitmap.toXBitMap(BitOrder.BigEndian);
  expect(arr).toEqual(new Uint8Array([207, 201, 9, 15, 240, 240, 243, 243]));
});

test('toXBitMap (LE)', () => {
  const arr = bitmap.toXBitMap(BitOrder.LittleEndian);
  expect(arr).toEqual(new Uint8Array([243, 147, 144, 240, 15, 15, 207, 207]));
});
