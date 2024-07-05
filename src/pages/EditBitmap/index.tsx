import { BitmapEditor } from '@/components/BitmapEditor';
import { Page } from '@/components/Page';
import { PageUrl } from '@/constants/urls';
import { useBitmapsStore } from '@/stores/bitmaps';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';

const EditBitmap = () => {
  const { id } = useParams();
  const { findBitmap } = useBitmapsStore();
  const { t } = useTranslation();
  const image = findBitmap(id ?? '');

  if (!image || !id) {
    return <Navigate to={PageUrl.Home} replace />;
  }

  return (
    <Page title={`${t('Edit bitmap:')} ${image.name}`} hideTitle>
      <BitmapEditor bitmapId={id} />
    </Page>
  );
};

export default EditBitmap;
