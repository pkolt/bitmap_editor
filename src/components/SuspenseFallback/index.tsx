import cn from 'classnames';
import styles from './index.module.css';
import { useTranslation } from 'react-i18next';

export const SuspenseFallback = () => {
  const { t } = useTranslation();
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className={cn('spinner-border', styles.spinner)} role="status">
        <span className="visually-hidden">{t('Loading')}...</span>
      </div>
    </div>
  );
};
