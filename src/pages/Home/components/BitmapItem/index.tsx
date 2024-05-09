import { PageUrl } from '@/constants/urls';
import { Link, generatePath } from 'react-router-dom';
import { Dialog, OpenDialogFn } from '../../types';
import { useBitmapStore } from '@/stores/bitmaps';

interface BitmapItemProps {
  bitmapId: string;
  openDialog: OpenDialogFn;
}

export const BitmapItem = ({ bitmapId, openDialog }: BitmapItemProps): JSX.Element | null => {
  const { findBitmap } = useBitmapStore();

  const bitmapEntity = findBitmap(bitmapId);

  if (!bitmapEntity) {
    return null;
  }

  const url = generatePath(PageUrl.EditBitmap, { id: bitmapEntity.id });
  return (
    <li key={bitmapEntity.id} className="list-group-item d-flex gap-2" data-testid="bitmap-item">
      <div>
        <Link to={url} className="btn-link me-1">
          {bitmapEntity.name}
        </Link>
        ({bitmapEntity.width}x{bitmapEntity.height})
      </div>
      <i
        className="bi bi-copy"
        role="button"
        title="Create copy"
        onClick={() => openDialog(Dialog.CopyBitmap, bitmapEntity.id)}
      />
      <i
        className="bi bi-floppy"
        role="button"
        title="Export to file"
        onClick={() => openDialog(Dialog.ExportBitmap, bitmapEntity.id)}
      />
      <i
        className="bi bi-trash-fill text-danger"
        role="button"
        title="Delete bitmap"
        onClick={() => openDialog(Dialog.DeleteBitmap, bitmapEntity.id)}
      />
    </li>
  );
};
