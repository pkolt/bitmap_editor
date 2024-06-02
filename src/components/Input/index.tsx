import { useId, forwardRef } from 'react';
import { useFormState } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

interface InputProps
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'onChange' | 'onBlur' | 'autoFocus' | 'type' | 'accept' | 'className' | 'id'
  > {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, className, id, ...props },
  ref,
): JSX.Element {
  const defaultId = useId();
  const name = props.name!;
  const { errors } = useFormState();
  const error = errors[name];
  const errorMessage = error?.message as string;
  const isInvalid = !!errorMessage;
  return (
    <Form.Group className={className} controlId={id ?? defaultId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control isInvalid={isInvalid} ref={ref} {...props} />
      {isInvalid && <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>}
    </Form.Group>
  );
});
