import { Editor } from '@/components/Editor';
import { Page } from '@/components/Page';
import { PageUrl } from '@/constants/urls';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { Navigate, useParams } from 'react-router-dom';

const DrawBitmap = () => {
  const { id } = useParams();
  const { findBitmap } = useBitmapStore();
  const image = findBitmap(id ?? '');

  if (!image || !id) {
    return <Navigate to={PageUrl.Home} replace />;
  }

  return (
    <Page title={`Bitmap Editor: ${image.name}`}>
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        <Editor bitmapId={id} />
      </main>
    </Page>
  );
};

export default DrawBitmap;
