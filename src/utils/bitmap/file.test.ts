import { test, expect } from '@/test-utils';
import { isBitmapFile, convertToBitmapFile, parseBitmapFile } from './file';
import { bitmapEntity } from '@/test-utils/bitmaps';
import { DEFAULT_FILE_VERSION } from './constants';

test('isBitmapFile', () => {
  expect(isBitmapFile({ version: DEFAULT_FILE_VERSION, entities: [] })).toBeTruthy();
  expect(isBitmapFile({})).toBeFalsy();
});

test('convertToBitmapFile', async () => {
  const blob = convertToBitmapFile([]);
  const text = await blob.text();
  expect(JSON.parse(text)).toMatchObject({ version: DEFAULT_FILE_VERSION, entities: [] });
});

test('parseBitmapFile', () => {
  expect(parseBitmapFile(JSON.stringify({ version: DEFAULT_FILE_VERSION, entities: [bitmapEntity] }))).toEqual([
    bitmapEntity,
  ]);
  expect(parseBitmapFile('')).toEqual([]);
});
