import ImportFromCollections from './';
import { test, renderPage, expect, screen, server, http, HttpResponse } from '@/test-utils';
import { PageUrl } from '@/constants/urls';
import { ICONS_DATA_URL, ICONS_DIR_URL } from './constants';

const icons = ['apple.svg', 'google.svg'];

const renderImportFromCollectionsPage = () =>
  renderPage(<ImportFromCollections />, { route: { path: PageUrl.ImportFromCollections } });

const setupServerHandler = (data: string[]) => {
  server.use(
    http.get(ICONS_DATA_URL, () => {
      return HttpResponse.json(data);
    }),
  );
};

test('show empty', () => {
  setupServerHandler([]);
  renderImportFromCollectionsPage();
  const items = screen.queryAllByTestId('item');
  expect(items.length).toBe(0);
});

test('search', async () => {
  setupServerHandler(icons);
  const { userEvent } = renderImportFromCollectionsPage();
  const items = await screen.findAllByTestId('item');
  expect(items.length).toBe(2);
  const search = screen.getByPlaceholderText('Search');
  await userEvent.type(search, 'apple');
  const filteredItems = screen.queryAllByTestId('item');
  expect(filteredItems.length).toBe(1);
});

test('navigate', async () => {
  setupServerHandler(icons);
  const { userEvent, router } = renderImportFromCollectionsPage();
  await screen.findAllByTestId('item'); // wait loaded list
  const iconButton = screen.getByLabelText('apple');
  await userEvent.click(iconButton);
  expect(router.location.pathname).toBe(PageUrl.ImportFromImage);
  expect(router.location.state).toMatchObject({ imageUrl: `${ICONS_DIR_URL}apple.svg` });
});
