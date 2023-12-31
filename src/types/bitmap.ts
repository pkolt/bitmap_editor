export type BitmapEntityData = number[];

export interface BitmapEntity {
  id: string;
  name: string;
  width: number;
  height: number;
  data: BitmapEntityData;
  createdAt: number;
  updatedAt: number;
}
