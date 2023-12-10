import cn from 'classnames';
import { useId, forwardRef } from 'react';
import { useFormState } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, ...props }, ref): JSX.Element => {
  const id = useId();
  const name = props.name!;
  const { errors } = useFormState();
  const error = errors[name];
  const errorMessage = error?.message as string;
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        type="text"
        className={cn('form-control', (error || errorMessage) && 'is-invalid')}
        id={id}
        ref={ref}
        {...props}
      />
      {errorMessage && <div className="invalid-feedback">{errorMessage}</div>}
    </div>
  );
});
