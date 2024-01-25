import { BitmapEntity } from '@/types/bitmap';
import { Bitmap } from '@/utils/bitmap';

export const bitmapToProgramCode = (entity: BitmapEntity): string => {
  const bitmap = new Bitmap(entity.width, entity.height, entity.data ? new Uint32Array(entity.data) : undefined);
  const ssd1306Format = bitmap.toSSD1306();

  const name = entity.name.replace(/\s/g, '_').toLowerCase();
  const headerName = `${name.toUpperCase()}_H`;

  const sizes = `0x${entity.width.toString()} /* width */, 0x${entity.height.toString()} /* height */`;
  const uint8Array = Array.from(ssd1306Format)
    .map((value) => `0x${value.toString(16)}`)
    .join(', ');
  const bitmapCode = `const uint8_t ${name}[${ssd1306Format.length}] PROGMEM = { ${sizes}, ${uint8Array} };`;

  const output = `
// ${name}.h (${entity.width}x${entity.height})
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
