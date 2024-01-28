import { BitmapEntity } from '@/types/bitmap';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BitmapsState {
  bitmaps: BitmapEntity[];
  findBitmap: (id: string) => BitmapEntity | undefined;
  addBitmap: (bitmap: BitmapEntity) => void;
  changeBitmap: (id: string, bitmap: Partial<BitmapEntity>) => void;
  deleteBitmap: (id: string) => void;
}

export const useBitmapStore = create<BitmapsState>()(
  persist(
    (set, get) => ({
      bitmaps: [],
      findBitmap: (id: string) => get().bitmaps.find((it) => it.id === id),
      addBitmap: (bitmap) => set(() => ({ bitmaps: [...get().bitmaps, bitmap] })),
      changeBitmap: (id, bitmap) =>
        set(() => {
          const bitmaps = get().bitmaps.map((it) => {
            if (it.id === id) {
              return { ...it, ...bitmap };
            }
            return it;
          });
          return { bitmaps };
        }),
      deleteBitmap: (id) => set(() => ({ bitmaps: get().bitmaps.filter((it) => it.id !== id) })),
    }),
    {
      name: 'bitmaps',
      version: 1, // a migration will be triggered if the version in the storage mismatches this one
      migrate: (persistedState, version) => {
        if (version === 0) {
          // if the stored value is in version 0, we convert data
          // ...
        }
        return persistedState as BitmapsState;
      },
    },
  ),
);
