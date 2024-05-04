import { test, renderPage, expect } from '@/test-utils';
import BitmapList from './';
import { PageUrl } from '@/constants/urls';

test('show empty', async () => {
  const { container, location } = renderPage(<BitmapList />, { route: { path: PageUrl.BitmapList } });
  expect(location().pathname).toEqual(PageUrl.BitmapList);
  expect(container).matchSnapshot();
});
