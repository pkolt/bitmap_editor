import { Input } from '@/components/Input';
import { BitmapEntity } from '@/utils/bitmap/types';
import { parseBitmapFile } from '@/utils/bitmap/file';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

interface FormValues {
  files: FileList | null;
}

interface FileFormProps {
  onNext: (entities: BitmapEntity[]) => void;
}

export const FileForm = ({ onNext }: FileFormProps) => {
  const { t } = useTranslation();
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {},
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: FormValues) => {
    const { files } = data;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const entities = parseBitmapFile(reader.result);
        onNext(entities);
      }
    };
    reader.readAsText(file);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column w-50">
        <Input
          label={`${t('File')} (*.json)`}
          type="file"
          accept="application/json"
          autoFocus
          {...register('files', { required: true })}
        />
        <Button type="submit" className="mt-5 ms-auto me-auto" disabled={!isValid}>
          {t('Next step')}
        </Button>
      </form>
    </FormProvider>
  );
};
