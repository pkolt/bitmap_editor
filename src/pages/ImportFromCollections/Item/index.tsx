import cn from 'classnames';
import Button from 'react-bootstrap/Button';

interface ItemProps {
  iconName: string;
  className?: string;
  onClick: () => void;
}

export const Item = ({ iconName, className, onClick }: ItemProps) => {
  return (
    <div className={cn('d-flex flex-column align-items-center gap-1', className)} data-testid="item">
      <Button variant="light" size="lg" className="p-5 rounded" onClick={onClick} aria-label={iconName}>
        <i className={`bi-${iconName} h1`} />
      </Button>
      <small className="text-black-50">{iconName}</small>
    </div>
  );
};
