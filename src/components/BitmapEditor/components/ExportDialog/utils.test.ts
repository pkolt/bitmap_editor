import { describe, it, expect } from 'vitest';
import { exportBitmap, Platform, DataFormat, SizeFormat } from './utils';
import { BitOrder, type BitmapEntity } from '@/utils/bitmap/types';
import { Area } from '@/utils/bitmap/Area';

describe('BitmapEditor/ExportDialog/utils', () => {
  const mockBitmap: BitmapEntity = {
    id: 'test-id',
    name: 'test-name',
    width: 8,
    height: 8,
    // A simple pattern
    data: [0x18244281, 0x81422418],
    createdAt: 1,
    updatedAt: 1,
    favorite: false,
  };

  const expectedDataHex = '0x81, 0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x81';
  const expectedDataBin =
    '0b10000001, 0b01000010, 0b00100100, 0b00011000, 0b00011000, 0b00100100, 0b01000010, 0b10000001';

  describe('Arduino platform', () => {
    it('should export with Hex, comments size, and no progmem', () => {
      const result = exportBitmap({
        name: 'testBitmap',
        bitmapEntity: mockBitmap,
        bitOrder: BitOrder.LSB,
        platform: Platform.Arduino,
        dataFormat: DataFormat.Hex,
        sizeFormat: SizeFormat.Comments,
        progmem: false,
      });

      expect(result).toContain('// testbitmap.h');
      expect(result).toContain('const unsigned char testbitmap[]');
      expect(result).toContain('/* width: 8, height: 8 */');
      expect(result).not.toContain('PROGMEM');
      expect(result).not.toContain('#include');
      expect(result).toContain(expectedDataHex);
    });

    it('should export with Bin, variables size, and progmem', () => {
      const result = exportBitmap({
        name: 'testBitmap',
        bitmapEntity: mockBitmap,
        bitOrder: BitOrder.LSB,
        platform: Platform.Arduino,
        dataFormat: DataFormat.Bin,
        sizeFormat: SizeFormat.Variables,
        progmem: true,
      });

      expect(result).toContain('#include <avr/pgmspace.h>');
      expect(result).toContain('static const unsigned char PROGMEM testbitmap[]');
      expect(result).toContain('const unsigned char testbitmap_width = 8;');
      expect(result).toContain('const unsigned char testbitmap_height = 8;');
      expect(result).toContain(expectedDataBin);
    });
  });

  describe('Clang platform', () => {
    it('should export with Hex, defines size, and no progmem', () => {
      const result = exportBitmap({
        name: 'testBitmap',
        bitmapEntity: mockBitmap,
        bitOrder: BitOrder.LSB,
        platform: Platform.Clang,
        dataFormat: DataFormat.Hex,
        sizeFormat: SizeFormat.Defines,
        progmem: false,
      });

      expect(result).toContain('#include <stdint.h>');
      expect(result).not.toContain('PROGMEM');
      expect(result).toContain('const uint8_t testbitmap[]');
      expect(result).toContain('#define TESTBITMAP_WIDTH 8');
      expect(result).toContain('#define TESTBITMAP_HEIGHT 8');
      expect(result).toContain(expectedDataHex);
    });

    it('should export with progmem', () => {
      const result = exportBitmap({
        name: 'testBitmap',
        bitmapEntity: mockBitmap,
        bitOrder: BitOrder.LSB,
        platform: Platform.Clang,
        dataFormat: DataFormat.Hex,
        sizeFormat: SizeFormat.Defines,
        progmem: true,
      });

      expect(result).toContain('#include <stdint.h>');
      expect(result).toContain('#include <avr/pgmspace.h>');
      expect(result).toContain('const uint8_t PROGMEM testbitmap[]');
    });
  });

  describe('Pico platform', () => {
    it('should export for Pico platform', () => {
      const result = exportBitmap({
        name: 'testBitmap',
        bitmapEntity: mockBitmap,
        bitOrder: BitOrder.LSB,
        platform: Platform.Pico,
        dataFormat: DataFormat.Hex,
        sizeFormat: SizeFormat.Comments,
        progmem: false,
      });

      expect(result).toContain('// testbitmap.h');
      expect(result).toContain('#pragma once');
      expect(result).toContain('#include <stdint.h>');
      expect(result).toContain('#include "bitmap.h"');
      expect(result).toContain('const bitmap_t testbitmap = {');
      expect(result).toContain('.width = 8,');
      expect(result).toContain('.height = 8,');
      expect(result).toContain(`.data = (uint8_t[]){${expectedDataHex}}`);
    });
  });

  describe('General functionality', () => {
    it('should sanitize the bitmap name', () => {
      const result = exportBitmap({
        name: 'My Awesome Bitmap!',
        bitmapEntity: mockBitmap,
        bitOrder: BitOrder.LSB,
        platform: Platform.Arduino,
        dataFormat: DataFormat.Hex,
        sizeFormat: SizeFormat.Comments,
        progmem: false,
      });

      expect(result).toContain('// my_awesome_bitmap_.h');
      expect(result).toContain('const unsigned char my_awesome_bitmap_[]');
    });

    it('should export a specific area of the bitmap', () => {
      const largeBitmap: BitmapEntity = {
        id: 'large-test-id',
        name: 'large-test-name',
        width: 4,
        height: 4,
        data: [0x0660],
        createdAt: 1,
        updatedAt: 1,
        favorite: false,
      };
      const area = Area.fromRectangle(1, 1, 2, 2);

      const result = exportBitmap({
        name: 'areaTest',
        bitmapEntity: largeBitmap,
        bitOrder: BitOrder.MSB,
        platform: Platform.Clang,
        dataFormat: DataFormat.Hex,
        sizeFormat: SizeFormat.Comments,
        progmem: false,
        area,
      });

      // The extracted 2x2 bitmap ('11' from the first row, '11' from the second) gives the bit sequence '1111'.
      // With BitOrder.MSB, bits are packed from the most significant side of the byte.
      // This results in 0b11110000, which is 0xf0.
      const expectedAreaData = '0xf0';

      expect(result).toContain('/* width: 2, height: 2 */');
      expect(result).toContain(expectedAreaData);
      expect(result.match(/0x/g)?.length).toBe(1); // Only one byte of data
    });
  });
});
