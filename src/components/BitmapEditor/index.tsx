import cn from 'classnames';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ResetDialog } from './ResetDialog';
import { ExportDialog } from './ExportDialog';
import { Bitmap } from '@/utils/bitmap';
import { RenameDialog } from './RenameDialog';
import { BitmapView } from './BitmapView';

import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { GridDialog } from './GridDialog';
import { BitmapSizeAlert } from '../BitmapSizeAlert';
import { ResizeDialog } from './ResizeDialog';
import { AreaCoords } from './types';

const AUTO_SAVE_TIMEOUT_MS = 500;
const HISTORY_LENGTH = 50;

enum Dialog {
  None,
  Reset,
  Export,
  Rename,
  Grid,
  Resize,
}

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
  const [eraser, setEraser] = useState(false);
  const [area, setArea] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaCoords>([null, null]);
  const [dialog, setDialog] = useState(Dialog.None);
  const [bitmap, setBitmap] = useState(Bitmap.fromJSON(bitmapEntity));
  const [history, setHistory] = useState<Bitmap[]>([bitmap.clone()]);
  const [historyIndex, setHistoryIndex] = useState(0);

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

  const resetBitmap = useCallback(() => {
    bitmap.reset();
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap]);

  const handleCloseDialog = () => setDialog(Dialog.None);
  const handleClickReset = () => setDialog(Dialog.Reset);
  const handleClickExport = () => setDialog(Dialog.Export);
  const handleClickRename = () => setDialog(Dialog.Rename);
  const handleClickGrid = () => setDialog(Dialog.Grid);
  const handleClickLayout = () => setDialog(Dialog.Resize);

  const handleAcceptResetDialog = () => {
    resetBitmap();
    handleCloseDialog();
  };

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
    setEraser(false);
  }, []);

  const handleClickEraser = useCallback(() => {
    setEraser(true);
  }, []);

  const handleClickInvert = useCallback(() => {
    bitmap.invertColor();
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap]);

  const handleClickArea = useCallback(() => {
    setArea((state) => {
      // Reset area if off area
      if (!state) {
        setSelectedArea([null, null]);
      }
      return !state;
    });
  }, []);

  const handleClickUp = useCallback(() => {
    bitmap.moveBitmap(0, -1);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap]);

  const handleClickDown = useCallback(() => {
    bitmap.moveBitmap(0, 1);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap]);

  const handleClickLeft = useCallback(() => {
    bitmap.moveBitmap(-1, 0);
    onChangeBitmap(bitmap);
  }, [bitmap, onChangeBitmap]);

  const handleClickRight = useCallback(() => {
    bitmap.moveBitmap(1, 0);
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
              className={cn('btn btn-outline-primary', !eraser && 'active')}
              onClick={handleClickDraw}
              title="Ctr+U / Cmd+U">
              <i className="bi bi-brush" /> Draw
            </button>
            <button
              className={cn('btn btn-outline-primary', eraser && 'active')}
              onClick={handleClickEraser}
              title="Ctr+I / Cmd+I">
              <i className="bi bi-eraser" /> Eraser
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
          <button className={cn('btn', area ? 'btn-primary' : 'btn-outline-primary')} onClick={handleClickArea}>
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
          <button className="btn btn-outline-primary" onClick={handleClickLayout}>
            <i className="bi bi-arrows-fullscreen" /> Resize
          </button>
        </div>
        <BitmapSizeAlert bitmapWidth={bitmapEntity.width} className="mb-3" />
        <BitmapView
          bitmap={bitmap}
          onChangeBitmap={handleChangeBitmap}
          eraser={eraser}
          area={area}
          selectedArea={selectedArea}
          onChangeSelectedArea={setSelectedArea}
        />
      </div>
      {dialog === Dialog.Reset && <ResetDialog onClose={handleCloseDialog} onAccept={handleAcceptResetDialog} />}
      {dialog === Dialog.Export && <ExportDialog onClose={handleCloseDialog} bitmapId={bitmapId} />}
      {dialog === Dialog.Rename && <RenameDialog onClose={handleCloseDialog} bitmapId={bitmapId} />}
      {dialog === Dialog.Grid && <GridDialog onClose={handleCloseDialog} />}
      {dialog === Dialog.Resize && (
        <ResizeDialog bitmap={bitmap} onChangeBitmap={onChangeBitmap} onClose={handleCloseDialog} />
      )}
    </>
  );
};
