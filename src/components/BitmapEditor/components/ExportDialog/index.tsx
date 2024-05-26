import { useBitmapsStore } from '@/stores/bitmaps';
import { DataFormat, Platform, SizeFormat, exportBitmap } from './utils';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CheckBox } from '@/components/CheckBox';
import { Radio } from '@/components/Radio';
import { Input } from '@/components/Input';
import { BitOrder } from '@/utils/bitmap/types';
import { Area } from '@/utils/bitmap/Area';
import { requiredValue } from '@/utils/requiredValue';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

interface ExportDialogProps {
  show: boolean;
  bitmapId: string;
  area?: Area;
  onClose: () => void;
}

interface FormValues {
  name: string;
  bitOrder: BitOrder;
  sizeFormat: SizeFormat;
  dataFormat: DataFormat;
  platform: Platform;
  progmem: boolean;
}

const defaultValues: FormValues = {
  name: '',
  bitOrder: BitOrder.BigEndian,
  sizeFormat: SizeFormat.Defines,
  dataFormat: DataFormat.Hex,
  platform: Platform.Arduino,
  progmem: true,
};

export const ExportDialog = ({ show, bitmapId, area, onClose }: ExportDialogProps): JSX.Element | null => {
  const { t } = useTranslation();
  const { findBitmap: findBitmap } = useBitmapsStore();
  const bitmapEntity = requiredValue(findBitmap(bitmapId));

  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { ...defaultValues, name: bitmapEntity?.name ?? '' },
  });

  const { register, handleSubmit, watch } = methods;

  const formValues = watch();
  const exportCode = useMemo<string>(
    () => (bitmapEntity ? exportBitmap({ bitmapEntity, area, ...formValues }) : ''),
    [area, bitmapEntity, formValues],
  );

  const onSubmit = useCallback(() => {
    navigator.clipboard.writeText(exportCode);
  }, [exportCode]);

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Export bitmap')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form id="export-dialog" onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3 mb-3">
            <Alert variant="warning" dismissible>
              <div className="d-flex align-items-center gap-1">
                <i className="bi bi-exclamation-triangle" />
                <div>
                  Exported image as{' '}
                  <a href="https://en.wikipedia.org/wiki/X_BitMap" target="_blank" rel="noreferrer">
                    X BitMap format
                  </a>
                </div>
              </div>
            </Alert>
            <Input label={t('Name')} {...register('name', { required: true })} />
            <div className="d-flex gap-3">
              <div>{t('Bit order')}</div>
              <Radio
                label="Big-endian (U8g2)"
                value={BitOrder.BigEndian}
                {...register('bitOrder', { required: true })}
              />
              <Radio
                label="Little-endian (Adafruit)"
                value={BitOrder.LittleEndian}
                {...register('bitOrder', { required: true })}
              />
            </div>
            <hr className="m-0" />
            <div className="d-flex gap-3">
              <div>{t('Data format')}</div>
              <Radio label="Hex" value={DataFormat.Hex} {...register('dataFormat', { required: true })} />
              <Radio label="Bin" value={DataFormat.Bin} {...register('dataFormat', { required: true })} />
            </div>
            <hr className="m-0" />
            <div className="d-flex gap-3">
              <div>{t('Size format')}</div>
              <Radio
                label={t('Variables')}
                value={SizeFormat.Variables}
                {...register('sizeFormat', { required: true })}
              />
              <Radio
                label={t('Comments')}
                value={SizeFormat.Comments}
                {...register('sizeFormat', { required: true })}
              />
              <Radio label={t('Defines')} value={SizeFormat.Defines} {...register('sizeFormat', { required: true })} />
            </div>
            <hr className="m-0" />
            <div className="d-flex gap-3">
              <div>{t('Platform')}</div>
              <Radio label={t('Arduino')} value={Platform.Arduino} {...register('platform', { required: true })} />
              <Radio label={t('C language')} value={Platform.Clang} {...register('platform', { required: true })} />
            </div>
            <hr className="m-0" />
            <CheckBox label={t('Include PROGMEM (AVR)')} {...register('progmem', { required: true })} />
            <textarea className="form-control" rows={10} value={exportCode} readOnly />
          </form>
        </FormProvider>
      </Modal.Body>

      <Modal.Footer>
        <Button type="submit" form="export-dialog">
          {t('Copy to clipboard')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
