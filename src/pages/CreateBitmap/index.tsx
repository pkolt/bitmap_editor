import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { Page } from '@/components/Page';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { useNavigate } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { BitmapEntity } from '@/types/bitmap';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { BitmapSizeAlert } from '@/components/BitmapSizeAlert';
import { Bitmap } from '@/utils/bitmap/Bitmap';

interface FormData {
  name: string;
  width: number;
  height: number;
}

const defaultValues: FormData = { name: '', width: 128, height: 64 };

const CreateBitmap = () => {
  const navigate = useNavigate();
  const { addBitmap } = useBitmapStore();

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { isValid },
  } = methods;

  const bitmapWidth = watch('width');

  const onSubmit = (data: FormData) => {
    const id = uuidv4();
    const timestamp = DateTime.now().toMillis();
    const bitmap = new Bitmap(data.width, data.height);

    const image: BitmapEntity = {
      id,
      name: data.name,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...bitmap.toJSON(),
    };

    addBitmap(image);

    navigate(PageUrl.EditBitmap.replace(':id', id), { replace: true });
  };

  return (
    <Page title="Create new image">
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
        <h1>Create new bitmap</h1>
        <BitmapSizeAlert bitmapWidth={bitmapWidth} className="mb-3" />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-50 d-flex flex-column gap-3">
            <Input label="Name:" autoFocus {...register('name', { required: true })} />
            <Input label="Width:" {...register('width', { required: true, valueAsNumber: true, min: 1 })} />
            <Input label="Height:" {...register('height', { required: true, valueAsNumber: true, min: 1 })} />
            <div className="text-center">
              <button type="submit" className="btn btn-primary" disabled={!isValid}>
                Save
              </button>
            </div>
          </form>
        </FormProvider>
      </main>
    </Page>
  );
};

export default CreateBitmap;
