import { Input } from '@/components/Input';
import { useBitmapsStore } from '@/stores/bitmaps';
import { requiredValue } from '@/utils/requiredValue';
import { FormProvider, useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface RenameDialogProps {
  bitmapId: string;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const RenameDialog = ({ bitmapId, onClose }: RenameDialogProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { findBitmap, changeBitmap } = useBitmapsStore();
  const bitmapEntity = requiredValue(findBitmap(bitmapId));
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { name: bitmapEntity?.name },
    resolver: zodResolver(formSchema),
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
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Rename bitmap')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormProvider {...methods}>
          <form id="rename-dialog" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <Input label={t('Name')} autoFocus {...register('name')} />
          </form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="rename-dialog" disabled={!isValid || !isDirty}>
          {t('Save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
