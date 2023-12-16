import cn from 'classnames';
import { ImageEntity, ImageEntityData } from '@/types/image';
import styles from './index.module.css';
import { useCallback, useMemo, useState } from 'react';
import { ResetDialog } from './ResetDialog';
import { ExportDialog } from './ExportDialog';
import { Bitmap } from '@/utils/bitmap';

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
  const [isDraw, setIsDraw] = useState(true);
  const [dialog, setDialog] = useState(Dialog.None);

  const style = { '--width': image.width, '--height': image.height } as React.CSSProperties;
  const data = image.data;
  const bitmap = useMemo(
    () => new Bitmap(image.width, image.height, image.data),
    [image.data, image.height, image.width],
  );

  const resetImage = useCallback(() => {
    onChange(new Bitmap(image.width, image.height).toJSON());
  }, [image.height, image.width, onChange]);

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
  const len = image.width * image.height;
  if (data) {
    for (let i = 0; i < len; i++) {
      const isSelected = bitmap.get(i);
      const onClick = () => {
        bitmap.set(i, isDraw ? true : false);
        onChange(bitmap.toJSON());
      };
      const onMouseOver = (event: React.MouseEvent) => {
        if (event.buttons || event.ctrlKey) {
          bitmap.set(i, isDraw ? true : false);
          onChange(bitmap.toJSON());
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
  }

  return (
    <>
      <div className="d-flex flex-column align-items-center">
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
          <button className="btn btn-outline-primary" onClick={handleClickExport}>
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
