import { Modal } from '@/components/Modal';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { FileForm } from './FileForm';
import { useCallback, useState } from 'react';
import { BitmapEntity } from '@/types/bitmap';
import { FinalForm } from './FinalForm';

interface ImportBitmapDialogProps {
  onClose: () => void;
}

export const ImportBitmapDialog = ({ onClose }: ImportBitmapDialogProps): JSX.Element | null => {
  const { findBitmap } = useBitmapStore();
  const [entities, setEntities] = useState<BitmapEntity[] | null>(null);

  const handleNext = useCallback(
    (values: BitmapEntity[]) => {
      const excludeExistsEntities = values.filter((it) => !findBitmap(it.id));
      if (excludeExistsEntities.length > 0) {
        setEntities(excludeExistsEntities);
      } else {
        onClose();
      }
    },
    [findBitmap, onClose],
  );

  return (
    <Modal title="Import bitmap" onClose={onClose}>
      {entities ? <FinalForm entities={entities} onClose={onClose} /> : <FileForm onNext={handleNext} />}
    </Modal>
  );
};
