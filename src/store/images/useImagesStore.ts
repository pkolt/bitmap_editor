import { ImageEntity } from '@/types/image';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ImagesStore {
  images: ImageEntity[];
  findImage: (id: string) => ImageEntity | undefined;
  addImage: (data: ImageEntity) => void;
  removeImage: (id: string) => void;
}

export const useImageStore = create(
  persist<ImagesStore>(
    (set, get) => ({
      images: [],
      findImage: (id: string) => get().images.find((it) => it.id === id),
      addImage: (data) => set(() => ({ images: [...get().images, data] })),
      removeImage: (id) => set(() => ({ images: get().images.filter((it) => it.id !== id) })),
    }),
    {
      name: 'images',
    },
  ),
);
