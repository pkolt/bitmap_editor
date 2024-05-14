import EditBitmap from './';
import { test, renderPage, expect, screen } from '@/test-utils';
import { PageUrl } from '@/constants/urls';
import { generatePath } from 'react-router-dom';
import { bitmapEntity } from '@/test-utils/bitmaps';
import { vi } from 'vitest';

vi.mock('@/components/BitmapEditor/components/BitmapView/getCanvas');

const url = generatePath(PageUrl.EditBitmap, { id: bitmapEntity.id });

const renderEditBitmapPage = () => renderPage(<EditBitmap />, { route: { path: PageUrl.EditBitmap } });

const setupTest = async () => {
  const renderResult = renderEditBitmapPage();
  const { stores, router } = renderResult;
  stores.bitmaps.addBitmap(bitmapEntity);
  await router.navigate(url);
  return renderResult;
};

test('rename bitmap', async () => {
  const { userEvent, stores } = await setupTest();
  const bitmapName = 'Rename bitmap';
  const renameButton = screen.getByText('Rename');
  expect(renameButton).toBeEnabled();
  await userEvent.click(renameButton);
  // Show rename dialog
  const inputName = screen.getByLabelText('Name:');
  const saveButton = screen.getByText('Save');
  await userEvent.clear(inputName);
  await userEvent.type(inputName, bitmapName);
  expect(saveButton).toBeEnabled();
  await userEvent.click(saveButton);
  // Check renaming
  const bitmap = stores.bitmaps.bitmaps.find((it) => it.name === bitmapName);
  expect(bitmap).toMatchObject({ id: bitmapEntity.id, name: bitmapName });
});

test('reset bitmap', async () => {
  const { userEvent, stores } = await setupTest();
  const resetButton = screen.getByText('Reset');
  expect(resetButton).toBeEnabled();
  await userEvent.click(resetButton);
  // Check reset
  const bitmap = stores.bitmaps.bitmaps.find((it) => it.id === bitmapEntity.id);
  expect(bitmap?.data).toEqual([64, 0, 0]);
});

test('invert bitmap', async () => {
  const { userEvent, stores } = await setupTest();
  const invertButton = screen.getByText('Invert');
  expect(invertButton).toBeEnabled();
  await userEvent.click(invertButton);
  // Check invert
  const bitmap = stores.bitmaps.bitmaps.find((it) => it.id === bitmapEntity.id);
  expect(bitmap?.data).toEqual([64, -252299728, 202116879]);
});

const exportCode = `\
// sun.h
#ifndef SUN_H
#define SUN_H
#include <stdint.h>

const uint8_t sun_width = 8;
const uint8_t sun_height = 8;

const uint8_t sun[] = { 0b11110011, 0b10010011, 0b10010000, 0b11110000, 0b00001111, 0b00001111, 0b11001111, 0b11001111 };

#endif // SUN_H`;

test('export bitmap', async () => {
  const { userEvent } = await setupTest();
  const exportButton = screen.getByText('Export to C');
  expect(exportButton).toBeEnabled();
  await userEvent.click(exportButton);
  // Show export dialog
  const inputName = screen.getByLabelText('Name:');
  await userEvent.clear(inputName);
  await userEvent.type(inputName, 'Sun');
  await userEvent.click(screen.getByLabelText('Little-endian (Adafruit)'));
  await userEvent.click(screen.getByLabelText('Bin'));
  await userEvent.click(screen.getByLabelText('Variables'));
  await userEvent.click(screen.getByLabelText('C language'));
  await userEvent.click(screen.getByLabelText('Include PROGMEM (AVR)'));
  const copyButton = screen.getByText('Copy to clipboard');
  const spy = vi.spyOn(navigator.clipboard, 'writeText');
  await userEvent.click(copyButton);
  expect(spy).toHaveBeenCalledWith(exportCode);
});

test('grid settings', async () => {
  const { userEvent, stores } = await setupTest();
  const gridButton = screen.getByText('Grid');
  expect(gridButton).toBeEnabled();
  await userEvent.click(gridButton);
  // Show grid settings dialog
  const rowSize = 10;
  const columnSize = 16;
  const inputRowSize = screen.getByLabelText('Row size:');
  const inputColSize = screen.getByLabelText('Column size:');
  await userEvent.clear(inputRowSize);
  await userEvent.type(inputRowSize, `${rowSize}`);
  await userEvent.clear(inputColSize);
  await userEvent.type(inputColSize, `${columnSize}`);
  const saveButton = screen.getByText('Save');
  expect(saveButton).toBeEnabled();
  await userEvent.click(saveButton);
  expect(stores.settings.grid).toMatchObject({ rowSize, columnSize });
});
