import { DateTime } from 'luxon';
import FileSaver from 'file-saver';
import { useBitmapsStore } from '@/stores/bitmaps';
import { FormProvider, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { convertToBitmapFile } from '@/utils/bitmap/file';
import { Input } from '@/components/Input';
import { SelectBitmap } from '@/components/SelectBitmap';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().trim().min(1),
  ids: z.array(z.string().uuid()),
});

type FormValues = z.infer<typeof formSchema>;

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
    resolver: zodResolver(formSchema),
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
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Export bitmap')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form id="export-bitmap-dialog" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <Input label={t('Filename')} {...register('name')} />
            <SelectBitmap name={'ids' satisfies keyof FormValues} bitmaps={bitmaps} />
          </form>
        </FormProvider>
      </Modal.Body>

      <Modal.Footer>
        <Button form="export-bitmap-dialog" type="submit" disabled={!isValid}>
          {t('Save as file')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
