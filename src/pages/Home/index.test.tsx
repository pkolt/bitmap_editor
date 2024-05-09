import { test, renderPage, expect, screen } from '@/test-utils';
import Home from './';
import { PageUrl } from '@/constants/urls';

const renderHomePage = () => renderPage(<Home />, { route: { path: PageUrl.Home } });

test('show empty', async () => {
  const { location } = renderHomePage();
  expect(screen.queryAllByTestId('bitmap-item').length).toBe(0);
  expect(location().pathname).toBe(PageUrl.Home);
});

test('click create new bitmap', async () => {
  const { location, user } = renderHomePage();
  const button = screen.getByText('Create new bitmap');
  await user.click(button);
  expect(location().pathname).toBe(PageUrl.CreateBitmap);
});

test('click import from image', async () => {
  const { location, user } = renderHomePage();
  const button = screen.getByText('Import from image');
  await user.click(button);
  expect(location().pathname).toBe(PageUrl.ImportFromImage);
});

test('click import from json', async () => {
  const { location, user } = renderHomePage();
  const button = screen.getByText('Import from JSON');
  await user.click(button);
  expect(location().pathname).toBe(PageUrl.ImportFromJson);
});
