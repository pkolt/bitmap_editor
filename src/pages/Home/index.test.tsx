import { test, renderPage, expect, screen } from '@/test-utils';
import Home from './';
import { PageUrl } from '@/constants/urls';

test('show empty', async () => {
  const { location } = renderPage(<Home />, { route: { path: PageUrl.Home } });
  expect(screen.queryAllByTestId('bitmap-item').length).toEqual(0);
  expect(location().pathname).toEqual(PageUrl.Home);
});
