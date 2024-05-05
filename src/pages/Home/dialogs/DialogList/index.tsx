import { CopyBitmapDialog } from '../CopyBitmapDialog';
import { DeleteBitmapDialog } from '../DeleteBitmapDialog';
import { ExportBitmapDialog } from '../ExportBitmapDialog';
import { Dialog } from '../../types';

interface DialogListProps {
  dialog: Dialog;
  closeDialog: () => void;
  bitmapId: string | null;
}

export const DialogList = ({ dialog, bitmapId, closeDialog }: DialogListProps): JSX.Element | null => {
  if (!bitmapId) {
    return null;
  }
  switch (dialog) {
    case Dialog.DeleteBitmap:
      return <DeleteBitmapDialog bitmapId={bitmapId} onClose={closeDialog} />;
    case Dialog.CopyBitmap:
      return <CopyBitmapDialog bitmapId={bitmapId} onClose={closeDialog} />;
    case Dialog.ExportBitmap:
      return <ExportBitmapDialog bitmapId={bitmapId} onClose={closeDialog} />;
    default:
      return null;
  }
};
