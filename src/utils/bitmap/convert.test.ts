import { expect, test } from '@/test-utils';
import { getArrayOfNumLength, binaryToNumber, numberToBinary, toArrayOfNumber, reverseBits } from './convert';

const test1ArrayOfBool = Uint8Array.from([1, 1, 0, 1]);
const test1ArrayOfNumber = [13]; // [size, elem1, elem2, ..., elemN]

const test2ArrayOfBool = Uint8Array.from([...Array(16).fill(1), ...Array(16).fill(0), ...Array(16).fill(1)]);
const test2ArrayOfNumber = [4294901760, 65535];

const test3ArrayOfBool = new Uint8Array(16).fill(1);
const test3ArrayOfNumber = [65535];

test('getArrayOfNumLength', () => {
  expect(getArrayOfNumLength(1)).toBe(1);
  expect(getArrayOfNumLength(8)).toBe(1);
  expect(getArrayOfNumLength(32)).toBe(1);
  expect(getArrayOfNumLength(64)).toBe(2);
});

test('binaryToNumber', () => {
  expect(binaryToNumber(Uint8Array.from({ length: 16 }).fill(0))).toBe(0);
  expect(binaryToNumber(Uint8Array.from({ length: 16 }).fill(1))).toBe(65535);
  expect(binaryToNumber(Uint8Array.from({ length: 32 }).fill(0))).toBe(0);
  expect(binaryToNumber(Uint8Array.from({ length: 32 }).fill(1))).toBe(4294967295);
  expect(() => binaryToNumber(Uint8Array.from({ length: 33 }))).toThrowError();
  expect(binaryToNumber(Uint8Array.from([1, 0, 1, 0]))).toBe(10);
  expect(binaryToNumber(Uint8Array.from([1, 1, 0, 0]))).toBe(12);
  expect(binaryToNumber(Uint8Array.from([1, 1, 1, 1]))).toBe(15);
  expect(binaryToNumber(Uint8Array.from([0, 0, 0, 0]))).toBe(0);
});

test('numberToBinary', () => {
  expect(numberToBinary(10, 4)).toEqual(Uint8Array.from([1, 0, 1, 0]));
  expect(numberToBinary(12, 4)).toEqual(Uint8Array.from([1, 1, 0, 0]));
  expect(numberToBinary(15, 4)).toEqual(Uint8Array.from([1, 1, 1, 1]));
  expect(numberToBinary(0, 4)).toEqual(Uint8Array.from([0, 0, 0, 0]));
});

test('toArrayOfNumber', () => {
  expect(toArrayOfNumber(test1ArrayOfBool)).toEqual(test1ArrayOfNumber);
  expect(toArrayOfNumber(test2ArrayOfBool)).toEqual(test2ArrayOfNumber);
  expect(toArrayOfNumber(test3ArrayOfBool)).toEqual(test3ArrayOfNumber);
});

test('reverseBits', () => {
  expect([208432911, 4042272816].map(reverseBits)).toEqual([4042667568, 202116879]);
  expect([4086534384, 252694479].map(reverseBits)).toEqual([252299727, 4092850416]);
});
