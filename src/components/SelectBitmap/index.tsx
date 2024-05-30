import { BitmapEntity } from '@/utils/bitmap/types';
import { CheckBox } from '../CheckBox';
import { useCallback, useMemo } from 'react';
import { isEqualArrays } from './utils';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface SelectBitmapProps {
  name: string;
  bitmaps: BitmapEntity[];
  className?: string;
}

export const SelectBitmap = ({ name, bitmaps, className }: SelectBitmapProps) => {
  const { t } = useTranslation();
  const { watch, setValue, register } = useFormContext();

  const selectedIds = watch(name);
  const allIds = useMemo(() => bitmaps.map((it) => it.id), [bitmaps]);
  const isSelectedAll = isEqualArrays(selectedIds, allIds);
  const toggleSelectAll = useCallback(() => {
    setValue(name, isSelectedAll ? [] : allIds);
  }, [allIds, isSelectedAll, name, setValue]);
  const isShowSelectedAll = bitmaps.length > 2;

  return (
    <div className={className}>
      {isShowSelectedAll && (
        <>
          <CheckBox label={t('Select all')} checked={isSelectedAll} onChange={toggleSelectAll} />
          <hr />
        </>
      )}
      {bitmaps.map((it) => (
        <CheckBox
          key={it.id}
          label={`${it.name} (${it.width}x${it.height})`}
          value={it.id}
          {...register(name, { required: true })}
        />
      ))}
    </div>
  );
};
