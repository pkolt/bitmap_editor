import cn from 'classnames';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ExportDialog } from './ExportDialog';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { RenameDialog } from './RenameDialog';
import { BitmapView } from './BitmapView';

import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { GridDialog } from './GridDialog';
import { BitmapSizeAlert } from '../BitmapSizeAlert';
import { ResizeDialog } from './ResizeDialog';
import { BitmapArea, Dialog } from './types';
import { Point } from '@/utils/bitmap/Point';
import { Area } from '@/utils/bitmap/Area';

const AUTO_SAVE_TIMEOUT_MS = 500;
const HISTORY_LENGTH = 50;

interface BitmapEditorProps {
  bitmapId: string;
}

export const BitmapEditor = ({ bitmapId }: BitmapEditorProps): JSX.Element => {
  const { findBitmap, changeBitmap } = useBitmapStore();
  const bitmapEntity = findBitmap(bitmapId);
  if (!bitmapEntity) {
    throw Error(`Not found bitmap with id: ${bitmapId}`);
  }
  const refAutoSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isClear, setIsClear] = useState(false);
  const [isArea, setIsArea] = useState(false);
  const [area, setArea] = useState<BitmapArea>(null);
  const [dialog, setDialog] = useState(Dialog.None);
  const [bitmap, setBitmap] = useState(Bitmap.fromJSON(bitmapEntity));
  const [history, setHistory] = useState<Bitmap[]>([bitmap.clone()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const targetArea = area instanceof Area ? area : undefined;

  const saveHistory = useCallback((value: Bitmap) => {
    setHistory((state) => {
      const list = [...state, value].slice(HISTORY_LENGTH * -1);
      setHistoryIndex(list.length - 1);
      return list;
    });
  }, []);

  const isEmptyBitmap = useMemo(() => bitmap.isEmpty(), [bitmap]);

  const handleChangeBitmap = useCallback(
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
    bitmap.clear(targetArea);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap, targetArea]);

  const handleCloseDialog = () => setDialog(Dialog.None);
  const handleClickExport = () => setDialog(Dialog.Export);
  const handleClickRename = () => setDialog(Dialog.Rename);
  const handleClickGrid = () => setDialog(Dialog.Grid);
  const handleClickLayout = () => setDialog(Dialog.Resize);

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
    setIsClear(false);
  }, []);

  const handleClickEraser = useCallback(() => {
    setIsClear(true);
  }, []);

  const handleClickInvert = useCallback(() => {
    bitmap.invertColor(targetArea);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap, targetArea]);

  const handleClickArea = useCallback(() => {
    setIsArea((state) => {
      if (state) {
        setArea(null);
      }
      return !state;
    });
  }, []);

  const handleClickUp = useCallback(() => {
    bitmap.move(new Point(0, -1));
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap]);

  const handleClickDown = useCallback(() => {
    bitmap.move(new Point(0, 1));
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap]);

  const handleClickLeft = useCallback(() => {
    bitmap.move(new Point(-1, 0));
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap]);

  const handleClickRight = useCallback(() => {
    bitmap.move(new Point(1, 0));
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap]);

  useHotkeys('mod+z', handleClickUndo);
  useHotkeys('mod+shift+z', handleClickRedo);
  useHotkeys('mod+u', handleClickDraw);
  useHotkeys('mod+i', handleClickEraser);
  useHotkeys('up', handleClickUp);
  useHotkeys('down', handleClickDown);
  useHotkeys('left', handleClickLeft);
  useHotkeys('right', handleClickRight);

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <h3 className="mb-3 d-flex gap-2">
          {bitmapEntity.name} ({bitmapEntity.width}x{bitmapEntity.height})
          <button className="btn btn-outline-primary" onClick={handleClickRename}>
            <i className="bi bi-pencil-square" /> Rename
          </button>
        </h3>
        <div className="d-flex gap-3 mb-3 text-black-50">
          <div className="d-flex gap-2">
            <i className="bi bi-brush" />
            Draw: Ctrl + Mouse key
          </div>
          <div className="d-flex gap-2">
            <i className="bi bi-arrows-move" />
            Move: Up / Down / Left / Right
          </div>
        </div>
        <div className="mb-3 d-flex gap-2">
          <div className="btn-group">
            <button
              className={cn('btn btn-outline-primary', !isClear && 'active')}
              onClick={handleClickDraw}
              title="Ctr+U / Cmd+U">
              <i className="bi bi-brush" /> Draw
            </button>
            <button
              className={cn('btn btn-outline-primary', isClear && 'active')}
              onClick={handleClickEraser}
              title="Ctr+I / Cmd+I">
              <i className="bi bi-eraser" /> Clear
            </button>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={handleClickUndo}
            disabled={disabledUndo}
            title="Ctr+Z / Cmd+Z">
            <i className="bi bi-arrow-counterclockwise" /> Undo
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={handleClickRedo}
            disabled={disabledRedo}
            title="Ctr+Shift+Z / Cmd+Shift+Z">
            <i className="bi bi-arrow-clockwise" /> Redo
          </button>
          <button className={cn('btn', isArea ? 'btn-primary' : 'btn-outline-primary')} onClick={handleClickArea}>
            <i className="bi bi-bounding-box" /> Area
          </button>
          <button className="btn btn-outline-primary" title="Invert color" onClick={handleClickInvert}>
            <i className="bi bi-highlights" /> Invert
          </button>
          <button className="btn btn-outline-primary" onClick={handleClickReset}>
            Reset
          </button>
          <button className="btn btn-outline-primary" onClick={handleClickExport} disabled={isEmptyBitmap}>
            <i className="bi bi-code-slash" /> Export to C
          </button>
          <button className="btn btn-outline-primary" onClick={handleClickGrid}>
            <i className="bi bi-border-all" /> Grid
          </button>
          <button className="btn btn-outline-primary" onClick={handleClickLayout} disabled={isArea}>
            <i className="bi bi-arrows-fullscreen" /> Resize
          </button>
        </div>
        <BitmapSizeAlert bitmapWidth={bitmapEntity.width} className="mb-3" />
        <BitmapView
          bitmap={bitmap}
          onChangeBitmap={handleChangeBitmap}
          isClear={isClear}
          isArea={isArea}
          area={area}
          onChangeArea={setArea}
        />
      </div>
      {dialog === Dialog.Export && <ExportDialog onClose={handleCloseDialog} bitmapId={bitmapId} area={targetArea} />}
      {dialog === Dialog.Rename && <RenameDialog onClose={handleCloseDialog} bitmapId={bitmapId} />}
      {dialog === Dialog.Grid && <GridDialog onClose={handleCloseDialog} />}
      {dialog === Dialog.Resize && (
        <ResizeDialog bitmap={bitmap} onChangeBitmap={onChangeBitmap} onClose={handleCloseDialog} />
      )}
    </>
  );
};
