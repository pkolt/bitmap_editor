import { useEffect, useLayoutEffect, useRef } from 'react';
import styles from './index.module.css';
import { Bitmap } from '@/utils/bitmap';

// All sizes in pixels
const SQUARE_SIZE = 10;
const SQUARE_COLOR = '#000';
const BORDER_SIZE = 1;
const BORDER_COLOR = '#ccc';
const STEP_SIZE = SQUARE_SIZE + BORDER_SIZE;

const getCanvasSize = (size: number) => {
  return size * SQUARE_SIZE + (size + 1) * BORDER_SIZE;
};

const clearDisplay = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  const canvasWidth = getCanvasSize(width);
  const canvasHeight = getCanvasSize(height);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
};

const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  const canvasWidth = getCanvasSize(width);
  const canvasHeight = getCanvasSize(height);

  ctx.strokeStyle = BORDER_COLOR;
  ctx.lineWidth = BORDER_SIZE;

  for (let i = 0; i <= height; i++) {
    const y = i * STEP_SIZE;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }

  for (let i = 0; i <= width; i++) {
    const x = i * STEP_SIZE;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
};

const drawBitmap = (ctx: CanvasRenderingContext2D, bitmap: Bitmap): void => {
  const width = bitmap.width;
  const height = bitmap.height;

  ctx.fillStyle = SQUARE_COLOR;

  let index = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isFill = bitmap.get(index);
      if (isFill) {
        const posX = x * STEP_SIZE + BORDER_SIZE;
        const posY = y * STEP_SIZE + BORDER_SIZE;
        ctx.fillRect(posX, posY, SQUARE_SIZE, SQUARE_SIZE);
      }
      index++;
    }
  }
};

interface BitmapViewProps {
  bitmap: Bitmap;
}

export const BitmapView = ({ bitmap }: BitmapViewProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = bitmap.width;
  const height = bitmap.height;

  // Set canvas sizes
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    canvas.width = getCanvasSize(width);
    canvas.height = getCanvasSize(height);
  }, [height, width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    clearDisplay(ctx, width, height);
    drawBitmap(ctx, bitmap);
    drawGrid(ctx, width, height);
  }, [bitmap, height, width]);

  return <canvas ref={canvasRef} className={styles.container} />;
};
