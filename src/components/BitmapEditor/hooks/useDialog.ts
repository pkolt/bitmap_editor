import { useMemo, useState } from 'react';

export enum Dialog {
  None,
  Export,
  Rename,
  Grid,
  Resize,
}

export const useDialog = () => {
  const [opened, setOpened] = useState(Dialog.None);

  const close = () => setOpened(Dialog.None);
  const openExportDialog = () => setOpened(Dialog.Export);
  const openRenameDialog = () => setOpened(Dialog.Rename);
  const openGridDialog = () => setOpened(Dialog.Grid);
  const openLayoutDialog = () => setOpened(Dialog.Resize);

  return useMemo(
    () => ({
      opened,
      close,
      openExportDialog,
      openRenameDialog,
      openGridDialog,
      openLayoutDialog,
    }),
    [opened],
  );
};
