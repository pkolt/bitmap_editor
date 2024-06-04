import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormValues } from '../types';
import { convertCanvasToBitmap, scaleImage } from '../utils';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { UseFormSetValue } from 'react-hook-form';
import { createCanvas } from '../createCanvas';

interface EditImageHookParams {
  values: FormValues;
  setValue: UseFormSetValue<FormValues>;
  setBitmap: (value: Bitmap | null) => void;
}

interface EditImageHookResult {
  isReady: boolean;
  onReset: () => void;
  onClickAlignLeft: () => void;
  onClickAlignRight: () => void;
  onClickAlignHorizontal: () => void;
  onClickAlignTop: () => void;
  onClickAlignBottom: () => void;
  onClickAlignVertical: () => void;
  onClickFitToImage: () => void;
}

export const useEditImage = ({ values, setValue, setBitmap }: EditImageHookParams): EditImageHookResult => {
  const [canvas] = useState(createCanvas());
  const [canvasCtx] = useState(canvas.getContext('2d', { willReadFrequently: true }));
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const isReady = !!image;

  const { files, top, left, width, height, threshold, invertColor } = values;

  const { scaledWidth, scaledHeight } = useMemo(() => {
    if (image) {
      return scaleImage(width, height, image.width, image.height);
    }
    return { scaledWidth: width, scaledHeight: height };
  }, [height, image, width]);

  const onClickAlignLeft = useCallback(() => {
    setValue('left', 0);
  }, [setValue]);

  const onClickAlignRight = useCallback(() => {
    const freeSpace = width - scaledWidth;
    if (freeSpace > 0) {
      setValue('left', freeSpace);
    }
  }, [scaledWidth, setValue, width]);

  const onClickAlignHorizontal = useCallback(() => {
    if (!image) {
      return;
    }
    const freeSpace = width - scaledWidth;
    if (freeSpace > 0) {
      setValue('left', Math.floor(freeSpace / 2));
    }
  }, [image, scaledWidth, setValue, width]);

  const onClickAlignTop = useCallback(() => {
    setValue('top', 0);
  }, [setValue]);

  const onClickAlignBottom = useCallback(() => {
    if (!image) {
      return;
    }
    const freeSpace = height - scaledHeight;
    if (freeSpace > 0) {
      setValue('top', freeSpace);
    }
  }, [height, image, scaledHeight, setValue]);

  const onClickAlignVertical = useCallback(() => {
    if (!image) {
      return;
    }
    const freeSpace = height - scaledHeight;
    if (freeSpace > 0) {
      setValue('top', Math.floor(freeSpace / 2));
    }
  }, [height, image, scaledHeight, setValue]);

  const onClickFitToImage = useCallback(() => {
    setValue('width', scaledWidth);
    setValue('height', scaledHeight);
  }, [scaledHeight, scaledWidth, setValue]);

  const onReset = useCallback(() => {
    setBitmap(null);
    setImage(null);
  }, [setBitmap]);

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
    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.drawImage(image, left, top, scaledWidth, scaledHeight);
    const bitmapFromImage = convertCanvasToBitmap(canvas, canvasCtx, threshold, invertColor);
    setBitmap(bitmapFromImage);
  }, [
    canvas,
    canvasCtx,
    height,
    image,
    invertColor,
    left,
    setBitmap,
    scaledHeight,
    scaledWidth,
    threshold,
    top,
    width,
  ]);

  return {
    isReady,
    onReset,
    onClickAlignLeft,
    onClickAlignRight,
    onClickAlignHorizontal,
    onClickAlignTop,
    onClickAlignBottom,
    onClickAlignVertical,
    onClickFitToImage,
  };
};
