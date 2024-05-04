import { RouterProviderProps, RouterProvider } from 'react-router-dom';

interface ProvidersProps {
  router: RouterProviderProps['router'];
}

export const Providers = ({ router }: ProvidersProps): JSX.Element => {
  return <RouterProvider router={router} />;
};
