import { BitmapEntity } from '@/types/bitmap';
import { Bitmap } from '@/utils/bitmap';

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
  entity: BitmapEntity;
  dataFormat: DataFormat;
  platform: Platform;
  sizeFormat: SizeFormat;
  progmem: boolean;
}

export const exportBitmap = ({
  name,
  entity,
  dataFormat,
  platform,
  sizeFormat,
  progmem,
}: ExportBitmapParams): string => {
  const { width, height, data } = entity;
  const bitmap = new Bitmap(width, height, data);
  const xBitMap = bitmap.toXBitMap();

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
