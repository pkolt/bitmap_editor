import { useCallback, useState } from 'react';
import { Dialog } from './types';

export const useHomePage = () => {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const openDialog = setDialog;
  const closeDialog = useCallback(() => setDialog(null), []);
  return { dialog, openDialog, closeDialog };
};
