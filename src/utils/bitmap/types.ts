import { Point } from './Point';

export enum BitOrder {
  MSB = 'MSB',
  LSB = 'LSB',
}

export interface BitmapJSON {
  width: number;
  height: number;
  data: number[];
}

export interface BitmapEntity {
  id: string;
  name: string;
  width: number;
  height: number;
  data: number[];
  createdAt: number;
  updatedAt: number;
  favorite: boolean;
}

/** Point on area or ordinal number pixel (starts with 0)  */
export type Coords = Point | number;
