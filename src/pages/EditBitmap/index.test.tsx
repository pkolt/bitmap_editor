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
