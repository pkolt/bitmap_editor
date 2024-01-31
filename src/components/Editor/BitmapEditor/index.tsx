import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { Bitmap } from '@/utils/bitmap';
import { useSettingsStore, type GridSettings } from '@/store/settings/useSettingsStore';

// All sizes in pixels
const SQUARE_SIZE = 10;
const SQUARE_COLOR = '#000';
const SEPARATOR_COLOR = '#777';
const SEPARATOR_SIZE = 1;
const BORDER_SIZE = 1;
const BORDER_COLOR = '#ccc';
const STEP_SIZE = SQUARE_SIZE + BORDER_SIZE;

type CanvasContext = CanvasRenderingContext2D;

interface Sizes {
  canvasWidth: number;
  canvasHeight: number;
  bitmapWidth: number;
  bitmapHeight: number;
}

const getCanvasSize = (bitmapSize: number) => bitmapSize * SQUARE_SIZE + (bitmapSize + 1) * BORDER_SIZE;

const clearDisplay = (ctx: CanvasContext, sizes: Sizes): void => {
  ctx.clearRect(0, 0, sizes.canvasWidth, sizes.canvasHeight);
};

const drawGrid = (ctx: CanvasContext, sizes: Sizes): void => {
  const { canvasWidth, canvasHeight, bitmapWidth, bitmapHeight } = sizes;

  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = BORDER_SIZE;

  for (let i = 0; i <= bitmapHeight; i++) {
    const y = i * STEP_SIZE;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }

  for (let i = 0; i <= bitmapWidth; i++) {
    const x = i * STEP_SIZE;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
};

const drawBitmap = (ctx: CanvasContext, bitmap: Bitmap): void => {
  const bitmapWidth = bitmap.width;
  const bitmapHeight = bitmap.height;

  ctx.fillStyle = SQUARE_COLOR;

  let index = 0;
  for (let y = 0; y < bitmapHeight; y++) {
    for (let x = 0; x < bitmapWidth; x++) {
      const isFill = bitmap.getByIndex(index);
      if (isFill) {
        const posX = x * STEP_SIZE + BORDER_SIZE;
        const posY = y * STEP_SIZE + BORDER_SIZE;
        ctx.fillRect(posX, posY, SQUARE_SIZE, SQUARE_SIZE);
      }
      index++;
    }
  }
};

const drawSeparators = (ctx: CanvasContext, sizes: Sizes, grid: GridSettings): void => {
  const { canvasWidth, canvasHeight, bitmapWidth, bitmapHeight } = sizes;

  ctx.strokeStyle = SEPARATOR_COLOR;
  ctx.lineWidth = SEPARATOR_SIZE;

  if (grid.visibleRows) {
    for (let i = 0; i <= bitmapHeight; i++) {
      if (i % grid.rowSize === 0 && i > 0 && i < bitmapHeight) {
        const y = i * STEP_SIZE;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }
    }
  }

  if (grid.visibleColumns) {
    for (let i = 0; i <= bitmapWidth; i++) {
      if (i % grid.columnSize === 0 && i > 0 && i < bitmapWidth) {
        const x = i * STEP_SIZE;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
    }
  }
};

interface BitmapEditorProps {
  bitmap: Bitmap;
  onChangeBitmap: (bitmap: Bitmap) => void;
  eraser: boolean;
}

export const BitmapEditor = ({ bitmap, onChangeBitmap, eraser }: BitmapEditorProps): JSX.Element => {
  const { grid } = useSettingsStore();
  const [sizes, setSizes] = useState<Sizes | null>(null);
  const [ctx, setCtx] = useState<CanvasContext | null>(null);
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
      if (canvas && sizes) {
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
    drawGrid(ctx, sizes);
    drawSeparators(ctx, sizes, grid);
  }, [bitmap, ctx, grid, sizes]);

  return <canvas ref={setCanvasRef} className={styles.container} onClick={handleClick} onMouseMove={handleMouseMove} />;
};
