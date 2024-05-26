import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Range } from '@/components/Range';
import { CheckBox } from '@/components/CheckBox';
import { BitmapSizeAlert } from '@/components/BitmapSizeAlert';
import { defaultValues } from './constants';
import { FormValues } from './types';
import { useCallback, useEffect } from 'react';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useEditImage } from './hooks';
import { useTranslation } from 'react-i18next';

interface ImportFormProps {
  setBitmap: (value: Bitmap | null) => void;
  onSubmit: (data: FormValues) => void;
}

export const ImportForm = ({ setBitmap, onSubmit }: ImportFormProps) => {
  const { t } = useTranslation();
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
  });
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { isValid, isDirty },
  } = methods;
  const data = watch();
  const { width, height, threshold } = data;

  const {
    isReady,
    onReset,
    onClickAlignLeft,
    onClickAlignRight,
    onClickAlignHorizontal,
    onClickAlignTop,
    onClickAlignBottom,
    onClickAlignVertical,
    onClickFitToImage,
  } = useEditImage({ values: data, setBitmap, setValue });

  const handleReset = useCallback(() => {
    reset(defaultValues);
    onReset();
  }, [onReset, reset]);

  useEffect(() => {
    setValue('left', 0);
  }, [setValue, width]);

  useEffect(() => {
    setValue('top', 0);
  }, [setValue, height]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-50 d-flex flex-column gap-3">
        <div className="d-flex gap-3 align-items-center">
          <Input
            label={`${t('Image')} (*.jpg, *.png, *.svg)`}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            autoFocus
            {...register('files', { required: true })}
          />
          <Range
            label={`${t('Threshold')} = ${threshold}`}
            type="range"
            min={0}
            max={255}
            step={1}
            {...register('threshold', { required: true, valueAsNumber: true })}
          />
          <CheckBox label="Invert color" {...register('invertColor')} className="text-nowrap" />
        </div>
        <BitmapSizeAlert bitmapWidth={width} className="mb-3" />
        <div className="d-flex gap-3">
          <Input label={t('Top')} {...register('top', { required: true, valueAsNumber: true })} />
          <Input label={t('Left')} {...register('left', { required: true, valueAsNumber: true })} />
          <div className="d-flex flex-column">
            <div className="form-label">{t('Align')}</div>
            <div className="d-flex gap-3">
              <button type="button" className="btn p-0" title={t('Align left')} onClick={onClickAlignLeft}>
                <i className="bi bi-align-start h2" />
              </button>
              <button type="button" className="btn p-0" title={t('Align right')} onClick={onClickAlignRight}>
                <i className="bi bi-align-end h2" />
              </button>
              <button type="button" className="btn p-0" title={t('Align horizontal')} onClick={onClickAlignHorizontal}>
                <i className="bi bi-align-middle h2" />
              </button>
              <button type="button" className="btn p-0 p-0" title={t('Align top')} onClick={onClickAlignTop}>
                <i className="bi bi-align-top h2" />
              </button>
              <button type="button" className="btn p-0" title={t('Align bottom')} onClick={onClickAlignBottom}>
                <i className="bi bi-align-bottom h2" />
              </button>
              <button type="button" className="btn p-0" title={t('Align vertical')} onClick={onClickAlignVertical}>
                <i className="bi bi-align-center h2" />
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3">
          <Input label="Width" {...register('width', { required: true, valueAsNumber: true })} />
          <Input label="Height" {...register('height', { required: true, valueAsNumber: true })} />
          <div className="d-flex flex-column">
            <div className="form-label">{t('Crop')}</div>
            <div className="d-flex gap-3">
              <button type="button" className="btn p-0" title={t('Fit to image')} onClick={onClickFitToImage}>
                <i className="bi bi-aspect-ratio h2" />
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3 align-items-end">
          <Input label={t('Name')} {...register('name', { required: true })} className="flex-grow-1" />
          <button type="submit" className="btn btn-primary" disabled={!isValid || !isDirty || !isReady}>
            {t('Save')}
          </button>
          <button className="btn btn-secondary" onClick={handleReset} disabled={!isDirty}>
            {t('Reset')}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
