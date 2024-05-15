import CreateBitmap from './';
import { test, renderPage, expect, screen } from '@/test-utils';
import { PageUrl } from '@/constants/urls';
import { matchPath } from 'react-router-dom';

const renderCreateBitmapPage = () => renderPage(<CreateBitmap />, { route: { path: PageUrl.CreateBitmap } });

test('create bitmap', async () => {
  const name = 'My bitmap';
  const width = 24;
  const height = 32;

  const { userEvent, router, stores } = renderCreateBitmapPage();
  const inputName = screen.getByLabelText('Name:');
  const inputWidth = screen.getByLabelText('Width:');
  const inputHeight = screen.getByLabelText('Height:');
  const submitButton: HTMLButtonElement = screen.getByText('Save');

  await userEvent.type(inputName, name);

  await userEvent.clear(inputWidth);
  await userEvent.type(inputWidth, `${width}`);

  await userEvent.clear(inputHeight);
  await userEvent.type(inputHeight, `${height}`);

  expect(submitButton).toBeEnabled();
  await userEvent.click(submitButton);

  const bitmapId = matchPath(PageUrl.EditBitmap, router.location.pathname)?.params.id;
  expect(bitmapId).toBeDefined();
  const bitmap = stores.bitmaps.bitmaps.find((it) => it.id === bitmapId);
  expect(bitmap).toBeDefined();
  expect(bitmap).toMatchObject({ name, width, height });
});
