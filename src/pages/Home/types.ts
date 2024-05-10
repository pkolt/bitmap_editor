export enum DialogType {
  DeleteBitmap,
  CopyBitmap,
  ExportBitmap,
}

export interface Dialog {
  type: DialogType;
  bitmapId: string;
}

export type OpenDialogFn = (dialog: Dialog) => void;
