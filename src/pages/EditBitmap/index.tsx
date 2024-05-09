import { BitmapEditor } from '@/components/BitmapEditor';
import { Page } from '@/components/Page';
import { PageUrl } from '@/constants/urls';
import { useBitmapStore } from '@/stores/bitmaps';
import { Navigate, useParams } from 'react-router-dom';

const EditBitmap = () => {
  const { id } = useParams();
  const { findBitmap } = useBitmapStore();
  const image = findBitmap(id ?? '');

  if (!image || !id) {
    return <Navigate to={PageUrl.Home} replace />;
  }

  return (
    <Page title={`Edit bitmap: ${image.name}`}>
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        <BitmapEditor bitmapId={id} />
      </main>
    </Page>
  );
};

export default EditBitmap;
