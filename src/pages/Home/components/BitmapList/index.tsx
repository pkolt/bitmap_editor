import { useBitmapStore } from '@/stores/bitmaps';
import { useMemo } from 'react';
import { OpenDialogFn } from '../../types';
import { BitmapItem } from '../BitmapItem';

interface BitmapListProps {
  openDialog: OpenDialogFn;
}

export const BitmapList = ({ openDialog }: BitmapListProps): JSX.Element | null => {
  const { bitmaps } = useBitmapStore();
  const bitmapIds = useMemo(() => bitmaps.toSorted((a, b) => b.updatedAt - a.updatedAt).map((it) => it.id), [bitmaps]);

  if (bitmapIds.length === 0) {
    return null;
  }

  return (
    <div className="mb-3" data-testid="bitmap-list">
      <h2 className="text-center mb-2">Open</h2>
      <ul className="list-group list-group-flush mb-3">
        {bitmapIds.map((id) => (
          <BitmapItem key={id} bitmapId={id} openDialog={openDialog} />
        ))}
      </ul>
      <h5 className="d-flex gap-3 align-items-center">
        <hr className="flex-grow-1" />
        Or
        <hr className="flex-grow-1" />
      </h5>
    </div>
  );
};
