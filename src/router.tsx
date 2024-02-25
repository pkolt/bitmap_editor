/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PageUrl } from './constants/urls';

const BitmapList = lazy(() => import('./pages/BitmapList'));
const CreateBitmap = lazy(() => import('./pages/CreateBitmap'));
const EditBitmap = lazy(() => import('./pages/EditBitmap'));
const ImportFromImage = lazy(() => import('./pages/ImportFromImage'));

export const router = createBrowserRouter([
  {
    path: PageUrl.BitmapList,
    element: <BitmapList />,
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
    path: PageUrl.ImportBitmapFromImage,
    element: <ImportFromImage />,
  },
]);
