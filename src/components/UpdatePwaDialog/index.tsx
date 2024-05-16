import { useCallback, useEffect, useState } from 'react';
import { pwaAcceptUpdate, subscribePwaRequestUpdate } from './utils';
import { Modal } from '../Modal';

export const UpdatePwaDialog = () => {
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

  if (isShow) {
    return (
      <Modal title="Update PWA" onAccept={onAccept} onClose={onClose}>
        <p>Update PWA and reload page?</p>
      </Modal>
    );
  }
  return null;
};
