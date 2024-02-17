import { BitmapEntity } from '@/types/bitmap';

interface BitmapFile {
  version: number;
  entities: BitmapEntity[];
}

const isBitmapFile = (value: unknown): value is BitmapFile => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    typeof value.version === 'number' &&
    'entities' in value &&
    Array.isArray(value.entities)
  );
};

export const convertToBitmapFile = (entities: BitmapEntity[]): Blob => {
  const jsonData = JSON.stringify({ version: 1, entities } satisfies BitmapFile);
  return new Blob([jsonData], { type: 'application/json' });
};

export const parseBitmapFile = (data: string): BitmapEntity[] => {
  let entities: BitmapEntity[] = [];
  try {
    const obj = JSON.parse(data);
    if (isBitmapFile(obj)) {
      entities = obj.entities;
    }
  } catch (err) {
    // skip error
  }
  return entities;
};
