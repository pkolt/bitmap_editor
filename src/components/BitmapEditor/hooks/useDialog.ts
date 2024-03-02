import { useMemo, useState } from 'react';

export enum Dialog {
  None,
  Export,
  Rename,
  Grid,
  Resize,
}

export const useDialog = () => {
  const [name, setName] = useState(Dialog.None);

  const close = () => setName(Dialog.None);
  const openExportDialog = () => setName(Dialog.Export);
  const openRenameDialog = () => setName(Dialog.Rename);
  const openGridDialog = () => setName(Dialog.Grid);
  const openLayoutDialog = () => setName(Dialog.Resize);

  return useMemo(
    () => ({
      name,
      close,
      openExportDialog,
      openRenameDialog,
      openGridDialog,
      openLayoutDialog,
    }),
    [name],
  );
};
