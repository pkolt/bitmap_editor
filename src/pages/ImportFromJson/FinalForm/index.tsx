import { SelectBitmap } from '@/components/SelectBitmap';
import { useBitmapStore } from '@/stores/bitmaps';
import { BitmapEntity } from '@/utils/bitmap/types';
import { FormProvider, useForm } from 'react-hook-form';

interface FormValues {
  ids: string[];
}

interface FinalFormProps {
  entities: BitmapEntity[];
  onFinish: () => void;
}

export const FinalForm = ({ entities, onFinish }: FinalFormProps) => {
  const { addBitmap } = useBitmapStore();

  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      ids: entities.map((it) => it.id),
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: FormValues) => {
    entities.forEach((it) => {
      if (data.ids.includes(it.id)) {
        addBitmap(it);
      }
    });
    onFinish();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
        <SelectBitmap name={'ids' satisfies keyof FormValues} bitmaps={entities} />
        <button type="submit" className="btn btn-primary ms-auto me-auto mt-5" disabled={!isValid}>
          Save bitmaps
        </button>
      </form>
    </FormProvider>
  );
};
