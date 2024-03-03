import cn from 'classnames';
import { useId, forwardRef } from 'react';
import { useFormState } from 'react-hook-form';

interface RangeProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Range = forwardRef<HTMLInputElement, RangeProps>(({ label, className, ...props }, ref): JSX.Element => {
  const id = useId();
  const name = props.name!;
  const { errors } = useFormState();
  const error = errors[name];
  const errorMessage = error?.message as string;
  return (
    <div className={className}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        type="range"
        className={cn('form-range', (error || errorMessage) && 'is-invalid')}
        id={id}
        ref={ref}
        {...props}
      />
    </div>
  );
});
