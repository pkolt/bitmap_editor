import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useCallback, useState } from 'react';

export type UpdateBitmapFn = (bitmap: Bitmap, skipSaveInStore?: boolean) => void;

export const useBitmap = (bitmapId: string) => {
  const { findBitmap, changeBitmap } = useBitmapStore();

  const bitmapEntity = findBitmap(bitmapId);
  if (!bitmapEntity) {
    throw Error(`Not found bitmap with id: ${bitmapId}`);
  }

  const [bitmap, setBitmap] = useState(Bitmap.fromJSON(bitmapEntity));

  const updateBitmap: UpdateBitmapFn = useCallback(
    (value, skipSaveInStore) => {
      setBitmap(value.clone());
      if (!skipSaveInStore) {
        changeBitmap(bitmapId, value.toJSON());
      }
    },
    [bitmapId, changeBitmap],
  );

  return { bitmapEntity, bitmap, updateBitmap };
};
