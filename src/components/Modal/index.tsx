import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Modal as ModalBootstrap } from 'bootstrap';

interface ModalProps {
  title: string;
  onAccept?: () => void;
  onClose: () => void;
  children: JSX.Element | JSX.Element[];
}

export const Modal: React.FC<ModalProps> = ({ title, onAccept, onClose, children }) => {
  const [modal, setModal] = useState<ModalBootstrap | null>(null);

  const handleClose = useCallback(() => {
    if (modal) {
      modal.hide();
    }
    onClose();
  }, [modal, onClose]);

  const handleAccept = useCallback(() => {
    if (onAccept) {
      onAccept();
    }
    handleClose();
  }, [handleClose, onAccept]);

  const setModalRef = useCallback(
    (elem: HTMLDivElement | null) => {
      if (!elem) {
        setModal(null);
        return;
      }
      const modalInstance = ModalBootstrap.getOrCreateInstance(elem);
      // Show modal on mount component
      modalInstance.show();
      // Subscribe on close modal
      // https://github.com/twbs/bootstrap/blob/main/js/src/modal.js
      if (elem && handleClose) {
        elem.addEventListener('hidden.bs.modal', handleClose);
      }
      setModal(modalInstance);
    },
    [handleClose],
  );

  const element = (
    <div className="modal" tabIndex={-1} ref={setModalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose} />
          </div>
          <div className="modal-body">{children}</div>
          {onAccept && (
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAccept}>
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(element, document.body);
};
