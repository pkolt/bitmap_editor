import { PageUrl } from '@/constants/urls';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const ButtonList = () => {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-column gap-3">
      <Link to={PageUrl.CreateBitmap} className="btn btn-primary btn-lg">
        {t('Create new bitmap')}
      </Link>
      <Link to={PageUrl.ImportFromImage} className="btn btn-primary btn-lg">
        {t('Import from image')}
      </Link>
      <Link to={PageUrl.ImportFromJson} className="btn btn-primary btn-lg">
        {t('Import from JSON')}
      </Link>
    </div>
  );
};
