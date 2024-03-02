import { Area } from '@/utils/bitmap/Area';
import { Point } from '@/utils/bitmap/Point';

export enum Dialog {
  None,
  Export,
  Rename,
  Grid,
  Resize,
}

export type BitmapArea = Area | Point | null;
