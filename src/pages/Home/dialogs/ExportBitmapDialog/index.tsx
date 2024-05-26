import { DateTime } from 'luxon';
import FileSaver from 'file-saver';
import { Modal } from '@/components/Modal';
import { useBitmapsStore } from '@/stores/bitmaps';
import { FormProvider, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { convertToBitmapFile } from '@/utils/bitmap/file';
import { Input } from '@/components/Input';
import { SelectBitmap } from '@/components/SelectBitmap';
import { useTranslation } from 'react-i18next';

interface FormValues {
  name: string;
  ids: string[];
}

interface ExportBitmapDialogProps {
  bitmapId: string;
  onClose: () => void;
}

export const ExportBitmapDialog = ({ bitmapId, onClose }: ExportBitmapDialogProps): JSX.Element | null => {
  const { bitmaps } = useBitmapsStore();
  const { t } = useTranslation();

  const defaultValues = useMemo<FormValues>(() => {
    const name = `bitmap_${DateTime.local().toFormat('yyyy_LL_dd_HH_mm')}`;
    return { name, ids: [bitmapId] };
  }, [bitmapId]);

  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: FormValues) => {
    const entities = bitmaps.filter((it) => data.ids.includes(it.id));
    const blob = convertToBitmapFile(entities);
    const filename = `${data.name}.json`;
    FileSaver.saveAs(blob, filename);
    onClose();
  };

  return (
    <Modal title={t('Export bitmap')} onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <Input label={t('Filename')} {...register('name', { required: true, minLength: 1 })} />
          <SelectBitmap name={'ids' satisfies keyof FormValues} bitmaps={bitmaps} />
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              {t('Save as file')}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
