import { v4 as uuidv4 } from 'uuid';
import { Page } from '@/components/Page';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Range } from '@/components/Range';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bitmap } from '@/utils/bitmap';
import { BitmapEditor } from '@/components/Editor/BitmapEditor';
import { convertCanvasToBitmap, scaleImage } from './utils';
import { BitmapEntity } from '@/types/bitmap';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { PageUrl } from '@/constants/urls';
import { CheckBox } from '@/components/CheckBox';

enum Step {
  First,
  Second,
}

interface FormData {
  files: FileList | null;
  name: string;
  top: number;
  left: number;
  width: number;
  height: number;
  threshold: number;
  invertColor: boolean;
}

const defaultValues: FormData = {
  files: null,
  top: 0,
  left: 0,
  width: 128,
  height: 64,
  threshold: 100,
  name: '',
  invertColor: false,
};

const ImportBitmap = () => {
  const navigate = useNavigate();
  const { addBitmap } = useBitmapStore();

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { isValid },
  } = methods;

  const onSubmit = (data: FormData) => {
    const id = uuidv4();
    const timestamp = DateTime.now().toMillis();

    const image: BitmapEntity = {
      id,
      name: data.name,
      width: data.width,
      height: data.height,
      data: bitmap.toJSON(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    addBitmap(image);

    navigate(PageUrl.EditBitmap.replace(':id', id), { replace: true });
  };

  const { files, top, left, width, height, threshold, invertColor } = watch();

  const [step, setStep] = useState(Step.First);
  const [bitmap, setBitmap] = useState(new Bitmap(1, 1));
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [canvas] = useState(document.createElement('canvas'));
  const [canvasCtx] = useState<CanvasRenderingContext2D | null>(canvas.getContext('2d'));

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

  useEffect(() => {
    setValue('left', 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  useEffect(() => {
    setValue('top', 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  useEffect(() => {
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        setImage(image);
      };
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
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.drawImage(image, left, top, scaledWidth, scaledHeight);
    const bitmapFromImage = convertCanvasToBitmap(canvas, canvasCtx, threshold, invertColor);
    if (bitmapFromImage) {
      setBitmap(bitmapFromImage);
    }
  }, [canvas, canvasCtx, height, image, invertColor, left, scaledHeight, scaledWidth, threshold, top, width]);

  return (
    <Page title="Import bitmap from image">
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center gap-3">
        <h1>Import bitmap from image</h1>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-50 d-flex flex-column gap-3">
            {step === Step.First && (
              <>
                <Input
                  label="Image (*.jpg, *.png)"
                  type="file"
                  accept="image/png, image/jpeg"
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
                <CheckBox label="Invert color" {...register('invertColor')} />
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!image}
                    onClick={() => setStep(Step.Second)}>
                    Next
                  </button>
                </div>
              </>
            )}
            {step === Step.Second && (
              <>
                <Input label="Name" autoFocus {...register('name', { required: true })} />
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
                      <button
                        type="button"
                        className="btn p-0"
                        title="Align horizontal"
                        onClick={handleClickAlignHorizontal}>
                        <i className="bi bi-align-middle h2" />
                      </button>
                      <button type="button" className="btn p-0 p-0" title="Align top" onClick={handleClickAlignTop}>
                        <i className="bi bi-align-top h2" />
                      </button>
                      <button type="button" className="btn p-0" title="Align bottom" onClick={handleClickAlignBottom}>
                        <i className="bi bi-align-bottom h2" />
                      </button>
                      <button
                        type="button"
                        className="btn p-0"
                        title="Align vertical"
                        onClick={handleClickAlignVertical}>
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
                <div className="d-flex align-items-center gap-3"></div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary" disabled={!isValid}>
                    Save
                  </button>
                </div>
              </>
            )}
          </form>
        </FormProvider>
        {image && <BitmapEditor bitmap={bitmap} onChangeBitmap={() => {}} eraser={false} />}
      </main>
    </Page>
  );
};

export default ImportBitmap;
