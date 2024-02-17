import { BitmapEntity } from '@/types/bitmap';

export const convertToBitmapFile = (entities: BitmapEntity[]): Blob => {
  const jsonData = JSON.stringify({ version: 1, entities });
  return new Blob([jsonData], { type: 'application/json' });
};
