import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { useBitmapsStore } from '@/stores/bitmaps';
import { requiredValue } from '@/utils/requiredValue';
import { FormProvider, useForm } from 'react-hook-form';

interface RenameDialogProps {
  bitmapId: string;
  onClose: () => void;
}

interface FormValues {
  name: string;
}

export const RenameDialog = ({ bitmapId, onClose }: RenameDialogProps): JSX.Element | null => {
  const { findBitmap, changeBitmap } = useBitmapsStore();
  const bitmapEntity = requiredValue(findBitmap(bitmapId));
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { name: bitmapEntity?.name },
  });

  const {
    handleSubmit,
    register,
    formState: { isValid, isDirty },
  } = methods;

  const onSubmit = (data: FormValues) => {
    if (bitmapEntity) {
      changeBitmap(bitmapId, { name: data.name });
    }
    onClose();
  };

  return (
    <Modal title="Rename bitmap" onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <Input label="Name:" autoFocus {...register('name', { required: true, minLength: 3 })} />
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={!isValid || !isDirty}>
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
