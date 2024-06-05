import { Page } from '@/components/Page';
import { useTranslation } from 'react-i18next';
import { Item } from './Item';
import { Loading } from '@/components/Loading';
import { useFetchData } from './hooks/useFetchData';
import { useIcons } from './hooks/useIcons';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';
import { ImportFromImagePageState } from '../ImportFromImage/types';
import { ICONS_DIR_URL } from './constants';

const ImportFromCollections = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const { data } = useFetchData();
  const { icons } = useIcons({ data, searchText });

  const handleChangeSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }, []);

  const openImportFromImagePage = (filename: string) => {
    const imageUrl = `${ICONS_DIR_URL}${filename}`;
    const pageState = { imageUrl } satisfies ImportFromImagePageState;
    navigate(PageUrl.ImportFromImage, { state: pageState });
  };

  return (
    <Page title={t('Import from collections')}>
      <main className="d-flex flex-grow-1 flex-column gap-3">
        <h1 className="text-center">{t('Import from collections')}</h1>
        {!icons && <Loading />}
        {data && (
          <>
            <div className="d-flex justify-content-center mb-3">
              <InputGroup className="w-25">
                <InputGroup.Text>
                  <i className="bi-search" />
                </InputGroup.Text>
                <Form.Control type="search" placeholder={t('Search')} onChange={handleChangeSearch} />
              </InputGroup>
            </div>
            <div className="grid">
              {icons?.map((it) => {
                return (
                  <Item
                    key={it.name}
                    iconName={it.name}
                    className="g-col-2"
                    onClick={() => openImportFromImagePage(it.filename)}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </Page>
  );
};

export default ImportFromCollections;
