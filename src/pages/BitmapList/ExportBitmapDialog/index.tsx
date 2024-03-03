import { DateTime } from 'luxon';
import FileSaver from 'file-saver';
import { Modal } from '@/components/Modal';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { FormProvider, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { CheckBox } from '@/components/CheckBox';
import { convertToBitmapFile } from '@/utils/bitmap/file';
import { Input } from '@/components/Input';

interface FormData {
  name: string;
  ids: string[];
}

interface ExportBitmapDialogProps {
  bitmapId: string;
  onClose: () => void;
}

export const ExportBitmapDialog = ({ bitmapId, onClose }: ExportBitmapDialogProps): JSX.Element | null => {
  const { findBitmap, bitmaps } = useBitmapStore();
  const bitmapEntity = findBitmap(bitmapId);

  const defaultValues = useMemo<FormData>(() => {
    const name = `bitmap_${DateTime.now().toFormat('yyyy_LL_dd_HH_mm')}`;
    return { name, ids: [bitmapId] };
  }, [bitmapId]);

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: FormData) => {
    const entities = bitmaps.filter((it) => data.ids.includes(it.id));
    const blob = convertToBitmapFile(entities);
    const filename = `${data.name}.json`;
    FileSaver.saveAs(blob, filename);
    onClose();
  };

  if (!bitmapEntity) {
    return null;
  }

  return (
    <Modal title="Export bitmap" onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <Input label="Filename" {...register('name', { required: true, minLength: 1 })} />
          <div>
            {bitmaps.map((it) => (
              <CheckBox
                key={it.id}
                label={`${it.name} (${it.width}x${it.height})`}
                value={it.id}
                {...register('ids', { required: true })}
              />
            ))}
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              Save as file
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
