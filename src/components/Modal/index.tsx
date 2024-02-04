import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Modal as BSModal } from 'bootstrap';

interface ModalProps {
  title: string;
  onAccept?: () => void;
  onClose: () => void;
  children: JSX.Element | JSX.Element[];
}

export interface ModalRef {
  close: () => void;
}

export const Modal = forwardRef<ModalRef, ModalProps>(({ title, onAccept, onClose, children }, ref) => {
  const bsModalRef = useRef<BSModal | null>(null);

  const handleClose = useCallback(() => {
    bsModalRef.current?.hide();
    onClose();
  }, [onClose]);

  const handleAccept = useCallback(() => {
    if (onAccept) {
      onAccept();
    }
    handleClose();
  }, [handleClose, onAccept]);

  const setModalRef = useCallback(
    (elem: HTMLDivElement | null) => {
      if (elem) {
        bsModalRef.current = new BSModal(elem); // init modal
        bsModalRef.current.show();
        elem.addEventListener('hidden.bs.modal', handleClose);
      } else {
        bsModalRef.current?.dispose(); // destroy modal
      }
    },
    [handleClose],
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        close() {
          handleClose();
        },
      };
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
});
