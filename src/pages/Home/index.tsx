import { Link } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { Page } from '@/components/Page';
import { useImageStore } from '@/store/images/useImagesStore';
import { useMemo, useState } from 'react';
import { DeleteImageDialog } from './DeleteImageDialog';

const Home = () => {
  const { images } = useImageStore();
  const orderedImages = useMemo(() => images.sort((a, b) => b.updatedAt - a.updatedAt), [images]);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  return (
    <>
      <Page title="Pixel Editor">
        <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
          {orderedImages.length > 0 && (
            <div className="mb-3">
              <h2 className="text-center">Open</h2>
              <ul className="list-group list-group-flush mb-3">
                {orderedImages.map((it) => {
                  const url = PageUrl.DrawImage.replace(':id', it.id);
                  return (
                    <li key={it.id} className="list-group-item d-flex gap-1">
                      <Link to={url} className="btn-link">
                        {it.name}
                      </Link>{' '}
                      ({it.width}x{it.height})
                      <i
                        className="bi bi-trash-fill text-danger"
                        role="button"
                        onClick={() => setDeleteImageId(it.id)}
                      />
                    </li>
                  );
                })}
              </ul>
              <h5 className="d-flex gap-3 align-items-center">
                <hr className="flex-grow-1" />
                Or
                <hr className="flex-grow-1" />
              </h5>
            </div>
          )}
          <Link to={PageUrl.CreateImage} className="btn btn-primary btn-lg">
            Create new image
          </Link>
        </main>
      </Page>
      {deleteImageId && <DeleteImageDialog imageId={deleteImageId} onClose={() => setDeleteImageId(null)} />}
    </>
  );
};

export default Home;
