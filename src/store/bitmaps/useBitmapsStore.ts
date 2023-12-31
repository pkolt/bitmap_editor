import { BitmapEntity } from '@/types/bitmap';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BitmapsStore {
  bitmaps: BitmapEntity[];
  findBitmap: (id: string) => BitmapEntity | undefined;
  addBitmap: (bitmap: BitmapEntity) => void;
  changeBitmap: (bitmap: BitmapEntity) => void;
  deleteBitmap: (id: string) => void;
}

export const useBitmapStore = create(
  persist<BitmapsStore>(
    (set, get) => ({
      bitmaps: [],
      findBitmap: (id: string) => get().bitmaps.find((it) => it.id === id),
      addBitmap: (bitmap) => set(() => ({ bitmaps: [...get().bitmaps, bitmap] })),
      changeBitmap: (bitmap) =>
        set(() => ({ bitmaps: get().bitmaps.map((it) => (it.id === bitmap.id ? bitmap : it)) })),
      deleteBitmap: (id) => set(() => ({ bitmaps: get().bitmaps.filter((it) => it.id !== id) })),
    }),
    {
      name: 'bitmaps',
    },
  ),
);
