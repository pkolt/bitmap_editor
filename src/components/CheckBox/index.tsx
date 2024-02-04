import cn from 'classnames';
import { forwardRef, useId } from 'react';

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ label, className, ...props }: CheckBoxProps, ref) => {
    const id = useId();
    return (
      <div className={cn('form-check', className)}>
        <input type="checkbox" className="form-check-input" id={id} ref={ref} {...props} />
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      </div>
    );
  },
);
