import { UINT8_BITS_PER_ELEMENT } from '@/utils/bitmap';
import { Alert } from '../Alert';

interface DistortedBitmapAlertProps {
  bitmapWidth: number;
  className?: string;
}

export const DistortedBitmapAlert = ({ bitmapWidth, className }: DistortedBitmapAlertProps) => {
  if (bitmapWidth % UINT8_BITS_PER_ELEMENT === 0) {
    return null;
  }
  return (
    <Alert type="danger" className={className}>
      <div className="d-flex gap-1">
        <i className="bi bi-exclamation-triangle" />
        The width ({bitmapWidth}) of your image is not a multiple of 8, this may cause distortion in the display.
      </div>
    </Alert>
  );
};
