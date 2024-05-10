import Home from './';
import { test, renderPage, expect, screen } from '@/test-utils';
import { PageUrl } from '@/constants/urls';
import { bitmapEntity } from '@/test-utils/bitmaps';

const renderHomePage = () => renderPage(<Home />, { route: { path: PageUrl.Home } });

const createTestRedirect = (buttonText: string, redirectUrl: PageUrl) => async () => {
  const { router, userEvent } = renderHomePage();
  const button = screen.getByText(buttonText);
  await userEvent.click(button);
  expect(router.location.pathname).toBe(redirectUrl);
};

test('show empty', async () => {
  const { router } = renderHomePage();
  expect(screen.queryAllByTestId('bitmap-item').length).toBe(0);
  expect(router.location.pathname).toBe(PageUrl.Home);
});

test('click create new bitmap', createTestRedirect('Create new bitmap', PageUrl.CreateBitmap));

test('click import from image', createTestRedirect('Import from image', PageUrl.ImportFromImage));

test('click import from json', createTestRedirect('Import from JSON', PageUrl.ImportFromJson));

test('show list', () => {
  const { stores } = renderHomePage();
  stores.bitmaps.addBitmap(bitmapEntity);
  expect(screen.queryByText(bitmapEntity.name)).not.toBeNull();
  expect(screen.queryAllByTestId('bitmap-item').length).toBe(1);
});
