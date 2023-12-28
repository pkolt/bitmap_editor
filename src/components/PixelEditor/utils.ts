import { ImageEntity } from '@/types/image';
import { Bitmap } from '@/utils/bitmap';

export const imageToProgramCode = (image: ImageEntity): string => {
  const bitmap = new Bitmap(image.width, image.height, image.data ? new Uint32Array(image.data) : undefined);
  const ssd1306Format = bitmap.toSSD1306();

  const name = image.name.replace(/\s/g, '_').toLowerCase();
  const headerName = `${name.toUpperCase()}_H`;

  const sizes = `0x${image.width.toString()} /* width */, 0x${image.height.toString()} /* height */`;
  const uint8Array = Array.from(ssd1306Format)
    .map((value) => `0x${value.toString(16)}`)
    .join(', ');
  const bitmapCode = `const uint8_t ${name}[${ssd1306Format.length}] PROGMEM = { ${sizes}, ${uint8Array} };`;

  const output = `
// ${name}.h (${image.width}x${image.height})
#ifndef ${headerName}
#define ${headerName}
#include <stdint.h>
#include <avr/pgmspace.h>

${bitmapCode}

#endif // ${headerName}
`
    .replace(/^\n/, '')
    .replace(/\n$/, '');
  return output;
};
