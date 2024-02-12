import { Input } from '@/components/Input';
import { Modal, ModalRef } from '@/components/Modal';
import { Radio } from '@/components/Radio';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

enum LayoutAction {
  Add = 'add',
  Remove = 'remove',
}

enum LayoutPosition {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

interface FormData {
  action: LayoutAction;
  position: LayoutPosition;
  size: number;
}

interface LayoutDialogProps {
  onClose: () => void;
}

export const LayoutDialog = ({ onClose }: LayoutDialogProps): JSX.Element | null => {
  const refModal = useRef<ModalRef | null>(null);
  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {},
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: FormData) => {
    console.log(data);
    refModal.current?.close();
  };

  return (
    <Modal title="Change layout" onClose={onClose} ref={refModal}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
          <div className="d-flex gap-3">
            <div>Action:</div>
            <Radio label="Add" value={LayoutAction.Add} {...register('action', { required: true })} />
            <Radio label="Remove" value={LayoutAction.Remove} {...register('action', { required: true })} />
          </div>
          <hr className="m-0" />
          <div className="d-flex gap-3">
            <div>Position:</div>
            <Radio label="Top" value={LayoutPosition.Top} {...register('position', { required: true })} />
            <Radio label="Bottom" value={LayoutPosition.Bottom} {...register('position', { required: true })} />
            <Radio label="Left" value={LayoutPosition.Left} {...register('position', { required: true })} />
            <Radio label="Right" value={LayoutPosition.Right} {...register('position', { required: true })} />
          </div>
          <hr className="m-0" />
          <Input label="Size" {...register('size', { required: true, valueAsNumber: true, min: 1 })} />
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
