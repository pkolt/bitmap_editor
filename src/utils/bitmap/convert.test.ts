import { test, expect } from '@/test-utils';
import { convertBoolArrayToUint32Array, convertUint32ArrayToBoolArray } from './convert';

const test1ArrayBool = [true, true, false, true];
const test1ArrayUint32 = [4, 11]; // [size, elem1, elem2, ..., elemN]

const test2ArrayBool = [...Array(16).fill(true), ...Array(16).fill(false), ...Array(16).fill(true)]; //! Why 16?
const test2ArrayUint32 = [48, 65535, 65535];

const test3ArrayBool = [...Array(16).fill(true)];
const test3ArrayUint32 = [16, 65535];

const test4ArrayUint32 = [33, 65535]; // Wrong size (valid size 16-32)
const test5ArrayUint32 = [32, 65535]; // Wrong size (valid size 16-32)

test('convertBoolArrayToUint32Array', () => {
  expect(convertBoolArrayToUint32Array(test1ArrayBool)).toEqual(test1ArrayUint32);
  expect(convertBoolArrayToUint32Array(test2ArrayBool)).toEqual(test2ArrayUint32);
  expect(convertBoolArrayToUint32Array(test3ArrayBool)).toEqual(test3ArrayUint32);
});

test('convertUint32ArrayToBoolArray', () => {
  expect(convertUint32ArrayToBoolArray(test1ArrayUint32)).toEqual(test1ArrayBool);
  expect(convertUint32ArrayToBoolArray(test2ArrayUint32)).toEqual(test2ArrayBool);
  expect(convertUint32ArrayToBoolArray(test3ArrayUint32)).toEqual(test3ArrayBool);
  expect(() => convertUint32ArrayToBoolArray(test4ArrayUint32)).toThrowError();
  expect(() => convertUint32ArrayToBoolArray(test5ArrayUint32)).not.toThrowError();
});
