import { SortValue } from '@/stores/settings';

interface Props {
  direction: SortValue;
  onClick: () => void;
  children: string;
}

const Config: Record<SortValue, { className: string }> = {
  [SortValue.NONE]: { className: 'bi-filter-circle' },
  [SortValue.DESC]: { className: 'bi-sort-down' },
  [SortValue.ASC]: { className: 'bi-sort-up-alt' },
};

export const SortButton = ({ direction, onClick, children }: Props) => {
  const { className } = Config[direction];
  return (
    <div className="d-flex align-items-center gap-2 user-select-none" role="button" onClick={onClick}>
      {children} <i className={className} />
    </div>
  );
};
