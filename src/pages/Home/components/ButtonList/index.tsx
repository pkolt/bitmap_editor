import { PageUrl } from '@/constants/urls';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

export const ButtonList = () => {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-column gap-3 w-25">
      <Link to={PageUrl.CreateBitmap} className="btn btn-primary btn-lg">
        {t('Create')}
      </Link>
      <Dropdown align="end">
        <Dropdown.Toggle size="lg" className="w-100">
          {t('Import')}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={PageUrl.ImportFromImage}>
            {t('From image')}
          </Dropdown.Item>
          <Dropdown.Item as={Link} to={PageUrl.ImportFromCollections}>
            {t('From collections')}
          </Dropdown.Item>
          <Dropdown.Item as={Link} to={PageUrl.ImportFromJson}>
            {t('From JSON')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
