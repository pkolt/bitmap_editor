import { useCallback, useMemo, useState } from 'react';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { BitmapArea } from '../types';
import { Point } from '@/utils/bitmap/Point';
import { Area } from '@/utils/bitmap/Area';
import { useChangesHistory } from './useHistory';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDebounce } from './useDebounce';
import { UpdateBitmapFn } from './useBitmap';

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
  bitmap: Bitmap;
  updateBitmap: UpdateBitmapFn;
}

export const useToolbar = ({ bitmap, updateBitmap }: ToolbarHookParams) => {
  const [clearMode, setClearMode] = useState(false);
  const [areaMode, setAreaMode] = useState(false);
  const [selectedArea, setArea] = useState<BitmapArea>(null);

  const { onClickRedo, onClickUndo, disabledRedo, disabledUndo, addToHistory } = useChangesHistory({
    bitmap,
    updateBitmap,
    historyLimit: 50,
  });

  const updateBitmapDebounce = useDebounce({
    fn: (value: Bitmap) => {
      addToHistory(value);
      updateBitmap(value); // Save in store
    },
    delayMs: 500,
  });

  const onDraw = useCallback(
    (x: number, y: number) => {
      const nextBitmap = bitmap.clone();
      nextBitmap.setPixelValue(new Point(x, y), !clearMode);
      updateBitmap(nextBitmap, true); // Update and skip save in store
      updateBitmapDebounce(nextBitmap);
    },
    [bitmap, clearMode, updateBitmap, updateBitmapDebounce],
  );

  const selectedAreaOnly = selectedArea instanceof Area ? selectedArea : undefined;
  const isEmptyBitmap = bitmap.isEmpty();

  const onChangeBitmap = useCallback(
    (bitmap: Bitmap) => {
      addToHistory(bitmap);
      updateBitmap(bitmap);
    },
    [addToHistory, updateBitmap],
  );

  const handleClickReset = useCallback(() => {
    bitmap.clear(selectedAreaOnly);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap, selectedAreaOnly]);

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
          onClick: onClickUndo,
          disabled: disabledUndo,
        },
        [ButtonName.Redo]: {
          onClick: onClickRedo,
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
          disabled: areaMode,
        },
      }) satisfies ButtonsConfig,
    [
      handleClickDraw,
      clearMode,
      handleClickClear,
      onClickUndo,
      disabledUndo,
      onClickRedo,
      disabledRedo,
      handleClickArea,
      areaMode,
      handleClickInvert,
      handleClickReset,
      isEmptyBitmap,
    ],
  );

  useHotkeys('mod+z', onClickUndo);
  useHotkeys('mod+shift+z', onClickRedo);
  useHotkeys('mod+u', buttons.draw.onClick);
  useHotkeys('mod+i', buttons.area.onClick);
  useHotkeys('up', handleClickUp);
  useHotkeys('down', handleClickDown);
  useHotkeys('left', handleClickLeft);
  useHotkeys('right', handleClickRight);

  return {
    buttons,
    bitmap,
    selectedArea,
    selectedAreaOnly,
    onSelectArea,
    onChangeBitmap,
    onDraw,
  };
};
