import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useSettingsStore } from '@/stores/settings';
import { Sizes } from './types';
import { clearDisplay, drawBitmap, drawPointsBorders, drawGrid, getSizeByBitmap, drawArea } from './utils';
import { BitmapArea } from '../../types';
import { Point } from '@/utils/bitmap/Point';
import { Area } from '@/utils/bitmap/Area';
import { getCanvas } from './getCanvas';

interface BitmapViewProps {
  bitmap: Bitmap;
  onChangeBitmap?: (bitmap: Bitmap) => void;
  clearMode?: boolean;
  areaMode?: boolean;
  selectedArea?: BitmapArea;
  onSelectArea?: (value: BitmapArea) => void;
}

export const BitmapView = ({
  bitmap,
  onChangeBitmap,
  clearMode,
  areaMode,
  selectedArea,
  onSelectArea,
}: BitmapViewProps): JSX.Element => {
  const { grid } = useSettingsStore();
  const [sizes, setSizes] = useState<Sizes | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const isSelectingArea = areaMode && (!selectedArea || selectedArea instanceof Point);
  const bitmapWidth = bitmap.width;
  const bitmapHeight = bitmap.height;

  const setCanvasRef = useCallback(
    (elem: HTMLCanvasElement | null) => {
      if (elem) {
        const myCanvas = getCanvas(elem);
        const canvasWidth = getSizeByBitmap(bitmapWidth);
        const canvasHeight = getSizeByBitmap(bitmapHeight);
        myCanvas.width = canvasWidth;
        myCanvas.height = canvasHeight;
        setSizes({ canvasWidth, canvasHeight, bitmapWidth, bitmapHeight });
        setCtx(myCanvas.getContext('2d'));
        setCanvas(myCanvas);
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

          if (onSelectArea && areaMode && !(selectedArea instanceof Area)) {
            const point = new Point(posX, posY);
            const nextSelectedArea = selectedArea instanceof Point ? new Area(selectedArea, point) : point;
            onSelectArea(nextSelectedArea);
          } else {
            if (areaMode && selectedArea instanceof Area) {
              const isIntersection = selectedArea.isIntersect(new Point(posX, posY));
              if (isIntersection) {
                const nextBitmap = bitmap.clone();
                nextBitmap.setPixelValue(new Point(posX, posY), !clearMode);
                onChangeBitmap(nextBitmap);
              }
            } else {
              const nextBitmap = bitmap.clone();
              nextBitmap.setPixelValue(new Point(posX, posY), !clearMode);
              onChangeBitmap(nextBitmap);
            }
          }
        }
      }
    },
    [canvas, sizes, onChangeBitmap, onSelectArea, areaMode, selectedArea, bitmap, clearMode],
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
    drawArea(ctx, sizes, !!areaMode, selectedArea);
  }, [areaMode, bitmap, ctx, grid, sizes, selectedArea]);

  return <canvas ref={setCanvasRef} className={styles.container} onClick={handleClick} onMouseMove={handleMouseMove} />;
};
