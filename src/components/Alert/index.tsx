import cn from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type AlertType = 'danger' | 'warning';

interface AlertProps {
  type: AlertType;
  children: JSX.Element | JSX.Element[];
  className?: string;
}

export const Alert = ({ type, children, className }: AlertProps): JSX.Element | null => {
  const { t } = useTranslation();
  const [isHidden, setIsHidden] = useState(false);
  const handleClose = () => setIsHidden(true);

  if (isHidden) {
    return null;
  }

  return (
    <div className={cn('alert alert-dismissible mb-0', `alert-${type}`, className)} role="alert">
      {children}
      <button type="button" className="btn-close" aria-label={t('Close')} onClick={handleClose} />
    </div>
  );
};
