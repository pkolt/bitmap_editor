import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useSettingsStore } from '@/store/settings/useSettingsStore';
import { Coords, Sizes } from './types';
import {
  clearDisplay,
  drawBitmap,
  drawPointsBorders,
  drawGrid,
  getCanvasSize,
  drawArea,
  intersectionWithArea,
} from './utils';
import { AreaCoords } from '../types';

interface BitmapViewProps {
  bitmap: Bitmap;
  onChangeBitmap?: (bitmap: Bitmap) => void;
  eraser?: boolean;
  area?: boolean;
  selectedArea?: AreaCoords;
  onChangeSelectedArea?: (areaCoords: AreaCoords) => void;
}

export const BitmapView = ({
  bitmap,
  onChangeBitmap,
  eraser,
  area,
  selectedArea,
  onChangeSelectedArea,
}: BitmapViewProps): JSX.Element => {
  const { grid } = useSettingsStore();
  const [sizes, setSizes] = useState<Sizes | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const areaStart: Coords | null = selectedArea?.[0] ?? null;
  const areaEnd: Coords | null = selectedArea?.[1] ?? null;
  const isSelectingArea = area && (!areaStart || !areaEnd);
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
          const posX = Math.floor(x / (sizes.canvasWidth / sizes.bitmapWidth));
          const posY = Math.floor(y / (sizes.canvasHeight / sizes.bitmapHeight));

          if (area && (!areaStart || !areaEnd) && onChangeSelectedArea) {
            const nextCoords: AreaCoords = !areaStart ? [[posX, posY], null] : [areaStart, [posX, posY]];
            onChangeSelectedArea(nextCoords);
          } else {
            if (area && areaStart && areaEnd) {
              const isIntersect = intersectionWithArea([posX, posY], areaStart, areaEnd);
              if (isIntersect) {
                const nextBitmap = bitmap.clone();
                nextBitmap.setPixelByCoords(posX, posY, !eraser);
                onChangeBitmap(nextBitmap);
              }
            } else {
              const nextBitmap = bitmap.clone();
              nextBitmap.setPixelByCoords(posX, posY, !eraser);
              onChangeBitmap(nextBitmap);
            }
          }
        }
      }
    },
    [canvas, sizes, onChangeBitmap, area, areaStart, areaEnd, bitmap, eraser, onChangeSelectedArea],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isSelectingArea && (event.buttons || event.ctrlKey)) {
        handleClick(event);
      }
    },
    [handleClick, isSelectingArea],
  );

  useEffect(() => {
    if (!ctx || !sizes) {
      return;
    }

    clearDisplay(ctx, sizes);
    drawBitmap(ctx, bitmap);
    drawPointsBorders(ctx, sizes);
    drawGrid(ctx, sizes, grid);
    drawArea(ctx, sizes, !!area, selectedArea);
  }, [area, areaStart, areaEnd, bitmap, ctx, grid, sizes, selectedArea]);

  return <canvas ref={setCanvasRef} className={styles.container} onClick={handleClick} onMouseMove={handleMouseMove} />;
};
