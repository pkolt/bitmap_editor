import { useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Modal as BSModal } from 'bootstrap';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  title: string;
  onAccept?: () => void;
  onClose: () => void;
  children: JSX.Element | JSX.Element[] | null;
}

export const Modal = ({ title, onAccept, onClose, children }: ModalProps) => {
  const { t } = useTranslation();
  const bsModalRef = useRef<BSModal | null>(null);

  const handleAccept = useCallback(() => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  }, [onClose, onAccept]);

  const setModalRef = useCallback(
    (elem: HTMLDivElement | null) => {
      if (elem) {
        bsModalRef.current = new BSModal(elem); // init modal
        bsModalRef.current.show();
        elem.addEventListener('hidden.bs.modal', onClose);
        // https://github.com/facebook/react/issues/23301
        (elem.querySelector('[data-bs-autofocus]') as HTMLInputElement | null)?.focus();
      } else {
        bsModalRef.current?.hide(); // reset body css classes
        bsModalRef.current?.dispose(); // destroy modal
        bsModalRef.current = null;
      }
    },
    [onClose],
  );

  const element = (
    <div className="modal" tabIndex={-1} ref={setModalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
          {onAccept && (
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                {t('Cancel')}
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAccept}>
                {t('Accept')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(element, document.body);
};
