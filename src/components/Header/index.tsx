import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { SelectLang } from '../SelectLang';
import { Link } from 'react-router-dom';
import { PageUrl } from '@/constants/urls';

export const Header = () => {
  const { t } = useTranslation();
  return (
    <Navbar className="bg-body-tertiary rounded-bottom-2 p-2">
      <Container fluid>
        <Navbar.Brand as={Link} to={PageUrl.Home} className="d-flex gap-2 align-items-center">
          <i className="bi bi-border-all display-6" />
          <div className="d-flex flex-column">
            <div className="lh-sm">Bitmap Editor</div>
            <div className="h6 text-body-tertiary mb-0">{t('Create bitmap image for OLED display')}</div>
          </div>
        </Navbar.Brand>

        <div className="ms-auto d-flex align-items-center gap-3">
          <Nav>
            <SelectLang />
          </Nav>

          <a href="https://github.com/pkolt/bitmap_editor" target="_blank" rel="noreferrer" className="h3 m-0">
            <i className="bi bi-github" />
          </a>
        </div>
      </Container>
    </Navbar>
  );
};
