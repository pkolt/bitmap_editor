import { Area } from '@/utils/bitmap/Area';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { XBitmapSerializer } from '@/utils/bitmap/XBitmapSerializer';
import { BitOrder, BitmapEntity } from '@/utils/bitmap/types';

export enum SizeFormat {
  Comments = 'comments',
  Variables = 'variables',
  Defines = 'defines',
}

export enum DataFormat {
  Hex = 'hex',
  Bin = 'bin',
}

export enum Platform {
  Arduino = 'arduino',
  Clang = 'clang',
}

interface ExportBitmapParams {
  name: string;
  bitOrder: BitOrder;
  bitmapEntity: BitmapEntity;
  dataFormat: DataFormat;
  platform: Platform;
  sizeFormat: SizeFormat;
  progmem: boolean;
  area?: Area;
}

export const exportBitmap = ({
  name,
  bitOrder,
  bitmapEntity,
  dataFormat,
  platform,
  sizeFormat,
  progmem,
  area,
}: ExportBitmapParams): string => {
  const srcBitmap = Bitmap.fromJSON(bitmapEntity);
  const bitmap = area ? srcBitmap.copy(area) : srcBitmap;
  const xBitMap = XBitmapSerializer.serialize(bitmap, bitOrder);
  const width = bitmap.width;
  const height = bitmap.height;

  const nameLower = name.replace(/[^\w]/gi, '_').toLowerCase();
  const nameUpper = nameLower.toUpperCase();
  const headerName = `${nameUpper}_H`;

  const dataArray = Array.from(xBitMap)
    .map((value) =>
      dataFormat === DataFormat.Hex ? `0x${value.toString(16)}` : `0b${value.toString(2).padStart(8, '0')}`,
    )
    .join(', ');

  const uint8 = platform === Platform.Arduino ? 'const unsigned char' : 'const uint8_t';
  const varType = platform === Platform.Arduino ? `static ${uint8}` : uint8;
  const progMem = progmem ? ' PROGMEM' : '';

  const includesBlock = [platform === Platform.Clang && '#include <stdint.h>', progmem && '#include <avr/pgmspace.h>']
    .filter(Boolean)
    .join('\n');

  const sizeBlock = [
    sizeFormat === SizeFormat.Comments && `/* width: ${width}, height: ${height} */`,
    sizeFormat === SizeFormat.Variables &&
      `${uint8} ${nameLower}_width = ${width};\n${uint8} ${nameLower}_height = ${height};`,
    sizeFormat === SizeFormat.Defines && `#define ${nameUpper}_WIDTH ${width}\n#define ${nameUpper}_HEIGHT ${height}`,
  ]
    .filter(Boolean)
    .join('\n');

  const output = `
// ${nameLower}.h
#ifndef ${headerName}
#define ${headerName}
${includesBlock}

${sizeBlock}

${varType}${progMem} ${nameLower}[] = { ${dataArray} };

#endif // ${headerName}
`
    .replace(/^\n/, '')
    .replace(/\n$/, '');
  return output;
};
