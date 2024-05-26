import { BitmapSizeAlert } from '@/components/BitmapSizeAlert';
import { Input } from '@/components/Input';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

interface FormValues {
  width: number;
  height: number;
}

interface ResizeDialogProps {
  show: boolean;
  bitmap: Bitmap;
  onChangeBitmap: (bitmap: Bitmap) => void;
  onClose: () => void;
}

export const ResizeDialog = ({ show, bitmap, onChangeBitmap, onClose }: ResizeDialogProps): JSX.Element | null => {
  const { t } = useTranslation();
  const methods = useForm<FormValues>({
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

  const onSubmit = ({ width, height }: FormValues) => {
    const clonedBitmap = bitmap.clone();
    clonedBitmap.resize(width, height);
    onChangeBitmap(clonedBitmap);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Resize layout')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form id="resize-dialog" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <BitmapSizeAlert bitmapWidth={bitmapWidth} />
            <Input label={t('Width')} {...register('width', { required: true, valueAsNumber: true, min: 1 })} />
            <Input label={t('Height')} {...register('height', { required: true, valueAsNumber: true, min: 1 })} />
          </form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button form="resize-dialog" type="submit" disabled={!isValid || !isDirty}>
          {t('Apply')}
        </Button>
        <Button variant="secondary" disabled={!isDirty} onClick={onReset}>
          {t('Reset')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
