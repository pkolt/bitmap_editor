import { test, expect, beforeEach } from '@/test-utils';
import { Point } from './Point';

let point: Point;

beforeEach(() => {
  point = new Point(8, 16);
});

test('isEqual', () => {
  expect(point.isEqual(new Point(8, 16))).toBeTruthy();
});

test('isNotEqual', () => {
  expect(point.isNotEqual(new Point(0, 0))).toBeTruthy();
});

test('move', () => {
  const p = point.move(-8, 4);
  expect(p.x).toBe(0);
  expect(p.y).toBe(20);
});

test('plus', () => {
  const p = point.plus(new Point(2, 14));
  expect(p.x).toBe(10);
  expect(p.y).toBe(30);
});

test('minus', () => {
  const p = point.minus(new Point(4, 6));
  expect(p.x).toBe(4);
  expect(p.y).toBe(10);
});
