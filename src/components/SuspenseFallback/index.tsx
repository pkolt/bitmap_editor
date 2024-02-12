import cn from 'classnames';
import styles from './index.module.css';

export const SuspenseFallback = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className={cn('spinner-border', styles.spinner)} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
