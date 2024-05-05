import { Modal } from '@/components/Modal';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';

interface DeleteBitmapDialogProps {
  bitmapId: string;
  onClose: () => void;
}

export const DeleteBitmapDialog = ({ bitmapId, onClose }: DeleteBitmapDialogProps): JSX.Element | null => {
  const { deleteBitmap, findBitmap } = useBitmapStore();
  const bitmapEntity = findBitmap(bitmapId);
  if (!bitmapEntity) {
    return null;
  }
  return (
    <Modal title="Delete bitmap" onClose={onClose} onAccept={() => deleteBitmap(bitmapId)}>
      <p>Delete bitmap &quot;{bitmapEntity.name}&quot;?</p>
    </Modal>
  );
};
