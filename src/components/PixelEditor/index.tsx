import cn from 'classnames';
import { ImageEntity, ImageEntityData } from '@/types/image';
import styles from './index.module.css';
import { useCallback, useEffect } from 'react';
import { createImageData, getImageDataLength, invertBitImageData, isSetBitImageData, setBitImageData } from './utils';

interface PixelEditorProps {
  image: ImageEntity;
  onChange: (data: ImageEntityData) => void;
}

export const PixelEditor = ({ image, onChange }: PixelEditorProps): JSX.Element => {
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
      invertBitImageData(nextData, i);
      onChange(nextData);
    };
    const onMouseMove = (event: React.MouseEvent) => {
      if (event.buttons) {
        const nextData = [...data];
        setBitImageData(nextData, i, true);
        onChange(nextData);
      }
    };
    const value = isSetBitImageData(data, i);
    items.push(
      <div
        key={i}
        className={cn(styles.pixel, value && styles['pixel-selected'])}
        onClick={onClick}
        onMouseMove={onMouseMove}></div>,
    );
  }

  return (
    <div>
      <div className="mb-5">
        <button className="btn btn-sm btn-outline-primary" onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className={styles['pixel-list']} style={style}>
        {items}
      </div>
    </div>
  );
};
