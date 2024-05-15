import { test, expect } from '@/test-utils';
import { isBitmapFile, convertToBitmapFile, parseBitmapFile } from './file';
import { bitmapEntity } from '@/test-utils/bitmaps';

test('isBitmapFile', () => {
  expect(isBitmapFile({ version: 1, entities: [] })).toBeTruthy();
  expect(isBitmapFile({})).toBeFalsy();
});

test('convertToBitmapFile', async () => {
  const blob = convertToBitmapFile([]);
  const text = await blob.text();
  expect(JSON.parse(text)).toMatchObject({ version: 1, entities: [] });
});

test('parseBitmapFile', () => {
  expect(parseBitmapFile(JSON.stringify({ version: 1, entities: [bitmapEntity] }))).toEqual([bitmapEntity]);
  expect(parseBitmapFile('')).toEqual([]);
});
