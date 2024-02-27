import { Page } from '@/components/Page';
import { useBitmapStore } from '@/store/bitmaps/useBitmapsStore';
import { BitmapEntity } from '@/utils/bitmap/types';
import { useCallback, useState } from 'react';
import { FinalForm } from './FinalForm';
import { FileForm } from './FileForm';
import { useNavigate } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';

const ImportFromJson = () => {
  const navigate = useNavigate();
  const { findBitmap } = useBitmapStore();
  const [entities, setEntities] = useState<BitmapEntity[] | null>(null);

  const handleFinish = useCallback(() => {
    navigate(PageUrl.BitmapList);
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
    <Page title="Import bitmap from JSON">
      <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center gap-3">
        <h1>Import bitmap from JSON</h1>
        {entities ? <FinalForm entities={entities} onFinish={handleFinish} /> : <FileForm onNext={handleNext} />}
      </main>
    </Page>
  );
};

export default ImportFromJson;
