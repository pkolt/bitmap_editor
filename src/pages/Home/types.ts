export enum Dialog {
  None,
  DeleteBitmap,
  CopyBitmap,
  ExportBitmap,
}

export type OpenDialogFn = (dlg: Dialog, id?: string) => void;
