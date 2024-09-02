import Home from './';
import { test, renderPage, expect, screen, vi } from '@/test-utils';
import { PageUrl } from '@/constants/urls';
import { bitmapEntity } from '@/test-utils/bitmaps';
import FileSaver from 'file-saver';
import { generatePath } from 'react-router-dom';
import { SortValue } from '@/stores/settings';
import { DateTime } from 'luxon';

const BITMAP_ITEM_ID = 'bitmap-item';
const BITMAP_ITEM_TITLE_ID = 'bitmap-item-title';

const renderHomePage = () => renderPage(<Home />, { route: { path: PageUrl.Home } });

interface TestRedirectParams {
  buttonText: string;
  dropdownText?: string;
  redirectUrl: PageUrl;
}

const createTestRedirect =
  ({ buttonText, dropdownText, redirectUrl }: TestRedirectParams) =>
  async () => {
    const { router, userEvent } = renderHomePage();
    if (dropdownText) {
      const dropdown = screen.getByText(dropdownText);
      await userEvent.click(dropdown);
    }
    const button = screen.getByText(buttonText);
    await userEvent.click(button);
    expect(router.location.pathname).toBe(redirectUrl);
  };

test('show empty', async () => {
  const { router } = renderHomePage();
  expect(screen.queryAllByTestId(BITMAP_ITEM_ID).length).toBe(0);
  expect(router.location.pathname).toBe(PageUrl.Home);
});

test('click create new bitmap', createTestRedirect({ buttonText: 'Create', redirectUrl: PageUrl.CreateBitmap }));

test(
  'click import from image',
  createTestRedirect({ buttonText: 'From image', dropdownText: 'Import', redirectUrl: PageUrl.ImportFromImage }),
);

test(
  'click import from json',
  createTestRedirect({ buttonText: 'From JSON', dropdownText: 'Import', redirectUrl: PageUrl.ImportFromJson }),
);

test(
  'click import from collections',
  createTestRedirect({
    buttonText: 'From collections',
    dropdownText: 'Import',
    redirectUrl: PageUrl.ImportFromCollections,
  }),
);

test('show list', () => {
  const { stores } = renderHomePage();
  stores.bitmaps.addBitmap(bitmapEntity);
  expect(screen.queryByText(bitmapEntity.name)).not.toBeNull();
  expect(screen.queryAllByTestId(BITMAP_ITEM_ID).length).toBe(1);
});

test('delete bitmap', async () => {
  const { stores, userEvent } = renderHomePage();
  stores.bitmaps.addBitmap(bitmapEntity);
  const deleteButton = screen.getByTitle('Delete bitmap');
  await userEvent.click(deleteButton);
  // Show dialog
  const acceptButton = screen.getByText('Accept');
  await userEvent.click(acceptButton);
  expect(screen.queryAllByTestId(BITMAP_ITEM_ID).length).toBe(0);
});

test('export bitmap', async () => {
  const spy = vi.spyOn(FileSaver, 'saveAs');
  const { stores, userEvent } = renderHomePage();
  stores.bitmaps.addBitmap({ ...bitmapEntity, name: 'Test #1', id: '0bd26b6a-ed1c-4fe9-8cb7-fba87bf3086a' });
  stores.bitmaps.addBitmap({ ...bitmapEntity, name: 'Test #2', id: 'aec7089c-6573-4c33-895e-87a7a022ce0b' });
  stores.bitmaps.addBitmap({ ...bitmapEntity, name: 'Test #3', id: 'd4445877-1fbd-445a-bc04-0792a5b1e7e8' });
  const [exportButton] = screen.getAllByTitle('Export to file');
  await userEvent.click(exportButton);
  // Show dialog
  const selectAll = screen.getByLabelText('Select all');
  const acceptButton = screen.getByText('Save as file');
  await userEvent.click(selectAll);
  await userEvent.click(acceptButton);
  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][1]).toBe('bitmap_2024_05_01_00_00.json');
});

