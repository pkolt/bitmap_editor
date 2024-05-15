import { Modal } from '@/components/Modal';
import { useBitmapsStore } from '@/stores/bitmaps';
import { requiredValue } from '@/utils/requiredValue';

interface DeleteBitmapDialogProps {
  bitmapId: string;
  onClose: () => void;
}

export const DeleteBitmapDialog = ({ bitmapId, onClose }: DeleteBitmapDialogProps): JSX.Element | null => {
  const { deleteBitmap, findBitmap } = useBitmapsStore();
  const bitmapEntity = requiredValue(findBitmap(bitmapId));
  return (
    <Modal title="Delete bitmap" onClose={onClose} onAccept={() => deleteBitmap(bitmapId)}>
      <p>Delete bitmap &quot;{bitmapEntity.name}&quot;?</p>
    </Modal>
  );
};
