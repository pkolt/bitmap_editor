import cn from 'classnames';
import { ImageEntity, ImageEntityData } from '@/types/image';
import styles from './index.module.css';
import { useEffect } from 'react';
import { createImageData, getImageDataLength, invertBitImageData, isSetBitImageData } from './utils';

interface PixelEditorProps {
  image: ImageEntity;
  onChange: (data: ImageEntityData) => void;
}

export const PixelEditor = ({ image, onChange }: PixelEditorProps): JSX.Element => {
  const style = { '--width': image.width, '--height': image.height } as React.CSSProperties;
  const data = image.data;

  useEffect(() => {
    const validLength = getImageDataLength(image.width, image.height);
    if (data.length != validLength) {
      onChange(createImageData(image.width, image.height));
    }
  }, [data.length, image.height, image.width, onChange]);

  const items: JSX.Element[] = [];
  const len = image.width * image.height;
  for (let i = 0; i < len; i++) {
    const onClick = () => {
      const nextData = [...data];
      invertBitImageData(nextData, i);
      onChange(nextData);
    };
    const value = isSetBitImageData(data, i);
    items.push(<div key={i} className={cn(styles.pixel, value && styles['pixel-selected'])} onClick={onClick}></div>);
  }

  return (
    <div className={styles.container} style={style}>
      {items}
    </div>
  );
};
