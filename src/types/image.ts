export type ImageEntityData = number[];

export interface ImageEntity {
  id: string;
  name: string;
  width: number;
  height: number;
  data: ImageEntityData;
  createdAt: number;
  updatedAt: number;
}
