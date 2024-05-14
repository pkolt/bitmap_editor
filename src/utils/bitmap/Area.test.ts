import { test, expect, beforeEach } from '@/test-utils';
import { Area } from './Area';
import { Point } from './Point';

let area: Area;

beforeEach(() => {
  area = Area.fromRectangle(0, 0, 10, 20);
});

test('constructor', () => {
  const p1 = new Point(0, 0);
  const p2 = new Point(10, 20);
  const area = new Area(p1, p2);
  expect(area.minX).toBe(0);
  expect(area.minY).toBe(0);
  expect(area.maxX).toBe(10);
  expect(area.maxY).toBe(20);
});

test('fromRectangle', () => {
  expect(area.minX).toBe(0);
  expect(area.minY).toBe(0);
  expect(area.maxX).toBe(9); //! Why 9?
  expect(area.maxY).toBe(19); //! Why 9?
});

test('minPoint', () => {
  const point = area.minPoint;
  expect(point.x).toBe(0);
  expect(point.y).toBe(0);
});

test('maxPoint', () => {
  const point = area.maxPoint;
  expect(point.x).toBe(9); //! Why 9?
  expect(point.y).toBe(19); //! Why 9?
});

test('width', () => {
  expect(area.width).toBe(10);
});

test('height', () => {
  expect(area.height).toBe(20);
});

test('isIntersect', () => {
  expect(area.isIntersect(new Point(0, 0))).toBeTruthy();
  expect(area.isIntersect(new Point(9, 19))).toBeTruthy();
  expect(area.isIntersect(new Point(-1, -1))).toBeFalsy();
  expect(area.isIntersect(new Point(10, 20))).toBeFalsy();
});

test('isEqual', () => {
  expect(area.isEqual(Area.fromRectangle(0, 0, 10, 20))).toBeTruthy();
  expect(area.isEqual(Area.fromRectangle(0, 0, 5, 10))).toBeFalsy();
});

test('isNotEqual', () => {
  expect(area.isNotEqual(Area.fromRectangle(0, 0, 10, 20))).toBeFalsy();
  expect(area.isNotEqual(Area.fromRectangle(0, 0, 5, 10))).toBeTruthy();
});

test('forEach', () => {
  const smallArea = Area.fromRectangle(0, 0, 1, 2);
  const coords: [number, number][] = [];
  smallArea.forEach((p) => coords.push([p.x, p.y]));
  expect(coords).toEqual([
    [0, 0],
    [0, 1],
  ]);
});
