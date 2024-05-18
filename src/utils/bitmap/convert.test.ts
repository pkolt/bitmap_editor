import { test, expect } from '@/test-utils';
import { convertBoolArrayToNumberArray, convertNumberArrayToBoolArray } from './convert';

const test1ArrayBool = new Uint8Array([1, 1, 0, 1]);
const test1ArrayUint32 = [4, 11]; // [size, elem1, elem2, ..., elemN]

const test2ArrayBool = Uint8Array.from([...Array(16).fill(true), ...Array(16).fill(false), ...Array(16).fill(true)]); //! Why 16?
const test2ArrayUint32 = [48, 65535, 65535];

const test3ArrayBool = new Uint8Array(16).fill(1);
const test3ArrayUint32 = [16, 65535];

const test4ArrayUint32 = [33, 65535]; // Wrong size (valid size 16-32)
const test5ArrayUint32 = [32, 65535];

test('convertBoolArrayToUint32Array', () => {
  expect(convertBoolArrayToNumberArray(test1ArrayBool)).toEqual(test1ArrayUint32);
  expect(convertBoolArrayToNumberArray(test2ArrayBool)).toEqual(test2ArrayUint32);
  expect(convertBoolArrayToNumberArray(test3ArrayBool)).toEqual(test3ArrayUint32);
});

test('convertUint32ArrayToBoolArray', () => {
  expect(convertNumberArrayToBoolArray(test1ArrayUint32)).toEqual(test1ArrayBool);
  expect(convertNumberArrayToBoolArray(test2ArrayUint32)).toEqual(test2ArrayBool);
  expect(convertNumberArrayToBoolArray(test3ArrayUint32)).toEqual(test3ArrayBool);
  expect(() => convertNumberArrayToBoolArray(test4ArrayUint32)).toThrowError();
  expect(() => convertNumberArrayToBoolArray(test5ArrayUint32)).not.toThrowError();
});
