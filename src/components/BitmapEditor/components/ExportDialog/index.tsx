import { useBitmapsStore } from '@/stores/bitmaps';
import { DataFormat, Platform, SizeFormat, exportBitmap } from './utils';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CheckBox } from '@/components/CheckBox';
import { Input } from '@/components/Input';
import { BitOrder } from '@/utils/bitmap/types';
import { Area } from '@/utils/bitmap/Area';
import { requiredValue } from '@/utils/requiredValue';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

interface ExportDialogProps {
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
  bitOrder: BitOrder.MSB,
  sizeFormat: SizeFormat.Defines,
  dataFormat: DataFormat.Hex,
  platform: Platform.Arduino,
  progmem: true,
};

export const ExportDialog = ({ bitmapId, area, onClose }: ExportDialogProps): JSX.Element | null => {
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

  const onClickCopy = () => {
    navigator.clipboard.writeText(exportCode);
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Export bitmap')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(() => {})} className="d-flex flex-column gap-3 mb-3">
            <Alert variant="warning" dismissible>
              <div className="d-flex align-items-center gap-1">
                <i className="bi-exclamation-triangle" />
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
              <div className="text-nowrap">{t('Bit order')}</div>
              <div className="d-flex flex-wrap gap-3">
                <CheckBox
                  label="MSB-first"
                  value={BitOrder.MSB}
                  type="radio"
                  {...register('bitOrder', { required: true })}
                />
                <CheckBox
                  label="LSB-first"
                  value={BitOrder.LSB}
                  type="radio"
                  {...register('bitOrder', { required: true })}
                />
              </div>
            </div>
            <hr className="m-0" />
            <div className="d-flex gap-3">
              <div className="text-nowrap">{t('Data format')}</div>
              <div className="d-flex flex-wrap gap-3">
                <CheckBox
                  label="Hex"
                  value={DataFormat.Hex}
                  type="radio"
                  {...register('dataFormat', { required: true })}
                />
                <CheckBox
                  label="Bin"
                  value={DataFormat.Bin}
                  type="radio"
                  {...register('dataFormat', { required: true })}
                />
              </div>
            </div>
            {formValues.platform !== Platform.Pico && (
              <>
                <hr className="m-0" />
                <div className="d-flex gap-3">
                  <div className="text-nowrap">{t('Size format')}</div>
                  <div className="d-flex flex-wrap gap-3">
                    <CheckBox
                      label={t('Variables')}
                      value={SizeFormat.Variables}
                      type="radio"
                      {...register('sizeFormat', { required: true })}
                    />
                    <CheckBox
                      label={t('Comments')}
                      value={SizeFormat.Comments}
                      type="radio"
                      {...register('sizeFormat', { required: true })}
                    />
                    <CheckBox
                      label={t('Defines')}
                      value={SizeFormat.Defines}
                      type="radio"
                      {...register('sizeFormat', { required: true })}
                    />
                  </div>
                </div>
              </>
            )}
            <hr className="m-0" />
            <div className="d-flex gap-3">
              <div>{t('Platform')}</div>
              <CheckBox
                label={t('Arduino')}
                value={Platform.Arduino}
                type="radio"
                {...register('platform', { required: true })}
              />
              <CheckBox
                label={t('C language')}
                value={Platform.Clang}
                type="radio"
                {...register('platform', { required: true })}
              />
              <CheckBox
                label={t('RP Pico')}
                value={Platform.Pico}
                type="radio"
                {...register('platform', { required: true })}
              />
            </div>
            <hr className="m-0" />
            {formValues.platform !== Platform.Pico && (
              <CheckBox label={t('Include PROGMEM (AVR)')} {...register('progmem', { required: true })} />
            )}
            <textarea className="form-control" rows={10} value={exportCode} readOnly />
          </form>
        </FormProvider>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClickCopy}>{t('Copy to clipboard')}</Button>
      </Modal.Footer>
    </Modal>
  );
};
