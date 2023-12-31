import { Modal } from '@/components/Modal';
import { useImageStore } from '@/store/images/useImagesStore';
import { imageToProgramCode } from '../utils';
import { useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface ExportDialogProps {
  imageId: string;
  onClose: () => void;
}

interface FormData {
  data: string;
}

export const ExportDialog = ({ imageId, onClose }: ExportDialogProps): JSX.Element | null => {
  const textareaId = useId();
  const { findImage } = useImageStore();
  const image = findImage(imageId);
  const defaultData = useMemo<string>(() => (image ? imageToProgramCode(image) : ''), [image]);
  const { register, handleSubmit, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { data: defaultData },
  });
  const data = watch('data');
  const handleCopy = () => {
    navigator.clipboard.writeText(data);
  };

  if (!image) {
    return null;
  }
  return (
    <Modal title="Export bitmap" onClose={onClose}>
      <form onSubmit={handleSubmit(() => {})} className="mb-3">
        <div className="alert alert-warning d-flex align-items-center gap-1">
          <i className="bi bi-exclamation-triangle" />
          <div>Exported image is format SSD1306 OLED display</div>
        </div>
        <textarea className="form-control" rows={10} id={textareaId} {...register('data')} />
      </form>
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={handleCopy}>
          Copy to clipboard
        </button>
      </div>
    </Modal>
  );
};
