import { Input } from '@/components/Input';
import { PageUrl } from '@/constants/urls';
import { useBitmapsStore } from '@/stores/bitmaps';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { FormProvider, useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
import { BitmapEntity } from '@/utils/bitmap/types';
import { requiredValue } from '@/utils/requiredValue';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface FormValues {
  name: string;
}

interface CopyBitmapDialogProps {
  show: boolean;
  bitmapId: string;
  onClose: () => void;
}

export const CopyBitmapDialog = ({ show, bitmapId, onClose }: CopyBitmapDialogProps): JSX.Element | null => {
  const navigate = useNavigate();
  const { findBitmap, addBitmap } = useBitmapsStore();
  const bitmapEntity = requiredValue(findBitmap(bitmapId));
  const { t } = useTranslation();

  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: bitmapEntity?.name,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { isValid, isDirty },
  } = methods;

  const onSubmit = (data: FormValues) => {
    const id = uuidv4();
    const timestamp = DateTime.now().toMillis();

    const image: BitmapEntity = {
      id,
      name: data.name,
      createdAt: timestamp,
      updatedAt: timestamp,
      data: bitmapEntity.data,
      width: bitmapEntity.width,
      height: bitmapEntity.height,
    };

    addBitmap(image);

    const url = generatePath(PageUrl.EditBitmap, { id });
    navigate(url, { replace: true });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Create copy')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormProvider {...methods}>
          <form id="copy-bitmap-dialog" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <Input label={`${t('Name')}:`} autoFocus {...register('name', { required: true, minLength: 1 })} />
          </form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button form="copy-bitmap-dialog" type="submit" disabled={!isValid || !isDirty}>
          {t('Save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
