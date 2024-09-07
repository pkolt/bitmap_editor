import { DEFAULT_FILE_VERSION } from './constants';
import { reverseBits, toArrayOfNumber } from './convert';
import { toArrayOfBoolLegacy } from './convert_legacy';
import { BitmapEntity } from './types';

interface BitmapFile {
  version: number;
  entities: BitmapEntity[];
}

/** @internal */
export const isBitmapFile = (value: unknown): value is BitmapFile => {
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
  const jsonData = JSON.stringify({ version: DEFAULT_FILE_VERSION, entities } satisfies BitmapFile);
  return new Blob([jsonData], { type: 'application/json' });
};

export const parseBitmapFile = (data: string): BitmapEntity[] => {
  let entities: BitmapEntity[] = [];
  try {
    const obj = JSON.parse(data);
    if (isBitmapFile(obj)) {
      entities = obj.entities;
      if (obj.version <= 1) {
        entities = entities.map((it) => ({
          ...it,
          data: toArrayOfNumber(toArrayOfBoolLegacy(it.data)),
        }));
      }
      if (obj.version <= 2) {
        entities = entities.map((it) => ({
          ...it,
          data: it.data.map(reverseBits),
        }));
      }
    }
  } catch {
    // skip error
  }
  return entities;
};
