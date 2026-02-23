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
  Pico = 'pico',
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

interface PlatformExportParams {
  nameLower: string;
  nameUpper: string;
  width: number;
  height: number;
  dataArray: string;
  sizeFormat: SizeFormat;
  progmem: boolean;
}

const exportForArduino = ({
  nameLower,
  nameUpper,
  width,
  height,
  dataArray,
  sizeFormat,
  progmem,
}: PlatformExportParams): string => {
  const headerName = `${nameUpper}_H`;
  const uint8 = 'const unsigned char';
  const varType = `static ${uint8}`;
  const progMem = progmem ? ' PROGMEM' : '';

  const includesBlock = progmem ? '#include <avr/pgmspace.h>' : '';

  const sizeBlock = [
    sizeFormat === SizeFormat.Comments && `/* width: ${width}, height: ${height} */`,
    sizeFormat === SizeFormat.Variables &&
      `${uint8} ${nameLower}_width = ${width};\n${uint8} ${nameLower}_height = ${height};`,
    sizeFormat === SizeFormat.Defines && `#define ${nameUpper}_WIDTH ${width}\n#define ${nameUpper}_HEIGHT ${height}`,
  ]
    .filter(Boolean)
    .join('\n');

  return `
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
};

const exportForClang = ({
  nameLower,
  nameUpper,
  width,
  height,
  dataArray,
  sizeFormat,
  progmem,
}: PlatformExportParams): string => {
  const headerName = `${nameUpper}_H`;
  const uint8 = 'const uint8_t';
  const varType = uint8;
  const progMem = progmem ? ' PROGMEM' : '';

  const includesBlock = ['#include <stdint.h>', progmem && '#include <avr/pgmspace.h>'].filter(Boolean).join('\n');

  const sizeBlock = [
    sizeFormat === SizeFormat.Comments && `/* width: ${width}, height: ${height} */`,
    sizeFormat === SizeFormat.Variables &&
      `${uint8} ${nameLower}_width = ${width};\n${uint8} ${nameLower}_height = ${height};`,
    sizeFormat === SizeFormat.Defines && `#define ${nameUpper}_WIDTH ${width}\n#define ${nameUpper}_HEIGHT ${height}`,
  ]
    .filter(Boolean)
    .join('\n');

  return `
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
};

const exportForPico = ({ nameLower, width, height, dataArray }: PlatformExportParams): string => {
  const includesBlock = ['#include <stdint.h>', '#include "bitmap.h"'].filter(Boolean).join('\n');
  return `
// ${nameLower}.h
#pragma once

${includesBlock}

const bitmap_t ${nameLower} = {
  .width = ${width},
  .height = ${height},
  .data = (uint8_t[]){${dataArray}}
};
`
    .replace(/^\n/, '')
    .replace(/\n$/, '');
};

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
  const { width, height } = bitmap;

  const nameLower = name.replace(/[^\w]/gi, '_').toLowerCase();
  const nameUpper = nameLower.toUpperCase();

  const dataArray = Array.from(xBitMap)
    .map((value) =>
      dataFormat === DataFormat.Hex ? `0x${value.toString(16)}` : `0b${value.toString(2).padStart(8, '0')}`,
    )
    .join(', ');

  const params: PlatformExportParams = {
    nameLower,
    nameUpper,
    width,
    height,
    dataArray,
    sizeFormat,
    progmem,
  };

  switch (platform) {
    case Platform.Arduino:
      return exportForArduino(params);
    case Platform.Clang:
      return exportForClang(params);
    case Platform.Pico:
      return exportForPico(params);
    default:
      // Should not be reachable
      return '';
  }
};
