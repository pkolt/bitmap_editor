import { PIXELS_PER_COLUMN } from '@/constants/image';
import { ImageEntity, ImageEntityData } from '@/types/image';
import { setBit } from '@/utils/bitwise';

export const getImageDataLength = (width: number, height: number): number => {
  return width * height;
};

export const createImageData = (width: number, height: number): ImageEntityData => {
  const length = getImageDataLength(width, height);
  return new Array(length).fill(false);
};

export const convertToSSD1306 = (image: ImageEntity): number[] => {
  const width = image.width;
  const height = image.height;
  const data = image.data;
  const result: number[] = (new Array(width * height / PIXELS_PER_COLUMN)).fill(0);

  for (let page = 0; page < height / PIXELS_PER_COLUMN; page++) {
    for (let column = 0; column < width; column++) {
      const dstIndex = column + page * width;
      for (let bit = 0; bit < PIXELS_PER_COLUMN; bit++) {
        const srcIndex = bit * width + (width * PIXELS_PER_COLUMN * page) + column;
        if (data[srcIndex]) {
          result[dstIndex] = setBit(result[dstIndex], bit);
        }
      }
    }
  }
  return result;
};

export const imageToProgramCode = (image: ImageEntity): string => {
  const ssd1306Data = convertToSSD1306(image);
  const commentCode = `// ${image.name} (${image.width}x${image.height})`;
  const imgCode = `const uint8_t data[${ssd1306Data.length}] = {${ssd1306Data.map((value) => `0x${value.toString(16)}`).join(', ')}};`;
  return `${commentCode}\n${imgCode}`;
};
