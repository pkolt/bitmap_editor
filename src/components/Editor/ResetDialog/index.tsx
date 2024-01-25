import { Modal } from '@/components/Modal';

interface ResetDialogProps {
  onAccept: () => void;
  onClose: () => void;
}

export const ResetDialog = ({ onAccept, onClose }: ResetDialogProps): JSX.Element => {
  return (
    <Modal title="Reset bitmap" onClose={onClose} onAccept={onAccept}>
      <p>Reset bitmap?</p>
    </Modal>
  );
};
