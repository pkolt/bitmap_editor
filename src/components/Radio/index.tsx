import cn from 'classnames';
import { forwardRef, useId } from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ label, className, ...props }: RadioProps, ref) => {
  const id = useId();
  return (
    <div className={cn('form-check', className)}>
      <input type="radio" className="form-check-input" id={id} ref={ref} {...props} />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});
