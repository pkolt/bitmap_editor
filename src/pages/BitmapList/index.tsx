import { Link } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { Page } from '@/components/Page';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { useCallback, useMemo, useState } from 'react';
import { DeleteBitmapDialog } from './DeleteBitmapDialog';
import { CopyBitmapDialog } from './CopyBitmapDialog';
import { ExportBitmapDialog } from './ExportBitmapDialog';
import { ImportBitmapDialog } from './ImportBitmapDialog';

enum Dialog {
  None,
  DeleteBitmap,
  CopyBitmap,
  ExportBitmap,
  ImportBitmap,
}

const BitmapList = () => {
  const { bitmaps } = useBitmapStore();
  const orderedBitmaps = useMemo(() => bitmaps.sort((a, b) => b.updatedAt - a.updatedAt), [bitmaps]);
  const [bitmapId, setBitmapId] = useState<string | null>(null);
  const [dialog, setDialog] = useState(Dialog.None);
  const openDialog = useCallback((dlg: Dialog, id?: string) => {
    setDialog(dlg);
    if (id) {
      setBitmapId(id);
    }
  }, []);
  const closeDialog = useCallback(() => {
    setDialog(Dialog.None);
    setBitmapId(null);
  }, []);
  return (
    <>
      <Page title="Bitmap Editor">
        <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
          {orderedBitmaps.length > 0 && (
            <div className="mb-3">
              <h2 className="text-center mb-2">Open</h2>
              <ul className="list-group list-group-flush mb-3">
                {orderedBitmaps.map((it) => {
                  const url = PageUrl.EditBitmap.replace(':id', it.id);
                  return (
                    <li key={it.id} className="list-group-item d-flex gap-2">
                      <div>
                        <Link to={url} className="btn-link me-1">
                          {it.name}
                        </Link>
                        ({it.width}x{it.height})
                      </div>
                      <i
                        className="bi bi-copy"
                        role="button"
                        title="Create copy"
                        onClick={() => openDialog(Dialog.CopyBitmap, it.id)}
                      />
                      <i
                        className="bi bi-floppy"
                        role="button"
                        title="Export to file"
                        onClick={() => openDialog(Dialog.ExportBitmap, it.id)}
                      />
                      <i
                        className="bi bi-trash-fill text-danger"
                        role="button"
                        title="Delete bitmap"
                        onClick={() => openDialog(Dialog.DeleteBitmap, it.id)}
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
            <Link to={PageUrl.ImportBitmapFromImage} className="btn btn-primary btn-lg">
              Import from image
            </Link>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => openDialog(Dialog.ImportBitmap)}>
              Import from JSON
            </button>
          </div>
        </main>
      </Page>
      {dialog === Dialog.DeleteBitmap && bitmapId && <DeleteBitmapDialog bitmapId={bitmapId} onClose={closeDialog} />}
      {dialog === Dialog.CopyBitmap && bitmapId && <CopyBitmapDialog bitmapId={bitmapId} onClose={closeDialog} />}
      {dialog === Dialog.ExportBitmap && bitmapId && <ExportBitmapDialog bitmapId={bitmapId} onClose={closeDialog} />}
      {dialog === Dialog.ImportBitmap && <ImportBitmapDialog onClose={closeDialog} />}
    </>
  );
};

export default BitmapList;
