import { DateTime } from 'luxon';
import { Page } from '@/components/Page';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { generatePath, useNavigate } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { BitmapEntity } from '@/utils/bitmap/types';
import { useBitmapsStore } from '@/stores/bitmaps';
import { BitmapSizeAlert } from '@/components/BitmapSizeAlert';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().trim().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = { name: '', width: 128, height: 64 };

const CreateBitmap = () => {
  const navigate = useNavigate();
  const { addBitmap } = useBitmapsStore();
  const { t } = useTranslation();

  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { isValid },
  } = methods;

  const bitmapWidth = watch('width');

  const onSubmit = (data: FormValues) => {
    const id = crypto.randomUUID();
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

    const url = generatePath(PageUrl.EditBitmap, { id });
    navigate(url, { replace: true });
  };

  return (
    <Page title={t('Create new image')}>
      <BitmapSizeAlert bitmapWidth={bitmapWidth} className="mb-3" />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-50 d-flex flex-column gap-3">
          <Input label={t('Name')} autoFocus {...register('name', { required: true })} />
          <Input label={t('Width')} {...register('width', { valueAsNumber: true })} />
          <Input label={t('Height')} {...register('height', { valueAsNumber: true })} />
          <div className="text-center">
            <Button type="submit" disabled={!isValid}>
              {t('Save')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Page>
  );
};

export default CreateBitmap;
