/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { PageUrl } from './constants/urls';

const Home = lazy(() => import('./pages/Home'));
const CreateBitmap = lazy(() => import('./pages/CreateBitmap'));
const EditBitmap = lazy(() => import('./pages/EditBitmap'));
const ImportFromImage = lazy(() => import('./pages/ImportFromImage'));
const ImportFromJson = lazy(() => import('./pages/ImportFromJson'));
const ImportFromCollections = lazy(() => import('./pages/ImportFromCollections'));

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
    path: PageUrl.EditBitmap,
    element: <EditBitmap />,
  },
  {
    path: PageUrl.ImportFromImage,
    element: <ImportFromImage />,
  },
  {
    path: PageUrl.ImportFromJson,
    element: <ImportFromJson />,
  },
  {
    path: PageUrl.ImportFromCollections,
    element: <ImportFromCollections />,
  },
  {
    path: '*',
    element: <Navigate to={PageUrl.Home} />,
  },
]);
