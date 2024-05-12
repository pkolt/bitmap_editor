import ImportFromJson from './';
import { test, renderPage, expect, screen } from '@/test-utils';
import { PageUrl } from '@/constants/urls';
import { convertToBitmapFile } from '@/utils/bitmap/file';
import { bitmapEntity } from '@/test-utils/bitmaps';

const renderImportFromJsonPage = () => renderPage(<ImportFromJson />, { route: { path: PageUrl.ImportFromJson } });

test('import bitmap from json', async () => {
  const { userEvent, router, stores } = renderImportFromJsonPage();
  const blob = convertToBitmapFile([bitmapEntity]);
  const file = new File([blob], 'bitmap_list.json', { type: 'application/json' });
  const inputFile = screen.getByLabelText('File (*.json)');
  await userEvent.upload(inputFile, file);
  const nextButton = screen.getByText('Next step');
  expect(nextButton).toBeEnabled();
  await userEvent.click(nextButton);
  // Show next step
  const saveButton = await screen.findByText('Save bitmaps');
  await userEvent.click(saveButton);
  expect(router.location.pathname).toBe(PageUrl.Home);
  expect(stores.bitmaps.bitmaps.length).toBe(1);
  expect(stores.bitmaps.bitmaps[0]).toMatchObject(bitmapEntity);
});
