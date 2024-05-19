import { test, expect } from '@/test-utils';
import { toArrayOfBoolLegacy } from './convert_legacy';

const test1ArrayBool = new Uint8Array([1, 1, 0, 1]);
const test1ArrayUint32 = [4, 11]; // [size, elem1, elem2, ..., elemN]

const test2ArrayBool = Uint8Array.from([...Array(16).fill(1), ...Array(16).fill(0), ...Array(16).fill(1)]); //! Why 16?
const test2ArrayUint32 = [48, 65535, 65535];

const test3ArrayBool = new Uint8Array(16).fill(1);
const test3ArrayUint32 = [16, 65535];

const test4ArrayUint32 = [33, 65535]; // Wrong size (valid size 16-32)
const test5ArrayUint32 = [32, 65535];

test('toArrayOfBoolLegacy', () => {
  expect(toArrayOfBoolLegacy(test1ArrayUint32)).toEqual(test1ArrayBool);
  expect(toArrayOfBoolLegacy(test2ArrayUint32)).toEqual(test2ArrayBool);
  expect(toArrayOfBoolLegacy(test3ArrayUint32)).toEqual(test3ArrayBool);
  expect(() => toArrayOfBoolLegacy(test4ArrayUint32)).toThrowError();
  expect(() => toArrayOfBoolLegacy(test5ArrayUint32)).not.toThrowError();
});
