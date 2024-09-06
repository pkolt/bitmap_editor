import { test, expect, beforeEach } from '@/test-utils';
import { Bitmap } from './Bitmap';
import { bitmapEntity } from '@/test-utils/bitmaps';
import { Point } from './Point';
import { Area } from './Area';
import { BitmapData } from './BitmapData';

const bitmapArray = new Uint32Array(bitmapEntity.data);

let bitmap: Bitmap;

beforeEach(() => {
  bitmap = new Bitmap(new BitmapData(8, 8, bitmapArray));
});

test('fromJSON', () => {
  const bitmapFromJson = Bitmap.fromJSON(bitmapEntity);
  expect(bitmapFromJson.width).toBe(8);
  expect(bitmapFromJson.height).toBe(8);
  expect(bitmapFromJson.data.array).toEqual(bitmapArray);
});

test('constructor', () => {
  expect(bitmap.width).toBe(8);
  expect(bitmap.height).toBe(8);
});

test('getArea', () => {
  const area = bitmap.area;
  expect(area.width).toBe(8);
  expect(area.height).toBe(8);
  expect(area.minPoint.x).toBe(0);
  expect(area.minPoint.y).toBe(0);
  expect(area.maxPoint.x).toBe(7); //! Why 7?
  expect(area.maxPoint.y).toBe(7); //! Why 7?
});

test('getPixelValue', () => {
  expect(bitmap.getPixelValue(0)).toBeTruthy();
  expect(bitmap.getPixelValue(new Point(0, 0))).toBeTruthy();
  expect(bitmap.getPixelValue(4)).toBeFalsy();
  expect(bitmap.getPixelValue(new Point(0, 4))).toBeFalsy();
  expect(bitmap.getPixelValue(74)).toBeFalsy(); // invalid value (no throw error)
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
  bitmap = Bitmap.create(8, 8);
  bitmap.setPixelValue(new Point(0, 0), true);
  bitmap.setPixelValue(new Point(0, 1), true);
  bitmap.setPixelValue(new Point(1, 0), true);
  bitmap.setPixelValue(new Point(1, 1), true);
  const area = bitmap.findFillPixelsArea();
  expect(area).not.toBeNull();
  expect(area?.width).toBe(2);
  expect(area?.height).toBe(2);
  expect(area?.minPoint.x).toBe(0);
  expect(area?.minPoint.y).toBe(0);
  expect(area?.maxPoint.x).toBe(1); //! Why 1?
  expect(area?.maxPoint.y).toBe(1); //! Why 1?
});

test('findFillPixelsArea (empty)', () => {
  bitmap = Bitmap.create(8, 8);
  const area = bitmap.findFillPixelsArea();
  expect(area).toBeNull();
});

test('copy', () => {
  const copied = bitmap.copy(Area.fromRectangle(0, 0, 4, 4));
  expect(copied.toJSON()).toMatchObject({ width: 4, height: 4, data: [63903] });
});

test('paste', () => {
  bitmap.paste(new Point(3, 3), Bitmap.create(4, 4));
  expect(bitmap.toJSON()).toMatchObject({ width: 8, height: 8, data: [118081999, 4085481600] });
});

test('resize (8x8 -> 16x16)', () => {
  bitmap.resize(16, 16);
  expect(bitmap.toJSON()).toMatchObject({
    width: 16,
    height: 16,
    data: [13172943, 983049, 15728880, 15925491, 0, 0, 0, 0],
  });
});

test('resize (8x8 -> 4x4)', () => {
  bitmap.resize(4, 4);
  expect(bitmap.toJSON()).toMatchObject({
    width: 4,
    height: 4,
    data: [63903],
  });
});

test('move', () => {
  bitmap.move(new Point(2, 2));
  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [658243584, 3284155431],
  });
});

test('isEmpty', () => {
  expect(bitmap.isEmpty()).toBeFalsy();
  expect(Bitmap.create(4, 4).isEmpty()).toBeTruthy();
});

test('isEmpty (with area)', () => {
  const area = Area.fromRectangle(0, 0, 4, 4);
  expect(bitmap.isEmpty(area)).toBeFalsy();
  expect(Bitmap.create(8, 8).isEmpty(area)).toBeTruthy();
});

test('clear', () => {
  bitmap.clear();
  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [0, 0],
  });
});

test('clear (with area)', () => {
  const area = Area.fromRectangle(0, 0, 4, 4);
  bitmap.clear(area);
  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [49344, 4092850416],
  });
});

test('invertColor', () => {
  bitmap.invertColor();

  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [4042667568, 202116879],
  });
});

test('invertColor (with area)', () => {
  const area = Area.fromRectangle(0, 0, 4, 4);
  bitmap.invertColor(area);
  expect(bitmap.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [444096, 4092850416],
  });
});

test('clone', () => {
  const copied = bitmap.clone();
  expect(copied).not.toBe(bitmap);
  expect(copied.toJSON()).toMatchObject({
    width: 8,
    height: 8,
    data: [252299727, 4092850416],
  });
});
