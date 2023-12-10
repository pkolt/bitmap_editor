import { Page } from '@/components/Page';
import { PageUrl } from '@/constants/urls';
import { useImageStore } from '@/store/images/useImagesStore';
import { Navigate, useParams } from 'react-router-dom';

const Editor = () => {
  const { id } = useParams();
  const { findImage } = useImageStore();
  const image = findImage(id ?? '');

  if (!image) {
    return <Navigate to={PageUrl.Home} replace />;
  }

  return (
    <Page title="Pixel Editor">
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        <h1>{image.name}</h1>
      </main>
    </Page>
  );
};

export default Editor;
