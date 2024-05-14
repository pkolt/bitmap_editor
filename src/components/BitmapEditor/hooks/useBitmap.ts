import { useBitmapsStore } from '@/stores/bitmaps';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { requiredValue } from '@/utils/requiredValue';
import { useCallback, useState } from 'react';

export type UpdateBitmapFn = (bitmap: Bitmap, skipSaveInStore?: boolean) => void;

export const useBitmap = (bitmapId: string) => {
  const { findBitmap, changeBitmap } = useBitmapsStore();
  const bitmapEntity = requiredValue(findBitmap(bitmapId));
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
