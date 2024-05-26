import { Input } from '@/components/Input';
import { useBitmapsStore } from '@/stores/bitmaps';
import { requiredValue } from '@/utils/requiredValue';
import { FormProvider, useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

interface RenameDialogProps {
  show: boolean;
  bitmapId: string;
  onClose: () => void;
}

interface FormValues {
  name: string;
}

export const RenameDialog = ({ show, bitmapId, onClose }: RenameDialogProps): JSX.Element | null => {
  const { t } = useTranslation();
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
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Rename bitmap')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormProvider {...methods}>
          <form id="rename-dialog" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <Input label={t('Name')} autoFocus {...register('name', { required: true, minLength: 3 })} />
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
