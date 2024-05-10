import { v4 as uuidv4 } from 'uuid';
import { Page } from '@/components/Page';
import { useCallback, useState } from 'react';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { BitmapView } from '@/components/BitmapEditor/components/BitmapView';
import { BitmapEntity } from '@/utils/bitmap/types';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';
import { useBitmapsStore } from '@/stores/bitmaps';
import { PageUrl } from '@/constants/urls';
import { FormValues } from './ImportForm/types';
import { ImportForm } from './ImportForm';

const ImportFromImage = () => {
  const navigate = useNavigate();
  const { addBitmap } = useBitmapsStore();
  const [bitmap, setBitmap] = useState<Bitmap | null>(null);

  const onSubmit = useCallback(
    (data: FormValues) => {
      if (!bitmap) {
        return;
      }
      const id = uuidv4();
      const timestamp = DateTime.now().toMillis();
      const image: BitmapEntity = {
        id,
        name: data.name,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...bitmap.toJSON(),
      };
      addBitmap(image);
      navigate(PageUrl.EditBitmap.replace(':id', id), { replace: true });
    },
    [addBitmap, bitmap, navigate],
  );

  return (
    <Page title="Create bitmap from image">
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center gap-3">
        <h1>Create bitmap from image</h1>
        <ImportForm setBitmap={setBitmap} onSubmit={onSubmit} />
        {bitmap && <BitmapView bitmap={bitmap} />}
      </main>
    </Page>
  );
};

export default ImportFromImage;
