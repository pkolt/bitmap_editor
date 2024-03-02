import { useHotkeys } from 'react-hotkeys-hook';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { BitmapArea } from '../types';
import { Point } from '@/utils/bitmap/Point';
import { Area } from '@/utils/bitmap/Area';
import { AUTO_SAVE_TIMEOUT_MS, HISTORY_LENGTH } from '../constants';

enum ButtonName {
  Draw = 'draw',
  Clear = 'clear',
  Undo = 'undo',
  Redo = 'redo',
  Area = 'area',
  Invert = 'invert',
  Reset = 'reset',
  Export = 'export',
  Grid = 'grid',
  Resize = 'resize',
}

interface ButtonOptions {
  onClick?: () => void;
  disabled: boolean;
  active?: boolean;
}

type ButtonsConfig = Record<ButtonName, ButtonOptions>;

interface ToolbarHookParams {
  bitmapId: string;
}

export const useToolbar = ({ bitmapId }: ToolbarHookParams) => {
  const { findBitmap, changeBitmap } = useBitmapStore();
  const bitmapEntity = findBitmap(bitmapId);
  if (!bitmapEntity) {
    throw Error(`Not found bitmap with id: ${bitmapId}`);
  }
  const refAutoSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [clearMode, setClearMode] = useState(false);
  const [areaMode, setAreaMode] = useState(false);
  const [selectedArea, setArea] = useState<BitmapArea>(null);
  const [bitmap, setBitmap] = useState(Bitmap.fromJSON(bitmapEntity));
  const [history, setHistory] = useState<Bitmap[]>([bitmap.clone()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const selectedAreaOnly = selectedArea instanceof Area ? selectedArea : undefined;
  const isEmptyBitmap = bitmap.isEmpty();

  const saveHistory = useCallback((value: Bitmap) => {
    setHistory((state) => {
      const list = [...state, value].slice(HISTORY_LENGTH * -1);
      setHistoryIndex(list.length - 1);
      return list;
    });
  }, []);

  const onChangeBitmapTimeout = useCallback(
    (value: Bitmap) => {
      const copiedBitmap = value.clone();
      setBitmap(value);

      // Reset previous timer
      if (refAutoSaveTimeout.current) {
        clearTimeout(refAutoSaveTimeout.current);
        refAutoSaveTimeout.current = null;
      }

      refAutoSaveTimeout.current = setTimeout(() => {
        saveHistory(copiedBitmap);
        changeBitmap(bitmapId, copiedBitmap.toJSON());
      }, AUTO_SAVE_TIMEOUT_MS);
    },
    [saveHistory, changeBitmap, bitmapId],
  );

  const onChangeBitmap = useCallback(
    (bitmap: Bitmap) => {
      setBitmap(bitmap.clone());
      saveHistory(bitmap.clone());
      changeBitmap(bitmapId, bitmap.toJSON());
    },
    [bitmapId, changeBitmap, saveHistory],
  );

  const handleClickReset = useCallback(() => {
    bitmap.clear(selectedAreaOnly);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap, selectedAreaOnly]);

  const setBitmapFromHistory = useCallback(
    (moveIndex: number) => {
      const index = historyIndex + moveIndex;
      const nextBitmap = history[index];
      setHistoryIndex(index);
      setBitmap(nextBitmap.clone());
      changeBitmap(bitmapId, nextBitmap.toJSON());
    },
    [bitmapId, changeBitmap, history, historyIndex],
  );

  const disabledUndo = historyIndex <= 0;
  const handleClickUndo = useCallback(() => {
    if (!disabledUndo) {
      setBitmapFromHistory(-1);
    }
  }, [disabledUndo, setBitmapFromHistory]);

  const disabledRedo = historyIndex >= history.length - 1;
  const handleClickRedo = useCallback(() => {
    if (!disabledRedo) {
      setBitmapFromHistory(1);
    }
  }, [disabledRedo, setBitmapFromHistory]);

  const handleClickDraw = useCallback(() => {
    setClearMode(false);
  }, []);

  const handleClickClear = useCallback(() => {
    setClearMode(true);
  }, []);

  const handleClickInvert = useCallback(() => {
    bitmap.invertColor(selectedAreaOnly);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap, selectedAreaOnly]);

  const handleClickArea = useCallback(() => {
    setAreaMode((state) => {
      if (state) {
        setArea(null);
      }
      return !state;
    });
  }, []);

  const handleClickUp = useCallback(() => {
    bitmap.move(new Point(0, -1), selectedAreaOnly);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap, selectedAreaOnly]);

  const handleClickDown = useCallback(() => {
    bitmap.move(new Point(0, 1), selectedAreaOnly);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap, selectedAreaOnly]);

  const handleClickLeft = useCallback(() => {
    bitmap.move(new Point(-1, 0), selectedAreaOnly);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap, selectedAreaOnly]);

  const handleClickRight = useCallback(() => {
    bitmap.move(new Point(1, 0), selectedAreaOnly);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap, selectedAreaOnly]);

  const onSelectArea = setArea;

  const buttons = useMemo(
    () =>
      ({
        [ButtonName.Draw]: {
          onClick: handleClickDraw,
          disabled: false,
          active: !clearMode,
        },
        [ButtonName.Clear]: {
          onClick: handleClickClear,
          disabled: false,
          active: clearMode,
        },
        [ButtonName.Undo]: {
          onClick: handleClickUndo,
          disabled: disabledUndo,
        },
        [ButtonName.Redo]: {
          onClick: handleClickRedo,
          disabled: disabledRedo,
        },
        [ButtonName.Area]: {
          onClick: handleClickArea,
          disabled: false,
          active: areaMode,
        },
        [ButtonName.Invert]: {
          onClick: handleClickInvert,
          disabled: false,
        },
        [ButtonName.Reset]: {
          onClick: handleClickReset,
          disabled: isEmptyBitmap,
        },
        [ButtonName.Export]: {
          disabled: isEmptyBitmap,
        },
        [ButtonName.Grid]: {
          disabled: false,
        },
        [ButtonName.Resize]: {
          disabled: false,
        },
      }) satisfies ButtonsConfig,
    [
      handleClickDraw,
      clearMode,
      handleClickClear,
      handleClickUndo,
      disabledUndo,
      handleClickRedo,
      disabledRedo,
      handleClickArea,
      areaMode,
      handleClickInvert,
      handleClickReset,
      isEmptyBitmap,
    ],
  );

  useHotkeys('mod+z', handleClickUndo);
  useHotkeys('mod+shift+z', handleClickRedo);
  useHotkeys('mod+u', handleClickDraw);
  useHotkeys('mod+i', handleClickArea);
  useHotkeys('up', handleClickUp);
  useHotkeys('down', handleClickDown);
  useHotkeys('left', handleClickLeft);
  useHotkeys('right', handleClickRight);

  return {
    bitmapEntity,
    buttons,
    bitmap,
    selectedArea,
    selectedAreaOnly,
    onSelectArea,
    onChangeBitmap,
    onChangeBitmapTimeout,
  };
};
