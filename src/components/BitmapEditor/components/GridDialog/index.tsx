import { CheckBox } from '@/components/CheckBox';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { GridSettings, useSettingsStore } from '@/stores/settings';
import { FormProvider, useForm } from 'react-hook-form';

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
  onClose: () => void;
}

type FormValues = GridSettings;

export const GridDialog = ({ onClose }: GridDialogProps): JSX.Element | null => {
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
  };

  return (
    <Modal title="Grid settings" onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <CheckBox label="Visible rows" {...register('visibleRows')} />
          <Input
            label="Row size:"
            {...register('rowSize', { required: true, validate: validatorSize, valueAsNumber: true })}
          />
          <CheckBox label="Visible columns" {...register('visibleColumns')} />
          <Input
            label="Column size:"
            {...register('columnSize', { required: true, validate: validatorSize, valueAsNumber: true })}
          />
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
