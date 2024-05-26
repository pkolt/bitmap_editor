import { CheckBox } from '@/components/CheckBox';
import { Input } from '@/components/Input';
import { GridSettings, useSettingsStore } from '@/stores/settings';
import { FormProvider, useForm } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

const validatorSize = (value: number) => {
  if (Number.isNaN(value)) {
    return 'Value must be a number';
  }
  if (value <= 0) {
    return 'The value must be greater than zero';
  }
  return undefined;
};

interface GridDialogProps {
  show: boolean;
  onClose: () => void;
}

type FormValues = GridSettings;

export const GridDialog = ({ show, onClose }: GridDialogProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { grid, setGrid } = useSettingsStore();
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: grid,
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
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Grid settings')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form id="grid-dialog" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <CheckBox label={t('Visible rows')} {...register('visibleRows')} />
            <Input
              label={t('Row size')}
              {...register('rowSize', { required: true, validate: validatorSize, valueAsNumber: true })}
            />
            <CheckBox label={t('Visible columns')} {...register('visibleColumns')} />
            <Input
              label={t('Column size')}
              {...register('columnSize', { required: true, validate: validatorSize, valueAsNumber: true })}
            />
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
