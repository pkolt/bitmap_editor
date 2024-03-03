import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useCallback, useMemo, useState } from 'react';

interface ChangesHistoryHookParams {
  bitmap: Bitmap;
  updateBitmap: (bitmap: Bitmap) => void;
  historyLimit: number;
}

export const useChangesHistory = ({ bitmap, updateBitmap, historyLimit }: ChangesHistoryHookParams) => {
  const [history, setHistory] = useState<Bitmap[]>([bitmap.clone()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const setBitmapFromHistory = useCallback(
    (moveIndex: number) => {
      const index = historyIndex + moveIndex;
      const nextBitmap = history[index];
      setHistoryIndex(index);
      updateBitmap(nextBitmap.clone());
    },
    [history, historyIndex, updateBitmap],
  );

  const disabledUndo = historyIndex <= 0;
  const disabledRedo = historyIndex >= history.length - 1;

  const onClickUndo = useCallback(() => {
    if (!disabledUndo) {
      setBitmapFromHistory(-1);
    }
  }, [disabledUndo, setBitmapFromHistory]);

  const onClickRedo = useCallback(() => {
    if (!disabledRedo) {
      setBitmapFromHistory(1);
    }
  }, [disabledRedo, setBitmapFromHistory]);

  const addToHistory = useCallback(
    (value: Bitmap) => {
      setHistory((state) => {
        const list = [...state, value].slice(historyLimit * -1);
        setHistoryIndex(list.length - 1);
        return list;
      });
    },
    [historyLimit],
  );

  return useMemo(
    () => ({
      disabledUndo,
      disabledRedo,
      onClickUndo,
      onClickRedo,
      addToHistory,
    }),
    [addToHistory, disabledRedo, disabledUndo, onClickRedo, onClickUndo],
  );
};
