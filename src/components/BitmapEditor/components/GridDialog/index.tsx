import { CheckBox } from '@/components/CheckBox';
import { Input } from '@/components/Input';
import { useSettingsStore } from '@/stores/settings';
import { FormProvider, useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  rowSize: z.number().positive(),
  columnSize: z.number().positive(),
  visibleRows: z.boolean(),
  visibleColumns: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface GridDialogProps {
  onClose: () => void;
}

export const GridDialog = ({ onClose }: GridDialogProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { grid, setGrid } = useSettingsStore();
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: grid,
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: FormValues) => {
    setGrid(data);
    onClose();
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Grid settings')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form id="grid-dialog" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <CheckBox label={t('Visible rows')} {...register('visibleRows')} />
            <Input label={t('Row size')} {...register('rowSize', { valueAsNumber: true })} />
            <CheckBox label={t('Visible columns')} {...register('visibleColumns')} />
            <Input label={t('Column size')} {...register('columnSize', { valueAsNumber: true })} />
          </form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="grid-dialog" disabled={!isValid}>
          {t('Save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
