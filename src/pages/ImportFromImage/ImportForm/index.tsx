import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Range } from '@/components/Range';
import { CheckBox } from '@/components/CheckBox';
import { BitmapSizeAlert } from '@/components/BitmapSizeAlert';
import { defaultValues } from './constants';
import { ImportFormData } from './types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { convertCanvasToBitmap, scaleImage } from './utils';
import { Bitmap } from '@/utils/bitmap/Bitmap';

interface ImportFormProps {
  onChangeBitmap: (value: Bitmap | null) => void;
  onSubmit: (data: ImportFormData) => void;
}

export const ImportForm = ({ onChangeBitmap, onSubmit }: ImportFormProps) => {
  const [canvas] = useState(document.createElement('canvas'));
  const [canvasCtx] = useState<CanvasRenderingContext2D | null>(canvas.getContext('2d', { willReadFrequently: true }));
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const methods = useForm<ImportFormData>({
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

  const { files, top, left, width, height, threshold, invertColor } = watch();

  useEffect(() => {
    setValue('left', 0);
  }, [setValue, width]);

  useEffect(() => {
    setValue('top', 0);
  }, [setValue, height]);

  const { scaledWidth, scaledHeight } = useMemo(() => {
    if (image) {
      return scaleImage(width, height, image.width, image.height);
    }
    return { scaledWidth: width, scaledHeight: height };
  }, [height, image, width]);

  const handleClickAlignLeft = useCallback(() => {
    setValue('left', 0);
  }, [setValue]);

  const handleClickAlignRight = useCallback(() => {
    const freeSpace = width - scaledWidth;
    if (freeSpace > 0) {
      setValue('left', freeSpace);
    }
  }, [scaledWidth, setValue, width]);

  const handleClickAlignHorizontal = useCallback(() => {
    if (!image) {
      return;
    }
    const freeSpace = width - scaledWidth;
    if (freeSpace > 0) {
      setValue('left', Math.floor(freeSpace / 2));
    }
  }, [image, scaledWidth, setValue, width]);

  const handleClickAlignTop = useCallback(() => {
    setValue('top', 0);
  }, [setValue]);

  const handleClickAlignBottom = useCallback(() => {
    if (!image) {
      return;
    }
    const freeSpace = height - scaledHeight;
    if (freeSpace > 0) {
      setValue('top', freeSpace);
    }
  }, [height, image, scaledHeight, setValue]);

  const handleClickAlignVertical = useCallback(() => {
    if (!image) {
      return;
    }
    const freeSpace = height - scaledHeight;
    if (freeSpace > 0) {
      setValue('top', Math.floor(freeSpace / 2));
    }
  }, [height, image, scaledHeight, setValue]);

  const handleClickFitToImage = useCallback(() => {
    setValue('width', scaledWidth);
    setValue('height', scaledHeight);
  }, [scaledHeight, scaledWidth, setValue]);

  const handleReset = useCallback(() => {
    reset(defaultValues);
    onChangeBitmap(null);
    setImage(null);
  }, [onChangeBitmap, reset]);

  useEffect(() => {
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => setImage(image);
    };
    reader.readAsDataURL(file);
  }, [files]);

  useEffect(() => {
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
    }
  }, [canvas, height, width]);

  useEffect(() => {
    if (!canvasCtx || !image) {
      return;
    }
    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.drawImage(image, left, top, scaledWidth, scaledHeight);
    const bitmapFromImage = convertCanvasToBitmap(canvas, canvasCtx, threshold, invertColor);
    onChangeBitmap(bitmapFromImage);
  }, [
    canvas,
    canvasCtx,
    height,
    image,
    invertColor,
    left,
    onChangeBitmap,
    scaledHeight,
    scaledWidth,
    threshold,
    top,
    width,
  ]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-50 d-flex flex-column gap-3">
        <div className="d-flex gap-3 align-items-center">
          <Input
            label="Image (*.jpg, *.png, *.svg)"
            type="file"
            accept="image/png, image/jpeg, image/svg+xml"
            autoFocus
            {...register('files', { required: true })}
          />
          <Range
            label={`Threshold = ${threshold}`}
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
          <Input label="Top" {...register('top', { required: true, valueAsNumber: true })} />
          <Input label="Left" {...register('left', { required: true, valueAsNumber: true })} />
          <div className="d-flex flex-column">
            <div className="form-label">Align:</div>
            <div className="d-flex gap-3">
              <button type="button" className="btn p-0" title="Align left" onClick={handleClickAlignLeft}>
                <i className="bi bi-align-start h2" />
              </button>
              <button type="button" className="btn p-0" title="Align right" onClick={handleClickAlignRight}>
                <i className="bi bi-align-end h2" />
              </button>
              <button type="button" className="btn p-0" title="Align horizontal" onClick={handleClickAlignHorizontal}>
                <i className="bi bi-align-middle h2" />
              </button>
              <button type="button" className="btn p-0 p-0" title="Align top" onClick={handleClickAlignTop}>
                <i className="bi bi-align-top h2" />
              </button>
              <button type="button" className="btn p-0" title="Align bottom" onClick={handleClickAlignBottom}>
                <i className="bi bi-align-bottom h2" />
              </button>
              <button type="button" className="btn p-0" title="Align vertical" onClick={handleClickAlignVertical}>
                <i className="bi bi-align-center h2" />
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3">
          <Input label="Width" {...register('width', { required: true, valueAsNumber: true })} />
          <Input label="Height" {...register('height', { required: true, valueAsNumber: true })} />
          <div className="d-flex flex-column">
            <div className="form-label">Crop:</div>
            <div className="d-flex gap-3">
              <button type="button" className="btn p-0" title="Fit to image" onClick={handleClickFitToImage}>
                <i className="bi bi-aspect-ratio h2" />
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex gap-3 align-items-end">
          <Input label="Name" {...register('name', { required: true })} className="flex-grow-1" />
          <button type="submit" className="btn btn-primary" disabled={!isValid || !isDirty}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleReset} disabled={!isDirty}>
            Reset
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
