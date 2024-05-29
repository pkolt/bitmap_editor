import { BitmapSizeAlert } from '@/components/BitmapSizeAlert';
import { Input } from '@/components/Input';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

type FormValues = z.infer<typeof formSchema>;

interface ResizeDialogProps {
  bitmap: Bitmap;
  onChangeBitmap: (bitmap: Bitmap) => void;
  onClose: () => void;
}

export const ResizeDialog = ({ bitmap, onChangeBitmap, onClose }: ResizeDialogProps): JSX.Element | null => {
  const { t } = useTranslation();
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { width: bitmap.width, height: bitmap.height },
    resolver: zodResolver(formSchema),
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
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Resize layout')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form id="resize-dialog" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <BitmapSizeAlert bitmapWidth={bitmapWidth} />
            <Input label={t('Width')} {...register('width', { valueAsNumber: true })} />
            <Input label={t('Height')} {...register('height', { valueAsNumber: true })} />
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
