import { useBitmapStore } from '@/stores/bitmaps';
import { useSettingsStore } from '@/stores/settings';
import { afterEach } from 'vitest';
import { act } from '@testing-library/react';

export const setupStores = () => {
  afterEach(() => {
    act(() => {
      useBitmapStore.getState().reset();
      useSettingsStore.getState().reset();
    });
  });
};
