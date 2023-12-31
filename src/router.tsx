/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PageUrl } from './constants/urls';

const Home = lazy(() => import('./pages/Home'));
const CreateBitmap = lazy(() => import('./pages/CreateBitmap'));
const DrawBitmap = lazy(() => import('./pages/DrawBitmap'));

export const router = createBrowserRouter([
  {
    path: PageUrl.Home,
    element: <Home />,
  },
  {
    path: PageUrl.CreateBitmap,
    element: <CreateBitmap />,
  },
  {
    path: PageUrl.DrawBitmap,
    element: <DrawBitmap />,
  },
]);
