import { UINT8_BITS_PER_ELEMENT } from '@/utils/bitmap/constants';
import { Alert } from '../Alert';

interface BitmapSizeAlertProps {
  bitmapWidth: number;
  className?: string;
}

export const BitmapSizeAlert = ({ bitmapWidth, className }: BitmapSizeAlertProps) => {
  if (bitmapWidth % UINT8_BITS_PER_ELEMENT === 0) {
    return null;
  }
  const leftValue = Math.floor(bitmapWidth / 8) * UINT8_BITS_PER_ELEMENT;
  const rightValue = Math.ceil(bitmapWidth / 8) * UINT8_BITS_PER_ELEMENT;
  return (
    <Alert type="danger" className={className}>
      <div className="d-flex gap-1">
        <i className="bi bi-exclamation-triangle" />
        The width ({bitmapWidth}) of your image is not a multiple of 8, this may cause distortion in the display. Maybe{' '}
        {leftValue} or {rightValue}?
      </div>
    </Alert>
  );
};
