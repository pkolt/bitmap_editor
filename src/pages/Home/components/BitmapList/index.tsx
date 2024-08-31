import { useBitmapsStore } from '@/stores/bitmaps';
import { useMemo } from 'react';
import { OpenDialogFn } from '../../types';
import { BitmapItem } from '../BitmapItem';
import { useTranslation } from 'react-i18next';

interface BitmapListProps {
  openDialog: OpenDialogFn;
}

export const BitmapList = ({ openDialog }: BitmapListProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { bitmaps } = useBitmapsStore();
  const bitmapIds = useMemo(() => bitmaps.toSorted((a, b) => b.createdAt - a.createdAt).map((it) => it.id), [bitmaps]);

  if (bitmapIds.length === 0) {
    return null;
  }

  return (
    <div className="mb-3" data-testid="bitmap-list">
      <h2 className="text-center mb-2">{t('Open')}</h2>
      <table className="table table-borderless mb-3">
        <thead>
          <tr>
            <th></th>
            <th>{t('Name')}</th>
            <th className="text-center">{t('Size')}</th>
            <th>{t('Created')}</th>
            <th colSpan={3}>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {bitmapIds.map((id) => (
            <BitmapItem key={id} bitmapId={id} openDialog={openDialog} />
          ))}
        </tbody>
      </table>
      <h5 className="d-flex gap-3 align-items-center">
        <hr className="flex-grow-1" />
        {t('Or')}
        <hr className="flex-grow-1" />
      </h5>
    </div>
  );
};
