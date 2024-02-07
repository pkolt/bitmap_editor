import { Input } from '@/components/Input';
import { Modal, ModalRef } from '@/components/Modal';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface RenameDialogProps {
  bitmapId: string;
  onClose: () => void;
}

interface FormData {
  name: string;
}

export const RenameDialog = ({ bitmapId, onClose }: RenameDialogProps): JSX.Element | null => {
  const refModal = useRef<ModalRef | null>(null);
  const { findBitmap, changeBitmap } = useBitmapStore();
  const bitmapEntity = findBitmap(bitmapId);
  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { name: bitmapEntity?.name },
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: FormData) => {
    if (bitmapEntity) {
      changeBitmap(bitmapId, { name: data.name });
    }
    refModal.current?.close();
  };

  if (!bitmapEntity) {
    return null;
  }

  return (
    <Modal title="Rename bitmap" onClose={onClose} ref={refModal}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <Input label="Name:" autoFocus {...register('name', { required: true, minLength: 3 })} />
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
