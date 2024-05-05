import { RenderOptions } from '@testing-library/react';
import { renderElement } from './renderElement';
import { Providers } from './Providers';
import { createMemoryRouter } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';

interface ProviderProps {
  route: {
    path: PageUrl;
  };
}

export const renderPage = (elem: JSX.Element, props: ProviderProps, options?: RenderOptions) => {
  const router = createMemoryRouter(
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
  const result = renderElement(elem, {
    ...options,
    wrapper: () => <Providers router={router} />,
  });
  return { ...result, navigate: router.navigate, location: () => router.state.location };
};