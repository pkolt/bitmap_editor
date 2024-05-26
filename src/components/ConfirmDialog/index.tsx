import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps extends React.PropsWithChildren {
  show: boolean;
  title: string;
  onClose: () => void;
  onAccept: () => void;
}

export const ConfirmDialog = ({ show, title, onClose, onAccept, children }: ConfirmDialogProps) => {
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {t('Cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onAccept();
            onClose();
          }}>
          {t('Accept')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
