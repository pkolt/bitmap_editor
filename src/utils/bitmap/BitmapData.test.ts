import { test, expect } from '@/test-utils';
import { BitmapData } from './BitmapData';
import { Point } from './Point';

test('create empty', () => {
  const data = BitmapData.create(8, 8);
  expect(data.width).toBe(8);
  expect(data.height).toBe(8);
  expect(data.array).toEqual(Uint32Array.from([0, 0]));
  expect(data.isEmpty()).toBeTruthy();
});

test('getter pixelCount', () => {
  const data = BitmapData.create(8, 8);
  expect(data.pixelCount).toBe(64);
});

test('pointToIndex()', () => {
  const data = BitmapData.create(4, 4);
  expect(data.pointToIndex(new Point(0, 0))).toBe(0);
  expect(data.pointToIndex(new Point(3, 0))).toBe(3);
  expect(data.pointToIndex(new Point(0, 1))).toBe(4);
  expect(data.pointToIndex(new Point(3, 1))).toBe(7);
  expect(data.pointToIndex(new Point(0, 2))).toBe(8);
  expect(data.pointToIndex(new Point(3, 2))).toBe(11);
  expect(data.pointToIndex(new Point(0, 3))).toBe(12);
  expect(data.pointToIndex(new Point(3, 3))).toBe(15);
});

test('coordsToPosition() 4x4', () => {
  const data = BitmapData.create(4, 4);
  expect(data.coordsToPosition(new Point(0, 0))).toEqual({ arrayIndex: 0, bit: 0 });
  expect(data.coordsToPosition(new Point(0, 1))).toEqual({ arrayIndex: 0, bit: 4 });
  expect(data.coordsToPosition(new Point(0, 2))).toEqual({ arrayIndex: 0, bit: 8 });
  expect(data.coordsToPosition(new Point(0, 3))).toEqual({ arrayIndex: 0, bit: 12 });
  expect(data.coordsToPosition(new Point(3, 3))).toEqual({ arrayIndex: 0, bit: 15 });
  expect(data.coordsToPosition(new Point(0, 4))).toEqual(null);
});

test('coordsToPosition() 32x32', () => {
  const data = BitmapData.create(32, 32);
  expect(data.coordsToPosition(new Point(0, 0))).toEqual({ arrayIndex: 0, bit: 0 });
  expect(data.coordsToPosition(new Point(0, 1))).toEqual({ arrayIndex: 1, bit: 0 });
  expect(data.coordsToPosition(new Point(0, 31))).toEqual({ arrayIndex: 31, bit: 0 });
  expect(data.coordsToPosition(new Point(31, 31))).toEqual({ arrayIndex: 31, bit: 31 });
  expect(data.coordsToPosition(new Point(0, 32))).toEqual(null);
});

test('coordsToPosition() 40x40', () => {
  const data = BitmapData.create(40, 40);
  expect(data.coordsToPosition(new Point(0, 0))).toEqual({ arrayIndex: 0, bit: 0 });
  expect(data.coordsToPosition(new Point(0, 1))).toEqual({ arrayIndex: 1, bit: 8 });
  expect(data.coordsToPosition(new Point(0, 39))).toEqual({ arrayIndex: 48, bit: 24 });
  expect(data.coordsToPosition(new Point(39, 39))).toEqual({ arrayIndex: 49, bit: 31 });
  expect(data.coordsToPosition(new Point(0, 40))).toEqual(null);
});

test('change values', () => {
  const data = BitmapData.create(8, 8);
  data.setValue(0, true); // first pixel
  expect(data.array).toEqual(Uint32Array.from([1, 0]));
  data.setValue(0, false);
  expect(data.array).toEqual(Uint32Array.from([0, 0]));

  data.setValue(63, true); // last pixel
  expect(data.array).toEqual(Uint32Array.from([0, 2147483648]));
  data.setValue(63, false);
  expect(data.array).toEqual(Uint32Array.from([0, 0]));

  data.setValue(new Point(0, 0), true); // first pixel
  data.setValue(new Point(7, 7), true); // last pixel
  expect(data.array).toEqual(Uint32Array.from([1, 2147483648]));
});

test('draw square', () => {
  const data = BitmapData.create(4, 4);
  data.setValue(new Point(0, 0), true);
  data.setValue(new Point(1, 0), true);
  data.setValue(new Point(2, 0), true);
  data.setValue(new Point(3, 0), true);

  data.setValue(new Point(0, 1), true);
  data.setValue(new Point(3, 1), true);

  data.setValue(new Point(0, 2), true);
  data.setValue(new Point(3, 2), true);

  data.setValue(new Point(0, 3), true);
  data.setValue(new Point(1, 3), true);
  data.setValue(new Point(2, 3), true);
  data.setValue(new Point(3, 3), true);

  expect(data.array).toEqual(Uint32Array.from([63903]));
});

test('constructor (invalid data)', () => {
  expect(() => new BitmapData(8, 8, Uint32Array.from([0, 0, 0]))).toThrowError();
});
