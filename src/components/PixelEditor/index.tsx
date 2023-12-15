import cn from 'classnames';
import { ImageEntity, ImageEntityData } from '@/types/image';
import styles from './index.module.css';
import { useCallback, useEffect, useState } from 'react';
import { createImageData, getImageDataLength } from './utils';
import { ResetDialog } from './ResetDialog';
import { ExportDialog } from './ExportDialog';

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
  const validImageDataLength = getImageDataLength(image.width, image.height);

  const resetImage = useCallback(() => {
    onChange(createImageData(image.width, image.height));
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

  useEffect(() => {
    if (data.length != validImageDataLength) {
      resetImage();
    }
  }, [data.length, resetImage, validImageDataLength]);

  const items: JSX.Element[] = [];
  const len = image.width * image.height;
  for (let i = 0; i < len; i++) {
    const onClick = () => {
      const nextData = [...data];
      nextData[i] = isDraw ? true : false;
      onChange(nextData);
    };
    const onMouseOver = (event: React.MouseEvent) => {
      if (event.buttons || event.ctrlKey) {
        const nextData = [...data];
        nextData[i] = isDraw ? true : false;
        onChange(nextData);
      }
    };
    const value = data[i];
    items.push(
      <div
        key={i}
        className={cn(styles.pixel, value && styles['pixel-selected'])}
        onClick={onClick}
        onMouseOver={onMouseOver}></div>,
    );
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
