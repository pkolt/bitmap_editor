import { Modal } from '@/components/Modal';
import { useImageStore } from '@/store/images/useImagesStore';

interface DeleteImageDialogProps {
  imageId: string;
  onClose: () => void;
}

export const DeleteImageDialog = ({ imageId, onClose }: DeleteImageDialogProps): JSX.Element | null => {
  const { deleteImage, findImage } = useImageStore();
  const image = findImage(imageId);
  if (!image) {
    return null;
  }
  return (
    <Modal title="Delete image" onClose={onClose} onAccept={() => deleteImage(imageId)}>
      <p>Delete image "{image.name}"?</p>
    </Modal>
  );
};
