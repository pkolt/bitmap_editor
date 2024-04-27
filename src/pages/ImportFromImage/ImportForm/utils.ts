import { Bitmap } from '@/utils/bitmap/Bitmap';

const rgbToBlackWhite = (red: number, green: number, blue: number, threshold: number): boolean => {
  const grayscaleValue = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);
  return grayscaleValue >= threshold;
};

export const convertCanvasToBitmap = (
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  threshold: number,
  invertColor: boolean,
): Bitmap | null => {
  const bitmap = new Bitmap(canvas.width, canvas.height);
  const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
  const length = imageData.data.length / 4;
  for (let i = 0; i < length; i++) {
    const index = i * 4;
    const red = imageData.data[index + 0];
    const green = imageData.data[index + 1];
    const blue = imageData.data[index + 2];
    const value = rgbToBlackWhite(red, green, blue, threshold);
    bitmap.setPixelValue(i, invertColor ? !value : value);
  }
  return bitmap;
};

export const scaleImage = (width: number, height: number, imgWidth: number, imgHeight: number) => {
  const widthRatio = width / imgWidth;
  const heightRatio = height / imgHeight;
  const scale = Math.min(widthRatio, heightRatio);
  const scaledWidth = Math.ceil(imgWidth * scale);
  const scaledHeight = Math.ceil(imgHeight * scale);
  return { scaledWidth, scaledHeight };
};
