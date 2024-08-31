export enum BitOrder {
  BigEndian = 'BE', // MSB (Most Significant Byte) or BE (Big-Endian)
  LittleEndian = 'LE', // LSB (Least Significant Byte) or LE (Little-Endian)
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
