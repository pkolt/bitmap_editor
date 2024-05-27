import { forwardRef, useId } from 'react';
import Form from 'react-bootstrap/Form';

interface CheckBoxProps
  extends Pick<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'onChange' | 'onBlur' | 'checked' | 'value'> {
  label: string;
  type?: 'checkbox' | 'radio' | 'switch';
  className?: string;
}

export const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(function CheckBox(
  { label, className, type, ...props }: CheckBoxProps,
  ref,
) {
  const id = useId();
  return <Form.Check type={type} className={className} ref={ref} label={label} id={id} {...props} />;
});
