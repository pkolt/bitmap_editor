import { useEffect } from 'react';

interface ImageUrlHookParams {
  imageUrl?: string;
  setImage: (value: FileList) => void;
}

export const useImageUrl = ({ imageUrl, setImage }: ImageUrlHookParams): void => {
  useEffect(() => {
    if (imageUrl) {
      (async () => {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const dataTransfer = new DataTransfer();
        const mimeType = 'image/svg+xml';
        const name = imageUrl.split('/').at(-1) ?? '';
        dataTransfer.items.add(new File([blob], name, { type: mimeType }));
        setImage(dataTransfer.files);
      })();
    }
  }, [imageUrl, setImage]);
};
