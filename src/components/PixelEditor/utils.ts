import { ImageEntity } from '@/types/image';
import { Bitmap } from '@/utils/bitmap';

export const imageToProgramCode = (image: ImageEntity): string => {
  const bitmap = new Bitmap(image.width, image.height, image.data);
  const data = bitmap.toSSD1306();
  const commentCode = `// ${image.name} (${bitmap.width}x${bitmap.height})`;
  const imgCode = `const uint8_t data[${data.length}] PROGMEM = {${Array.from(data).map((value) => `0x${value.toString(16)}`).join(', ')}};`;
  return `${commentCode}\n${imgCode}`;
};
