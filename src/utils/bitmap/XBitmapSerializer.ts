import { Bitmap } from './Bitmap';
import { UINT8_BITS } from './constants';
import { BitOrder } from './types';

export class XBitmapSerializer {
  static serialize(bitmap: Bitmap, bitOrder: BitOrder): Uint8Array {
    const result = new Uint8Array(Math.ceil(bitmap.data.pixelCount / UINT8_BITS));
    for (let dstIndex = 0; dstIndex < result.length; dstIndex++) {
      for (let bit = 0; bit < UINT8_BITS; bit++) {
        const srcIndex = dstIndex * UINT8_BITS + bit;
        if (bitmap.getPixelValue(srcIndex)) {
          const resBit = bitOrder === BitOrder.BigEndian ? bit : UINT8_BITS - 1 - bit;
          result[dstIndex] |= 1 << resBit;
        }
      }
    }
    return result;
  }
}
