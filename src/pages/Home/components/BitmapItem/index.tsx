import { PageUrl } from '@/constants/urls';
import { Link, generatePath } from 'react-router-dom';
import { DialogType, OpenDialogFn } from '../../types';
import { useBitmapsStore } from '@/stores/bitmaps';
import { requiredValue } from '@/utils/requiredValue';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { DateTime } from 'luxon';

interface BitmapItemProps {
  bitmapId: string;
  openDialog: OpenDialogFn;
}

export const BitmapItem = ({ bitmapId, openDialog }: BitmapItemProps): JSX.Element | null => {
  const { findBitmap, changeBitmap } = useBitmapsStore();
  const bitmapEntity = requiredValue(findBitmap(bitmapId));
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const url = generatePath(PageUrl.EditBitmap, { id: bitmapEntity.id });
  const fmtDate = DateTime.fromMillis(bitmapEntity.createdAt).setLocale(language).toLocaleString(DateTime.DATETIME_MED);

  const toggleFavorite = useCallback(() => {
    changeBitmap(bitmapId, { favorite: !bitmapEntity.favorite });
  }, [bitmapEntity.favorite, bitmapId, changeBitmap]);

  return (
    <tr key={bitmapEntity.id} className="gap-2" data-testid="bitmap-item">
      <td>
        <i
          className={bitmapEntity.favorite ? 'bi-star-fill text-warning' : 'bi-star text-black-50'}
          role="button"
          onClick={toggleFavorite}
        />
      </td>
      <td>
        <Link to={url} className="btn-link me-1">
          {bitmapEntity.name}
        </Link>
      </td>
      <td className="text-center">
        {bitmapEntity.width}x{bitmapEntity.height}
      </td>
      <td>{fmtDate}</td>
      <td>
        <i
          className="bi-copy"
          role="button"
          title={t('Create copy')}
          onClick={() => openDialog({ type: DialogType.CopyBitmap, bitmapId: bitmapEntity.id })}
        />
      </td>
      <td>
        <i
          className="bi-floppy"
          role="button"
          title={t('Export to file')}
          onClick={() => openDialog({ type: DialogType.ExportBitmap, bitmapId: bitmapEntity.id })}
        />
      </td>
      <td>
        <i
          className="bi-trash-fill text-danger"
          role="button"
          title={t('Delete bitmap')}
          onClick={() => openDialog({ type: DialogType.DeleteBitmap, bitmapId: bitmapEntity.id })}
        />
      </td>
    </tr>
  );
};
