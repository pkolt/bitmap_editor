import { test, expect } from '@/test-utils';
import { bitmapEntity } from '@/test-utils/bitmaps';
import { Bitmap } from './Bitmap';
import { BitmapData } from './BitmapData';
import { BitOrder } from './types';
import { XBitmapSerializer } from './XBitmapSerializer';

const array = new Uint32Array(bitmapEntity.data);
const bitmap = new Bitmap(new BitmapData(8, 8, array));

test('serialize (BE)', () => {
  const arr = XBitmapSerializer.serialize(bitmap, BitOrder.LSB);
  expect(arr).toEqual(new Uint8Array([207, 201, 9, 15, 240, 240, 243, 243]));
});

test('serialize (LE)', () => {
  const arr = XBitmapSerializer.serialize(bitmap, BitOrder.MSB);
  expect(arr).toEqual(new Uint8Array([243, 147, 144, 240, 15, 15, 207, 207]));
});
