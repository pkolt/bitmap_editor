import { v4 as uuidv4 } from 'uuid';
import { Page } from '@/components/Page';
import { useCallback, useState } from 'react';
import { Bitmap } from '@/utils/bitmap/Bitmap';
import { BitmapView } from '@/components/BitmapEditor/components/BitmapView';
import { BitmapEntity } from '@/utils/bitmap/types';
import { DateTime } from 'luxon';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { useBitmapsStore } from '@/stores/bitmaps';
import { PageUrl } from '@/constants/urls';
import { FormValues } from './ImportForm/types';
import { ImportForm } from './ImportForm';
import { requiredValue } from '@/utils/requiredValue';
import { useTranslation } from 'react-i18next';
import { ImportFromImagePageState } from './types';

const ImportFromImage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { imageUrl } = (location.state ?? {}) as ImportFromImagePageState;
  const { addBitmap } = useBitmapsStore();
  const [bitmap, setBitmap] = useState<Bitmap | null>(null);
  const { t } = useTranslation();

  const onSubmit = useCallback(
    (data: FormValues) => {
      const newBitmap = requiredValue(bitmap);
      const id = uuidv4();
      const timestamp = DateTime.now().toMillis();
      const image: BitmapEntity = {
        id,
        name: data.name,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...newBitmap.toJSON(),
      };
      addBitmap(image);
      const url = generatePath(PageUrl.EditBitmap, { id });
      navigate(url, { replace: true });
    },
    [addBitmap, bitmap, navigate],
  );

  return (
    <Page title={t('Create bitmap from image')}>
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center gap-3">
        <h1>{t('Create bitmap from image')}</h1>
        <ImportForm setBitmap={setBitmap} onSubmit={onSubmit} imageUrl={imageUrl} />
        {bitmap && <BitmapView bitmap={bitmap} />}
      </main>
    </Page>
  );
};

export default ImportFromImage;
