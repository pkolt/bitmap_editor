import { PageUrl } from '@/constants/urls';
import { Link, generatePath } from 'react-router-dom';
import { DialogType, OpenDialogFn } from '../../types';
import { useBitmapsStore } from '@/stores/bitmaps';
import { requiredValue } from '@/utils/requiredValue';
import { useTranslation } from 'react-i18next';

interface BitmapItemProps {
  bitmapId: string;
  openDialog: OpenDialogFn;
}

export const BitmapItem = ({ bitmapId, openDialog }: BitmapItemProps): JSX.Element | null => {
  const { findBitmap } = useBitmapsStore();
  const bitmapEntity = requiredValue(findBitmap(bitmapId));
  const { t } = useTranslation();

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
        className="bi-copy"
        role="button"
        title={t('Create copy')}
        onClick={() => openDialog({ type: DialogType.CopyBitmap, bitmapId: bitmapEntity.id })}
      />
      <i
        className="bi-floppy"
        role="button"
        title={t('Export to file')}
        onClick={() => openDialog({ type: DialogType.ExportBitmap, bitmapId: bitmapEntity.id })}
      />
      <i
        className="bi-trash-fill text-danger"
        role="button"
        title={t('Delete bitmap')}
        onClick={() => openDialog({ type: DialogType.DeleteBitmap, bitmapId: bitmapEntity.id })}
      />
    </li>
  );
};
