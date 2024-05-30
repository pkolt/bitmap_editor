import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useBitmapsStore } from '@/stores/bitmaps';
import { requiredValue } from '@/utils/requiredValue';
import { useTranslation } from 'react-i18next';

interface DeleteBitmapDialogProps {
  bitmapId: string;
  onClose: () => void;
}

export const DeleteBitmapDialog = ({ bitmapId, onClose }: DeleteBitmapDialogProps): JSX.Element | null => {
  const { deleteBitmap, findBitmap } = useBitmapsStore();
  const bitmapEntity = requiredValue(findBitmap(bitmapId));
  const { t } = useTranslation();
  return (
    <ConfirmDialog title={t('Delete bitmap')} onClose={onClose} onAccept={() => deleteBitmap(bitmapId)}>
      <p>
        {t('Delete bitmap')} &quot;{bitmapEntity.name}&quot;?
      </p>
    </ConfirmDialog>
  );
};
