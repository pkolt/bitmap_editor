import { RenderOptions } from '@testing-library/react';
import { renderElement } from './renderElement';
import { Providers } from './Providers';
import { createMemoryRouter } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { useBitmapsStore } from '@/stores/bitmaps';
import { useSettingsStore } from '@/stores/settings';

interface ProviderProps {
  route: {
    path: PageUrl;
  };
}

export const renderPage = (elem: JSX.Element, props: ProviderProps, options?: RenderOptions) => {
  const memoryRouter = createMemoryRouter(
    [
      {
        path: props.route.path,
        element: elem,
      },
      {
        path: '*',
        element: null,
      },
    ],
    {
      initialEntries: [props.route.path],
      initialIndex: 1,
    },
  );

  const stores = {
    get bitmaps() {
      return useBitmapsStore.getState();
    },
    get settings() {
      return useSettingsStore.getState();
    },
  };

  const router = {
    get location() {
      return memoryRouter.state.location;
    },
    get navigate() {
      return memoryRouter.navigate;
    },
  };

  const result = renderElement(elem, {
    ...options,
    wrapper: () => <Providers router={memoryRouter} />,
  });

  return { ...result, router, stores };
};
