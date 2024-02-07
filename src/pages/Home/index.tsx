import { Link } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { Page } from '@/components/Page';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { useMemo, useState } from 'react';
import { DeleteBitmapDialog } from './DeleteBitmapDialog';

const Home = () => {
  const { bitmaps } = useBitmapStore();
  const orderedBitmaps = useMemo(() => bitmaps.sort((a, b) => b.updatedAt - a.updatedAt), [bitmaps]);
  const [deleteBitmapId, setDeleteBitmapId] = useState<string | null>(null);
  return (
    <>
      <Page title="Bitmap Editor">
        <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
          {orderedBitmaps.length > 0 && (
            <div className="mb-3">
              <h2 className="text-center">Open</h2>
              <ul className="list-group list-group-flush mb-3">
                {orderedBitmaps.map((it) => {
                  const url = PageUrl.EditBitmap.replace(':id', it.id);
                  return (
                    <li key={it.id} className="list-group-item d-flex gap-1">
                      <Link to={url} className="btn-link">
                        {it.name}
                      </Link>{' '}
                      ({it.width}x{it.height})
                      <i
                        className="bi bi-trash-fill text-danger"
                        role="button"
                        onClick={() => setDeleteBitmapId(it.id)}
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
          <div className="d-flex flex-column gap-3">
            <Link to={PageUrl.CreateBitmap} className="btn btn-primary btn-lg">
              Create new bitmap
            </Link>
            <Link to={PageUrl.ImportBitmap} className="btn btn-primary btn-lg">
              Import bitmap
            </Link>
          </div>
        </main>
      </Page>
      {deleteBitmapId && <DeleteBitmapDialog bitmapId={deleteBitmapId} onClose={() => setDeleteBitmapId(null)} />}
    </>
  );
};

export default Home;
