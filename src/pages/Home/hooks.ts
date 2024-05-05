import { useCallback, useState } from 'react';
import { Dialog } from './types';

export const useHomePage = () => {
  const [bitmapId, setBitmapId] = useState<string | null>(null);
  const [dialog, setDialog] = useState(Dialog.None);
  const openDialog = useCallback((dlg: Dialog, id?: string) => {
    setDialog(dlg);
    if (id) {
      setBitmapId(id);
    }
  }, []);
  const closeDialog = useCallback(() => {
    setDialog(Dialog.None);
    setBitmapId(null);
  }, []);
  return { bitmapId, dialog, openDialog, closeDialog };
};
