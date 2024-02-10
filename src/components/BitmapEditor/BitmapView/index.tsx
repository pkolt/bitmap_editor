import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { Bitmap } from '@/utils/bitmap';
import { useSettingsStore } from '@/store/settings/useSettingsStore';
import { Sizes } from './types';
import { clearDisplay, drawBitmap, drawPointsBorders, drawGrid, getCanvasSize } from './utils';

interface BitmapViewProps {
  bitmap: Bitmap;
  onChangeBitmap?: (bitmap: Bitmap) => void;
  eraser?: boolean;
}

export const BitmapView = ({ bitmap, onChangeBitmap, eraser }: BitmapViewProps): JSX.Element => {
  const { grid } = useSettingsStore();
  const [sizes, setSizes] = useState<Sizes | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const bitmapWidth = bitmap.width;
  const bitmapHeight = bitmap.height;

  const setCanvasRef = useCallback(
    (elem: HTMLCanvasElement | null) => {
      if (elem) {
        const canvasWidth = getCanvasSize(bitmapWidth);
        const canvasHeight = getCanvasSize(bitmapHeight);
        elem.width = canvasWidth;
        elem.height = canvasHeight;
        setSizes({ canvasWidth, canvasHeight, bitmapWidth, bitmapHeight });
        setCtx(elem.getContext('2d'));
        setCanvas(elem);
      } else {
        setSizes(null);
        setCtx(null);
        setCanvas(null);
      }
    },
    [bitmapHeight, bitmapWidth],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (canvas && sizes && onChangeBitmap) {
        const { left, top } = canvas.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;
        if (x >= 0 && y >= 0) {
          const bitmapX = Math.floor(x / (sizes.canvasWidth / sizes.bitmapWidth));
          const bitmapY = Math.floor(y / (sizes.canvasHeight / sizes.bitmapHeight));
          const nextBitmap = bitmap.clone();
          nextBitmap.setByCoords(bitmapX, bitmapY, !eraser);
          onChangeBitmap(nextBitmap);
        }
      }
    },
    [bitmap, canvas, eraser, onChangeBitmap, sizes],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (event.buttons || event.ctrlKey) {
        handleClick(event);
      }
    },
    [handleClick],
  );

  useEffect(() => {
    if (!ctx || !sizes) {
      return;
    }

    clearDisplay(ctx, sizes);
    drawBitmap(ctx, bitmap);
    drawPointsBorders(ctx, sizes);
    drawGrid(ctx, sizes, grid);
  }, [bitmap, ctx, grid, sizes]);

  return <canvas ref={setCanvasRef} className={styles.container} onClick={handleClick} onMouseMove={handleMouseMove} />;
};
