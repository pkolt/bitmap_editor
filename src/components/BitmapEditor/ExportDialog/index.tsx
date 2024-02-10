import { Modal } from '@/components/Modal';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { DataFormat, Platform, SizeFormat, exportBitmap } from '../utils/exportBitmap';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CheckBox } from '@/components/CheckBox';
import { Radio } from '@/components/Radio';
import { Alert } from '@/components/Alert';
import { Input } from '@/components/Input';
import { BitOrder } from '@/utils/bitmap';

interface ExportDialogProps {
  bitmapId: string;
  onClose: () => void;
}

interface FormData {
  name: string;
  bitOrder: BitOrder;
  sizeFormat: SizeFormat;
  dataFormat: DataFormat;
  platform: Platform;
  progmem: boolean;
}

const defaultValues: FormData = {
  name: '',
  bitOrder: BitOrder.BigEndian,
  sizeFormat: SizeFormat.Variables,
  dataFormat: DataFormat.Hex,
  platform: Platform.Arduino,
  progmem: true,
};

export const ExportDialog = ({ bitmapId, onClose }: ExportDialogProps): JSX.Element | null => {
  const { findBitmap: findBitmap } = useBitmapStore();
  const bitmapEntity = findBitmap(bitmapId);

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { ...defaultValues, name: bitmapEntity?.name ?? '' },
  });

  const { register, handleSubmit, watch } = methods;

  const formData = watch();
  const exportCode = useMemo<string>(
    () => (bitmapEntity ? exportBitmap({ entity: bitmapEntity, ...formData }) : ''),
    [bitmapEntity, formData],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(exportCode);
  };

  if (!bitmapEntity) {
    return null;
  }
  return (
    <Modal title="Export bitmap" onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(() => {})} className="d-flex flex-column gap-3 mb-3">
          <Alert type="warning">
            <div className="d-flex align-items-center gap-1">
              <i className="bi bi-exclamation-triangle" />
              <div>
                Exported image as{' '}
                <a href="https://en.wikipedia.org/wiki/X_BitMap" target="_blank">
                  X BitMap format
                </a>
              </div>
            </div>
          </Alert>
          <Input label="Name:" {...register('name', { required: true })} />
          <div className="d-flex gap-3">
            <div>Bit order:</div>
            <Radio label="Big-endian (U8g2)" value={BitOrder.BigEndian} {...register('bitOrder', { required: true })} />
            <Radio
              label="Little-endian (Adafruit)"
              value={BitOrder.LittleEndian}
              {...register('bitOrder', { required: true })}
            />
          </div>
          <hr className="m-0" />
          <div className="d-flex gap-3">
            <div>Data format:</div>
            <Radio label="Hex" value={DataFormat.Hex} {...register('dataFormat', { required: true })} />
            <Radio label="Bin" value={DataFormat.Bin} {...register('dataFormat', { required: true })} />
          </div>
          <hr className="m-0" />
          <div className="d-flex gap-3">
            <div>Size format:</div>
            <Radio label="Variables" value={SizeFormat.Variables} {...register('sizeFormat', { required: true })} />
            <Radio label="Comments" value={SizeFormat.Comments} {...register('sizeFormat', { required: true })} />
            <Radio label="Defines" value={SizeFormat.Defines} {...register('sizeFormat', { required: true })} />
          </div>
          <hr className="m-0" />
          <div className="d-flex gap-3">
            <div>Platform:</div>
            <Radio label="Arduino" value={Platform.Arduino} {...register('platform', { required: true })} />
            <Radio label="C language" value={Platform.Clang} {...register('platform', { required: true })} />
          </div>
          <hr className="m-0" />
          <CheckBox label="Include PROGMEM (AVR)" {...register('progmem', { required: true })} />
          <textarea className="form-control" rows={10} value={exportCode} readOnly />
        </form>
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary" onClick={handleCopy}>
            Copy to clipboard
          </button>
        </div>
      </FormProvider>
    </Modal>
  );
};
