import { UINT8_BITS } from '@/utils/bitmap/constants';
import Alert from 'react-bootstrap/Alert';

interface BitmapSizeAlertProps {
  bitmapWidth: number;
  className?: string;
}

export const BitmapSizeAlert = ({ bitmapWidth, className }: BitmapSizeAlertProps) => {
  if (
    typeof bitmapWidth !== 'number' ||
    Number.isNaN(bitmapWidth) ||
    bitmapWidth <= 0 ||
    bitmapWidth % UINT8_BITS === 0
  ) {
    return null;
  }
  const leftValue = Math.floor(bitmapWidth / 8) * UINT8_BITS;
  const rightValue = Math.ceil(bitmapWidth / 8) * UINT8_BITS;
  return (
    <Alert variant="danger" className={className} dismissible>
      <div className="d-flex gap-1">
        <i className="bi-exclamation-triangle" />
        The width ({bitmapWidth}) of your image is not a multiple of 8, this may cause distortion in the display. Maybe{' '}
        {leftValue} or {rightValue}?
      </div>
    </Alert>
  );
};
