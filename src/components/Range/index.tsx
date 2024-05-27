import { useId, forwardRef } from 'react';
import Form from 'react-bootstrap/Form';

interface RangeProps
  extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'onChange' | 'onBlur' | 'min' | 'max' | 'step'> {
  label: string;
  className?: string;
}

export const Range = forwardRef<HTMLInputElement, RangeProps>(function Range(
  { label, className, ...props },
  ref,
): JSX.Element {
  const id = useId();
  return (
    <Form.Group className={className} controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Range ref={ref} {...props} />
    </Form.Group>
  );
});
