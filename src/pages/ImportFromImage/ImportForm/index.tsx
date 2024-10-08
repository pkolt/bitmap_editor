import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Range } from '@/components/Range';
import { CheckBox } from '@/components/CheckBox';
import { BitmapSizeAlert } from '@/components/BitmapSizeAlert';
import { defaultValues } from './constants';
import { FormValues } from './types';
import { useCallback, useEffect } from 'react';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useEditImage } from './hooks/useEditImage';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './schema';
import { useImageUrl } from './hooks/useImageUrl';

const ID_FILE_INPUT = 'id_file_input'; // Simple way that use two ref

interface ImportFormProps {
  setBitmap: (value: Bitmap | null) => void;
  onSubmit: (data: FormValues) => void;
  imageUrl?: string;
}

export const ImportForm = ({ setBitmap, onSubmit, imageUrl }: ImportFormProps) => {
  const { t } = useTranslation();
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(formSchema),
  });
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { isValid, isDirty },
    setFocus,
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

  const setImage = useCallback(
    (files: FileList, name: string) => {
      const elem = document.getElementById(ID_FILE_INPUT);
      if (elem) {
        setValue('files', files);
        (elem as HTMLInputElement).files = files;
        setValue('name', name);
        setFocus('name');
      }
    },
    [setValue, setFocus],
  );

  useImageUrl({ imageUrl, setImage });

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
            id={ID_FILE_INPUT}
            {...register('files', { required: true })}
          />
          <Range
            label={`${t('Threshold')} = ${threshold}`}
            min={1}
            max={255}
            step={1}
            {...register('threshold', { valueAsNumber: true })}
          />
          <CheckBox label={t('Invert color')} {...register('invertColor')} className="text-nowrap" />
        </div>
        <BitmapSizeAlert bitmapWidth={width} className="mb-3" />
        <div className="d-flex gap-3">
          <Input label={t('Top')} {...register('top', { valueAsNumber: true })} />
          <Input label={t('Left')} {...register('left', { valueAsNumber: true })} />
          <div className="d-flex flex-column">
            <div className="form-label">{t('Align')}</div>
            <div className="d-flex gap-2">
              <Button variant="light" className="p-0" title={t('Align left')} onClick={onClickAlignLeft}>
                <i className="bi-align-start h2 mx-2" />
              </Button>
              <Button variant="light" className="p-0" title={t('Align right')} onClick={onClickAlignRight}>
                <i className="bi-align-end h2 mx-2" />
              </Button>
              <Button variant="light" className="p-0" title={t('Align horizontal')} onClick={onClickAlignHorizontal}>
                <i className="bi-align-middle h2 mx-2" />
              </Button>
              <Button variant="light" className="p-0 p-0" title={t('Align top')} onClick={onClickAlignTop}>
                <i className="bi-align-top h2 mx-2" />
              </Button>
              <Button variant="light" className="p-0" title={t('Align bottom')} onClick={onClickAlignBottom}>
                <i className="bi-align-bottom h2 mx-2" />
              </Button>
              <Button variant="light" className="p-0" title={t('Align vertical')} onClick={onClickAlignVertical}>
                <i className="bi-align-center h2 mx-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3">
          <Input label={t('Width')} {...register('width', { valueAsNumber: true })} />
          <Input label={t('Height')} {...register('height', { valueAsNumber: true })} />
          <div className="d-flex flex-column">
            <div className="form-label">{t('Crop')}</div>
            <div className="d-flex gap-3">
              <Button variant="light" className="p-0" title={t('Fit to image')} onClick={onClickFitToImage}>
                <i className="bi-aspect-ratio h2 mx-2" />
              </Button>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3 align-items-end">
          <Input label={t('Name')} {...register('name', { required: true })} className="flex-grow-1" />
          <Button type="submit" disabled={!isValid || !isDirty || !isReady}>
            {t('Save')}
          </Button>
          <Button variant="secondary" onClick={handleReset} disabled={!isDirty}>
            {t('Reset')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
