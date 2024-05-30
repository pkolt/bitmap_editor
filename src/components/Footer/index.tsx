import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  const startProjYear = 2023;
  const currentYear = DateTime.local().year;
  const years = `${startProjYear}-${currentYear}`;
  return (
    <footer className="container-fluid p-3 bg-light text-center rounded-top-2">
      {t('Created by')} <a href="https://github.com/pkolt">Pavel Koltyshev</a> &copy; {years}
    </footer>
  );
};
