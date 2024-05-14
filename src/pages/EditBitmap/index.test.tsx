import EditBitmap from './';
import { test, renderPage, expect, screen } from '@/test-utils';
import { PageUrl } from '@/constants/urls';
import { generatePath } from 'react-router-dom';
import { bitmapEntity } from '@/test-utils/bitmaps';
import { vi } from 'vitest';

vi.mock('@/components/BitmapEditor/components/BitmapView/getCanvas');

const INVERT_BITMAP_DATA = [64, -252299728, 202116879];
const EMPTY_BITMAP_DATA = [64, 0, 0];

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
  expect(bitmap?.data).toEqual(EMPTY_BITMAP_DATA);
});

test('invert bitmap', async () => {
  const { userEvent, stores } = await setupTest();
  const invertButton = screen.getByText('Invert');
  expect(invertButton).toBeEnabled();
  await userEvent.click(invertButton);
  // Check invert
  const bitmap = stores.bitmaps.bitmaps.find((it) => it.id === bitmapEntity.id);
  expect(bitmap?.data).toEqual(INVERT_BITMAP_DATA);
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
  const clearInput = async () => {
    await userEvent.clear(inputRowSize);
    await userEvent.clear(inputColSize);
  };
  await clearInput();
  // Input invalid values
  await userEvent.type(inputRowSize, 'foo');
  await userEvent.type(inputColSize, '0');
  expect(screen.queryByText('Value must be a number')).not.toBeNull();
  expect(screen.queryByText('The value must be greater than zero')).not.toBeNull();
  // Clear and input valid values
  await clearInput();
  await userEvent.type(inputRowSize, `${rowSize}`);
  await userEvent.type(inputColSize, `${columnSize}`);
  const saveButton = screen.getByText('Save');
  expect(saveButton).toBeEnabled();
  await userEvent.click(saveButton);
  expect(stores.settings.grid).toMatchObject({ rowSize, columnSize });
});

test('resize bitmap', async () => {
  const width = 16;
  const height = 20;
  const { userEvent, stores } = await setupTest();
  const resizeButton = screen.getByText('Resize');
  expect(resizeButton).toBeEnabled();
  await userEvent.click(resizeButton);
  // Show resize dialog
  const inputWidth = screen.getByLabelText('Width');
  const inputHeight = screen.getByLabelText('Height');
  await userEvent.clear(inputWidth);
  await userEvent.clear(inputHeight);
  await userEvent.type(inputWidth, `${width}`);
  await userEvent.type(inputHeight, `${height}`);
  const applyButton = screen.getByText('Apply');
  await userEvent.click(applyButton);
  const bitmap = stores.bitmaps.bitmaps.find((it) => it.id === bitmapEntity.id);
  expect(bitmap).toMatchObject({ width, height, data: [320, 13172943, 983049, 15728880, 15925491, 0, 0, 0, 0, 0, 0] });
});

test('history undo/redo', async () => {
  const { userEvent, stores } = await setupTest();
  const getBitmapData = () => stores.bitmaps.bitmaps.find((it) => it.id === bitmapEntity.id)?.data;
  const invertButton = screen.getByText('Invert');
  const resetButton = screen.getByText('Reset');
  const undoButton = screen.getByText('Undo');
  const redoButton = screen.getByText('Redo');
  // Check default buttons state
  expect(undoButton).toBeDisabled();
  expect(redoButton).toBeDisabled();
  // Invert bitmap
  await userEvent.click(invertButton);
  expect(getBitmapData()).toEqual(INVERT_BITMAP_DATA);
  expect(undoButton).toBeEnabled();
  expect(redoButton).toBeDisabled();
  // Reset bitmap
  await userEvent.click(resetButton);
  expect(getBitmapData()).toEqual(EMPTY_BITMAP_DATA);
  expect(undoButton).toBeEnabled();
  expect(redoButton).toBeDisabled();
  // Undo reset
  await userEvent.click(undoButton);
  expect(getBitmapData()).toEqual(INVERT_BITMAP_DATA);
  expect(undoButton).toBeEnabled();
  expect(redoButton).toBeEnabled();
  // Undo invert
  await userEvent.click(undoButton);
  expect(getBitmapData()).toEqual(bitmapEntity.data);
  expect(undoButton).toBeDisabled();
  expect(redoButton).toBeEnabled();
  // Redo invert
  await userEvent.click(redoButton);
  expect(getBitmapData()).toEqual(INVERT_BITMAP_DATA);
  expect(undoButton).toBeEnabled();
  expect(redoButton).toBeEnabled();
  // Redo reset
  await userEvent.click(redoButton);
  expect(getBitmapData()).toEqual(EMPTY_BITMAP_DATA);
  expect(undoButton).toBeEnabled();
  expect(redoButton).toBeDisabled();
});
