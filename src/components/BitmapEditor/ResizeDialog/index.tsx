import { BitmapSizeAlert } from '@/components/BitmapSizeAlert';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface FormData {
  width: number;
  height: number;
}

interface ResizeDialogProps {
  bitmap: Bitmap;
  onChangeBitmap: (bitmap: Bitmap) => void;
  onClose: () => void;
}

export const ResizeDialog = ({ bitmap, onChangeBitmap, onClose }: ResizeDialogProps): JSX.Element | null => {
  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { width: bitmap.width, height: bitmap.height },
  });

  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { isValid, isDirty, defaultValues },
  } = methods;

  const bitmapWidth = watch('width');

  const onReset = useCallback(() => reset(defaultValues), [defaultValues, reset]);

  const onSubmit = ({ width, height }: FormData) => {
    const clonedBitmap = bitmap.clone();
    clonedBitmap.resize(width, height);
    onChangeBitmap(clonedBitmap);
  };

  return (
    <Modal title="Resize layout" onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <BitmapSizeAlert bitmapWidth={bitmapWidth} />
          <Input label="Width" {...register('width', { required: true, valueAsNumber: true, min: 1 })} />
          <Input label="Height" {...register('height', { required: true, valueAsNumber: true, min: 1 })} />
          <div className="d-flex justify-content-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={!isValid || !isDirty}>
              Apply
            </button>
            <button type="button" className="btn btn-secondary" disabled={!isDirty} onClick={onReset}>
              Reset
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
