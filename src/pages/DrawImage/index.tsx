import { PixelEditor } from '@/components/PixelEditor';
import { Page } from '@/components/Page';
import { PageUrl } from '@/constants/urls';
import { useImageStore } from '@/store/images/useImagesStore';
import { ImageEntityData } from '@/types/image';
import { useCallback } from 'react';
import { Navigate, useParams } from 'react-router-dom';

const DrawImage = () => {
  const { id } = useParams();
  const { findImage, changeImage } = useImageStore();
  const image = findImage(id ?? '');

  const onChange = useCallback(
    (data: ImageEntityData) => {
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
        <PixelEditor image={image} onChange={onChange} />
      </main>
    </Page>
  );
};

export default DrawImage;
