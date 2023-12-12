import cn from 'classnames';
import { ImageEntity, ImageEntityData } from '@/types/image';
import styles from './index.module.css';
import { useEffect } from 'react';

interface ImageEditorProps {
  image: ImageEntity;
  onChange: (data: ImageEntityData) => void;
}

export const ImageEditor = ({ image, onChange }: ImageEditorProps): JSX.Element => {
  const style = { '--width': image.width, '--height': image.height } as React.CSSProperties;
  const length = image.width * image.height;
  const data = image.data;

  useEffect(() => {
    if (data.length != length) {
      onChange(new Array(length).fill(false));
    }
  }, [data.length, length, onChange]);

  return (
    <div className={styles.container} style={style}>
      {data.map((value, index) => {
        const onClick = () => {
          const nextData = [...data];
          nextData[index] = !nextData[index];
          onChange(nextData);
        };
        return (
          <div key={index} className={cn(styles.pixel, value && styles['pixel-selected'])} onClick={onClick}></div>
        );
      })}
    </div>
  );
};
