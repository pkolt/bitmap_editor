import { SortDirection } from '../types';

interface Props {
  direction: SortDirection;
  onClick: () => void;
  children: string;
}

const Config: Record<SortDirection, { className: string }> = {
  [SortDirection.NONE]: { className: 'bi-filter-circle' },
  [SortDirection.DESC]: { className: 'bi-sort-down' },
  [SortDirection.ASC]: { className: 'bi-sort-up-alt' },
};

export const SortButton = ({ direction, onClick, children }: Props) => {
  const { className } = Config[direction];
  return (
    <div className="d-flex align-items-center gap-2 user-select-none" role="button" onClick={onClick}>
      {children} <i className={className} />
    </div>
  );
};
