import { useCallback, useEffect, useState } from 'react';
import { pwaAcceptUpdate, subscribePwaRequestUpdate } from './utils';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../ConfirmDialog';

export const UpdatePwaDialog = () => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);

  const onAccept = pwaAcceptUpdate;

  const onClose = useCallback(() => {
    setIsShow(false);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribePwaRequestUpdate(() => {
      setIsShow(true);
    });
    return unsubscribe;
  });

  return isShow ? (
    <ConfirmDialog title={t('Update PWA')} onAccept={onAccept} onClose={onClose}>
      <p>{t('Update PWA and reload page?')}</p>
    </ConfirmDialog>
  ) : null;
};