test('copy bitmap', async () => {
  const { stores, userEvent, router } = renderHomePage();
  stores.bitmaps.addBitmap(bitmapEntity);
  const copyButton = screen.getByTitle('Create copy');
  await userEvent.click(copyButton);
  // Show dialog
  const bitmapName = 'Copied bitmap';
  const inputName = screen.getByLabelText(/Name/i);
  await userEvent.type(inputName, bitmapName);
  const saveButton: HTMLButtonElement = screen.getByText('Save');
  expect(saveButton.disabled).toBeFalsy();
  await userEvent.click(saveButton);
  expect(stores.bitmaps.bitmaps.length).toBe(2);
  // Redirect bitmap page
  const id = stores.bitmaps.bitmaps.at(-1)?.id ?? '';
  const url = generatePath(PageUrl.EditBitmap, { id });
  expect(router.location.pathname).toBe(url);
});

const renderPageForSorting = () => {
  const props = renderHomePage();
  const { stores } = props;
  stores.settings.updateBitmapListSettings({ nameSortValue: SortValue.NONE, dateSortValue: SortValue.NONE });
  stores.bitmaps.addBitmap({
    ...bitmapEntity,
    id: '1',
    name: 'Banana',
    createdAt: DateTime.now().minus({ day: 2 }).toMillis(),
  });
  stores.bitmaps.addBitmap({
    ...bitmapEntity,
    id: '2',
    name: 'Orange',
    createdAt: DateTime.now().minus({ day: 3 }).toMillis(),
  });
  stores.bitmaps.addBitmap({
    ...bitmapEntity,
    id: '3',
    name: 'Apple',
    createdAt: DateTime.now().minus({ day: 1 }).toMillis(),
  });
  return props;
};

test('sort by favorite', async () => {
  const { userEvent } = renderPageForSorting();

  const favoriteButtons = screen.getAllByTitle('Favorite');
  expect(favoriteButtons.length).toBe(3);

  await userEvent.click(favoriteButtons[favoriteButtons.length - 1]);

  const items = screen.getAllByTestId(BITMAP_ITEM_TITLE_ID);
  expect(items[0].textContent).toBe('Apple');
  expect(items[1].textContent).toBe('Banana');
  expect(items[2].textContent).toBe('Orange');
});

test('sort by name', async () => {
  const { userEvent } = renderPageForSorting();

  const sortButton = screen.getByText('Name');
  await userEvent.click(sortButton);
  {
    const items = screen.getAllByTestId(BITMAP_ITEM_TITLE_ID);
    expect(items[0].textContent).toBe('Apple');
    expect(items[1].textContent).toBe('Banana');
    expect(items[2].textContent).toBe('Orange');
  }

  await userEvent.click(sortButton);
  {
    const items = screen.getAllByTestId(BITMAP_ITEM_TITLE_ID);
    expect(items[0].textContent).toBe('Orange');
    expect(items[1].textContent).toBe('Banana');
    expect(items[2].textContent).toBe('Apple');
  }

  await userEvent.click(sortButton);
  {
    const items = screen.getAllByTestId(BITMAP_ITEM_TITLE_ID);
    expect(items[0].textContent).toBe('Banana');
    expect(items[1].textContent).toBe('Orange');
    expect(items[2].textContent).toBe('Apple');
  }
});

test('sort by date', async () => {
  const { userEvent } = renderPageForSorting();

  const sortButton = screen.getByText('Created');
  await userEvent.click(sortButton);
  {
    const items = screen.getAllByTestId(BITMAP_ITEM_TITLE_ID);
    expect(items[0].textContent).toBe('Apple');
    expect(items[1].textContent).toBe('Banana');
    expect(items[2].textContent).toBe('Orange');
  }

  await userEvent.click(sortButton);
  {
    const items = screen.getAllByTestId(BITMAP_ITEM_TITLE_ID);
    expect(items[0].textContent).toBe('Orange');
    expect(items[1].textContent).toBe('Banana');
    expect(items[2].textContent).toBe('Apple');
  }

  await userEvent.click(sortButton);
  {
    const items = screen.getAllByTestId(BITMAP_ITEM_TITLE_ID);
    expect(items[0].textContent).toBe('Banana');
    expect(items[1].textContent).toBe('Orange');
    expect(items[2].textContent).toBe('Apple');
  }
});
