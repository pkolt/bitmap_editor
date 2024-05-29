import { CopyBitmapDialog } from '../CopyBitmapDialog';
import { DeleteBitmapDialog } from '../DeleteBitmapDialog';
import { ExportBitmapDialog } from '../ExportBitmapDialog';
import { Dialog, DialogType } from '../../types';

interface DialogListProps {
  dialog: Dialog;
  closeDialog: () => void;
}

export const DialogList = ({ dialog, closeDialog }: DialogListProps): JSX.Element => {
  return (
    <>
      {dialog.type === DialogType.DeleteBitmap && (
        <DeleteBitmapDialog bitmapId={dialog.bitmapId} onClose={closeDialog} />
      )}
      {dialog.type === DialogType.CopyBitmap && <CopyBitmapDialog bitmapId={dialog.bitmapId} onClose={closeDialog} />}
      {dialog.type === DialogType.ExportBitmap && (
        <ExportBitmapDialog bitmapId={dialog.bitmapId} onClose={closeDialog} />
      )}
    </>
  );
};
