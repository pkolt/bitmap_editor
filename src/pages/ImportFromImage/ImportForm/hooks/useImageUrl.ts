import { capitalize } from '@/utils/string';
import { useEffect } from 'react';

interface ImageUrlHookParams {
  imageUrl?: string;
  setImage: (files: FileList, name: string) => void;
}

export const useImageUrl = ({ imageUrl, setImage }: ImageUrlHookParams): void => {
  useEffect(() => {
    if (imageUrl) {
      (async () => {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const dataTransfer = new DataTransfer();
        const mimeType = 'image/svg+xml';
        const filename = imageUrl.split('/').at(-1) ?? '';
        const name = capitalize(filename.split('.')[0].replaceAll('-', ' '));
        dataTransfer.items.add(new File([blob], filename, { type: mimeType }));
        setImage(dataTransfer.files, name);
      })();
    }
  }, [imageUrl, setImage]);
};
