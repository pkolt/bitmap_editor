import cn from 'classnames';
import { ImageEntity, ImageEntityData } from '@/types/image';
import styles from './index.module.css';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ResetDialog } from './ResetDialog';
import { ExportDialog } from './ExportDialog';
import { Bitmap } from '@/utils/bitmap';

const AUTO_SAVE_TIMEOUT_MS = 2000;

enum Dialog {
  None,
  Reset,
  Export,
}

interface PixelEditorProps {
  image: ImageEntity;
  onChange: (data: ImageEntityData) => void;
}

export const PixelEditor = ({ image, onChange }: PixelEditorProps): JSX.Element => {
  const style = { '--width': image.width, '--height': image.height } as React.CSSProperties;

  const refAutoSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isDraw, setIsDraw] = useState(true);
  const [dialog, setDialog] = useState(Dialog.None);
  const [bitmap, setBitmap] = useState(Bitmap.fromArray(image.width, image.height, image.data));
  const isEmptyBitmap = useMemo(() => bitmap.isEmpty(), [bitmap]);

  const handleChange = useCallback(() => {
    // Reset previous timer
    if (refAutoSaveTimeout.current) {
      clearTimeout(refAutoSaveTimeout.current);
      refAutoSaveTimeout.current = null;
    }

    refAutoSaveTimeout.current = setTimeout(() => {
      onChange(bitmap.toJSON());
    }, AUTO_SAVE_TIMEOUT_MS);
  }, [bitmap, onChange]);

  const resetImage = useCallback(() => {
    bitmap.reset();
    setBitmap(bitmap.clone());
    onChange(bitmap.toJSON());
  }, [bitmap, onChange]);

  const handleCloseDialog = () => {
    setDialog(Dialog.None);
  };

  const handleClickReset = () => {
    setDialog(Dialog.Reset);
  };

  const handleAcceptResetDialog = () => {
    resetImage();
    handleCloseDialog();
  };

  const handleClickExport = () => {
    setDialog(Dialog.Export);
  };

  const items: JSX.Element[] = [];
  for (let i = 0; i < bitmap.length; i++) {
    const isSelected = bitmap.get(i);
    const onClick = () => {
      bitmap.set(i, isDraw ? true : false);
      setBitmap(bitmap.clone());
      handleChange();
    };
    const onMouseOver = (event: React.MouseEvent) => {
      if (event.buttons || event.ctrlKey) {
        bitmap.set(i, isDraw ? true : false);
        setBitmap(bitmap.clone());
        handleChange();
      }
    };
    items.push(
      <div
        key={i}
        className={cn(styles.pixel, isSelected && styles['pixel-selected'])}
        onClick={onClick}
        onMouseOver={onMouseOver}></div>,
    );
  }

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <div className="d-flex gap-2 mb-3 text-black-50">
          <i className="bi bi-info-circle" />
          Hold the Ctr key to draw or click the mouse key
        </div>
        <div className="mb-3 d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={handleClickReset}>
            Reset
          </button>
          <div className="btn-group">
            <button className={cn('btn btn-outline-primary', isDraw && 'active')} onClick={() => setIsDraw(true)}>
              <i className="bi bi-brush" /> Draw
            </button>
            <button className={cn('btn btn-outline-primary', !isDraw && 'active')} onClick={() => setIsDraw(false)}>
              <i className="bi bi-eraser" /> Eraser
            </button>
          </div>
          <button className="btn btn-outline-primary" onClick={handleClickExport} disabled={isEmptyBitmap}>
            <i className="bi bi-code-slash" /> Export to C++
          </button>
        </div>
        <div className={styles['pixel-list']} style={style}>
          {items}
        </div>
      </div>
      {dialog === Dialog.Reset && <ResetDialog onClose={handleCloseDialog} onAccept={handleAcceptResetDialog} />}
      {dialog === Dialog.Export && <ExportDialog onClose={handleCloseDialog} imageId={image.id} />}
    </>
  );
};
