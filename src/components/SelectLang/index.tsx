import { useTranslation } from 'react-i18next';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LANGUAGES } from '@/constants/languages';

export const SelectLang = () => {
  const { i18n, t } = useTranslation();
  const selectedLang = i18n.language;
  return (
    <NavDropdown title={<i className="bi-translate h3" role="button" aria-label={t('Language')} />}>
      {LANGUAGES.map((it) => {
        const isActive = it.lang === selectedLang;
        return (
          <NavDropdown.Item
            key={it.lang}
            onClick={isActive ? undefined : () => i18n.changeLanguage(it.lang)}
            active={isActive}>
            {it.title}
          </NavDropdown.Item>
        );
      })}
    </NavDropdown>
  );
};
