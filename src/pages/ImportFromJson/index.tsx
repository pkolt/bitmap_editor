import { Page } from '@/components/Page';
import { useBitmapsStore } from '@/stores/bitmaps';
import { BitmapEntity } from '@/utils/bitmap/types';
import { useCallback, useState } from 'react';
import { FinalForm } from './FinalForm';
import { FileForm } from './FileForm';
import { useNavigate } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { useTranslation } from 'react-i18next';

const ImportFromJson = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { findBitmap } = useBitmapsStore();
  const [entities, setEntities] = useState<BitmapEntity[] | null>(null);

  const handleFinish = useCallback(() => {
    navigate(PageUrl.Home);
  }, [navigate]);

  const handleNext = useCallback(
    (values: BitmapEntity[]) => {
      const excludeExistsEntities = values.filter((it) => !findBitmap(it.id));
      if (excludeExistsEntities.length > 0) {
        setEntities(excludeExistsEntities);
      } else {
        handleFinish();
      }
    },
    [findBitmap, handleFinish],
  );

  return (
    <Page title={t('Import bitmap from JSON')}>
      {entities ? <FinalForm entities={entities} onFinish={handleFinish} /> : <FileForm onNext={handleNext} />}
    </Page>
  );
};

export default ImportFromJson;
