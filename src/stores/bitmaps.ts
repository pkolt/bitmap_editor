import { reverseBits, toArrayOfNumber } from '@/utils/bitmap/convert';
import { toArrayOfBoolLegacy } from '@/utils/bitmap/convert_legacy';
import { BitmapEntity } from '@/utils/bitmap/types';
import { DateTime } from 'luxon';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BitmapsState {
  bitmaps: BitmapEntity[];
  findBitmap: (id: string) => BitmapEntity | undefined;
  addBitmap: (bitmap: BitmapEntity) => void;
  changeBitmap: (id: string, bitmap: Partial<BitmapEntity>) => void;
  deleteBitmap: (id: string) => void;
}

const defaultBitmaps: BitmapEntity[] = [];

export const useBitmapsStore = create<BitmapsState>()(
  persist(
    (set, get) => ({
      bitmaps: defaultBitmaps,
      findBitmap: (id: string) => get().bitmaps.find((it) => it.id === id),
      addBitmap: (bitmap) => set(() => ({ bitmaps: [...get().bitmaps, bitmap] })),
      changeBitmap: (id, bitmap) =>
        set(() => {
          const bitmaps = get().bitmaps.map((it) => {
            if (it.id === id) {
              const updatedAt = DateTime.now().toMillis();
              return { ...it, ...bitmap, updatedAt };
            }
            return it;
          });
          return { bitmaps };
        }),
      deleteBitmap: (id) => set(() => ({ bitmaps: get().bitmaps.filter((it) => it.id !== id) })),
    }),
    {
      name: 'bitmaps',
      version: 5, // a migration will be triggered if the version in the storage mismatches this one
      migrate: (persistedState, version) => {
        if (version === 1) {
          // if the stored value is in version 0, we convert data
          // ...
          const persistedStateV1 = persistedState as BitmapsState;
          return {
            ...persistedStateV1,
            bitmaps: persistedStateV1.bitmaps.map((it) => ({
              ...it,
              data: it.data.length > 0 ? [it.width * it.height, ...it.data] : it.data,
            })),
          };
        }

        if (version === 2) {
          const persistedStateV2 = persistedState as BitmapsState;
          return {
            ...persistedStateV2,
            bitmaps: persistedStateV2.bitmaps.map((it) => ({
              ...it,
              data: toArrayOfNumber(toArrayOfBoolLegacy(it.data)),
            })),
          };
        }

        if (version === 3) {
          type BitmapEntityV3 = Omit<BitmapEntity, 'favorite'>;
          const persistedStateV3 = persistedState as Omit<BitmapsState, 'bitmaps'> & { bitmaps: BitmapEntityV3[] };
          return {
            ...persistedStateV3,
            bitmaps: persistedStateV3.bitmaps.map((it) => ({
              ...it,
              favorite: false,
            })),
          };
        }

        if (version === 4) {
          const persistedStateV4 = persistedState as BitmapsState;
          return {
            ...persistedStateV4,
            bitmaps: persistedStateV4.bitmaps.map((it) => ({
              ...it,
              data: it.data.map(reverseBits),
            })),
          };
        }

        return persistedState as BitmapsState;
      },
    },
  ),
);
