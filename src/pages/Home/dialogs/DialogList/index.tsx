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
      <DeleteBitmapDialog
        show={dialog.type === DialogType.DeleteBitmap}
        bitmapId={dialog.bitmapId}
        onClose={closeDialog}
      />
      <CopyBitmapDialog show={dialog.type === DialogType.CopyBitmap} bitmapId={dialog.bitmapId} onClose={closeDialog} />
      <ExportBitmapDialog
        show={dialog.type === DialogType.ExportBitmap}
        bitmapId={dialog.bitmapId}
        onClose={closeDialog}
      />
    </>
  );
};
