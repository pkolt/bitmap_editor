/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PageUrl } from './constants/urls';

const Home = lazy(() => import('./pages/Home'));
const CreateImage = lazy(() => import('./pages/CreateImage'));
const Editor = lazy(() => import('./pages/Editor'));

export const router = createBrowserRouter([
  {
    path: PageUrl.Home,
    element: <Home />,
  },
  {
    path: PageUrl.CreateImage,
    element: <CreateImage />,
  },
  {
    path: PageUrl.Editor,
    element: <Editor />,
  },
]);
