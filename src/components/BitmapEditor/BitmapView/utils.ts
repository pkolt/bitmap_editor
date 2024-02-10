import { Bitmap } from '@/utils/bitmap';
import {
  BORDER_COLOR,
  BORDER_SIZE,
  SEPARATOR_COLOR,
  SEPARATOR_SIZE,
  SQUARE_COLOR,
  SQUARE_SIZE,
  STEP_SIZE,
} from './constants';
import { Sizes } from './types';
import { GridSettings } from '@/store/settings/useSettingsStore';

export const getCanvasSize = (bitmapSize: number) => bitmapSize * SQUARE_SIZE + (bitmapSize + 1) * BORDER_SIZE;

export const clearDisplay = (ctx: CanvasRenderingContext2D, sizes: Sizes): void => {
  ctx.clearRect(0, 0, sizes.canvasWidth, sizes.canvasHeight);
};

export const drawPointsBorders = (ctx: CanvasRenderingContext2D, sizes: Sizes): void => {
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

export const drawBitmap = (ctx: CanvasRenderingContext2D, bitmap: Bitmap): void => {
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

export const drawGrid = (ctx: CanvasRenderingContext2D, sizes: Sizes, grid: GridSettings): void => {
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
