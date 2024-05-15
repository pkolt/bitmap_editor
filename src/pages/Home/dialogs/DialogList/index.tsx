import { CopyBitmapDialog } from '../CopyBitmapDialog';
import { DeleteBitmapDialog } from '../DeleteBitmapDialog';
import { ExportBitmapDialog } from '../ExportBitmapDialog';
import { Dialog, DialogType } from '../../types';

interface DialogListProps {
  dialog: Dialog;
  closeDialog: () => void;
}

export const DialogList = ({ dialog, closeDialog }: DialogListProps): JSX.Element => {
  switch (dialog.type) {
    case DialogType.DeleteBitmap:
      return <DeleteBitmapDialog bitmapId={dialog.bitmapId} onClose={closeDialog} />;
    case DialogType.CopyBitmap:
      return <CopyBitmapDialog bitmapId={dialog.bitmapId} onClose={closeDialog} />;
    case DialogType.ExportBitmap:
      return <ExportBitmapDialog bitmapId={dialog.bitmapId} onClose={closeDialog} />;
  }
};
