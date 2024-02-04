import cn from 'classnames';
import { Alert as BSAlert } from 'bootstrap';
import { useCallback, useRef } from 'react';

type AlertType = 'warning';

interface AlertProps {
  type: AlertType;
  children: JSX.Element | JSX.Element[];
  className?: string;
}

export const Alert = ({ type, children, className }: AlertProps) => {
  const bsAlertRef = useRef<BSAlert | null>(null);
  const setRef = useCallback((elem: HTMLElement | null) => {
    if (elem) {
      bsAlertRef.current = new BSAlert(elem); // init component
    } else {
      bsAlertRef.current?.dispose(); // destroy component
      bsAlertRef.current = null;
    }
  }, []);
  return (
    <div className={cn('alert alert-dismissible fade show', `alert-${type}`, className)} role="alert" ref={setRef}>
      {children}
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
    </div>
  );
};
