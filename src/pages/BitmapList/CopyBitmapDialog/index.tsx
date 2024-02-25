import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { PageUrl } from '@/constants/urls';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BitmapEntity } from '@/types/bitmap';

interface FormData {
  name: string;
}

interface CopyBitmapDialogProps {
  bitmapId: string;
  onClose: () => void;
}

export const CopyBitmapDialog = ({ bitmapId, onClose }: CopyBitmapDialogProps): JSX.Element | null => {
  const navigate = useNavigate();
  const { findBitmap, addBitmap } = useBitmapStore();
  const bitmapEntity = findBitmap(bitmapId);

  const methods = useForm<FormData>({
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

  const onSubmit = (data: FormData) => {
    if (!bitmapEntity) {
      return;
    }

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

    navigate(PageUrl.EditBitmap.replace(':id', id), { replace: true });
  };

  if (!bitmapEntity) {
    return null;
  }

  return (
    <Modal title="Create copy" onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <Input label="Name:" autoFocus {...register('name', { required: true, minLength: 1 })} />
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
