import cn from 'classnames';
import { ImageEntity, ImageEntityData } from '@/types/image';
import styles from './index.module.css';
import { useCallback, useEffect, useState } from 'react';
import { createImageData, getImageDataLength, isSetBitImageData, setBitImageData } from './utils';

interface PixelEditorProps {
  image: ImageEntity;
  onChange: (data: ImageEntityData) => void;
}

export const PixelEditor = ({ image, onChange }: PixelEditorProps): JSX.Element => {
  const [isDraw, setIsDraw] = useState(true);
  const style = { '--width': image.width, '--height': image.height } as React.CSSProperties;
  const data = image.data;
  const validImageDataLength = getImageDataLength(image.width, image.height);

  const handleReset = useCallback(() => {
    onChange(createImageData(image.width, image.height));
  }, [image.height, image.width, onChange]);

  useEffect(() => {
    if (data.length != validImageDataLength) {
      handleReset();
    }
  }, [data.length, handleReset, validImageDataLength]);

  const items: JSX.Element[] = [];
  const len = image.width * image.height;
  for (let i = 0; i < len; i++) {
    const onClick = () => {
      const nextData = [...data];
      setBitImageData(nextData, i, isDraw);
      onChange(nextData);
    };
    const onMouseOver = (event: React.MouseEvent) => {
      if (event.buttons) {
        const nextData = [...data];
        setBitImageData(nextData, i, isDraw);
        onChange(nextData);
      }
    };
    const value = isSetBitImageData(data, i);
    items.push(
      <div
        key={i}
        className={cn(styles.pixel, value && styles['pixel-selected'])}
        onClick={onClick}
        onMouseOver={onMouseOver}></div>,
    );
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-outline-primary" onClick={handleReset}>
          Reset
        </button>
        <div className="btn-group">
          <button className={cn("btn btn-outline-primary", isDraw && 'active')} onClick={() => setIsDraw(true)}>
            <i className="bi bi-brush" /> Draw
          </button>
          <button className={cn("btn btn-outline-primary", !isDraw && 'active')} onClick={() => setIsDraw(false)}>
            <i className="bi bi-eraser" /> Eraser
          </button>
        </div>
      </div>
      <div className={styles['pixel-list']} style={style}>
        {items}
      </div>
    </div>
  );
};
