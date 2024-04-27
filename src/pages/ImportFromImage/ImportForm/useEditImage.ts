import { useCallback, useEffect, useMemo, useState } from 'react';
import { ImportFormData } from './types';
import { convertCanvasToBitmap, scaleImage } from './utils';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { UseFormSetValue } from 'react-hook-form';

interface EditImageHookParams {
  data: ImportFormData;
  setBitmap: (value: Bitmap | null) => void;
  setFormValue: UseFormSetValue<ImportFormData>;
}

interface EditImageHookResult {
  onReset: () => void;
  onClickAlignLeft: () => void;
  onClickAlignRight: () => void;
  onClickAlignHorizontal: () => void;
  onClickAlignTop: () => void;
  onClickAlignBottom: () => void;
  onClickAlignVertical: () => void;
  onClickFitToImage: () => void;
}

export const useEditImage = ({ data, setBitmap, setFormValue }: EditImageHookParams): EditImageHookResult => {
  const [canvas] = useState(document.createElement('canvas'));
  const [canvasCtx] = useState<CanvasRenderingContext2D | null>(canvas.getContext('2d', { willReadFrequently: true }));
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const { files, top, left, width, height, threshold, invertColor } = data;

  const { scaledWidth, scaledHeight } = useMemo(() => {
    if (image) {
      return scaleImage(width, height, image.width, image.height);
    }
    return { scaledWidth: width, scaledHeight: height };
  }, [height, image, width]);

  const onClickAlignLeft = useCallback(() => {
    setFormValue('left', 0);
  }, [setFormValue]);

  const onClickAlignRight = useCallback(() => {
    const freeSpace = width - scaledWidth;
    if (freeSpace > 0) {
      setFormValue('left', freeSpace);
    }
  }, [scaledWidth, setFormValue, width]);

  const onClickAlignHorizontal = useCallback(() => {
    if (!image) {
      return;
    }
    const freeSpace = width - scaledWidth;
    if (freeSpace > 0) {
      setFormValue('left', Math.floor(freeSpace / 2));
    }
  }, [image, scaledWidth, setFormValue, width]);

  const onClickAlignTop = useCallback(() => {
    setFormValue('top', 0);
  }, [setFormValue]);

  const onClickAlignBottom = useCallback(() => {
    if (!image) {
      return;
    }
    const freeSpace = height - scaledHeight;
    if (freeSpace > 0) {
      setFormValue('top', freeSpace);
    }
  }, [height, image, scaledHeight, setFormValue]);

  const onClickAlignVertical = useCallback(() => {
    if (!image) {
      return;
    }
    const freeSpace = height - scaledHeight;
    if (freeSpace > 0) {
      setFormValue('top', Math.floor(freeSpace / 2));
    }
  }, [height, image, scaledHeight, setFormValue]);

  const onClickFitToImage = useCallback(() => {
    setFormValue('width', scaledWidth);
    setFormValue('height', scaledHeight);
  }, [scaledHeight, scaledWidth, setFormValue]);

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
