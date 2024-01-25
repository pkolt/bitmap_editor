import { Editor } from '@/components/Editor';
import { Page } from '@/components/Page';
import { PageUrl } from '@/constants/urls';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { BitmapEntityData } from '@/types/bitmap';
import { useCallback } from 'react';
import { Navigate, useParams } from 'react-router-dom';

const DrawBitmap = () => {
  const { id } = useParams();
  const { findBitmap: findBitmap, changeBitmap: changeImage } = useBitmapStore();
  const image = findBitmap(id ?? '');

  const onChange = useCallback(
    (data: BitmapEntityData) => {
      if (image) {
        changeImage({ ...image, data });
      }
    },
    [changeImage, image],
  );

  if (!image) {
    return <Navigate to={PageUrl.Home} replace />;
  }

  return (
    <Page title={`Bitmap Editor: ${image.name}`}>
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        <h3 className="mb-3">
          {image.name} ({image.width}x{image.height})
        </h3>
        <Editor bitmapEntity={image} onChange={onChange} />
      </main>
    </Page>
  );
};

export default DrawBitmap;
