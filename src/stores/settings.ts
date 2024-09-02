import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum SortValue {
  NONE = 0,
  ASC = 1,
  DESC = 2,
}

interface BitmapListSettings {
  nameSortValue: SortValue;
  dateSortValue: SortValue;
}

export interface GridSettings {
  rowSize: number;
  columnSize: number;
  visibleRows: boolean;
  visibleColumns: boolean;
}

interface SettingsState {
  grid: GridSettings;
  setGrid: (grid: GridSettings) => void;
  bitmapListSettings: BitmapListSettings;
  updateBitmapListSettings: (settings: Partial<BitmapListSettings>) => void;
}

const defaultSettings: GridSettings = { rowSize: 8, columnSize: 8, visibleRows: false, visibleColumns: false };
const defaultBitmapListSettings: BitmapListSettings = {
  nameSortValue: SortValue.DESC,
  dateSortValue: SortValue.DESC,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      grid: defaultSettings,
      setGrid: (settings) => set(() => ({ grid: settings })),
      bitmapListSettings: defaultBitmapListSettings,
      updateBitmapListSettings: (settings) =>
        set((state) => ({ bitmapListSettings: { ...state.bitmapListSettings, ...settings } })),
    }),
    {
      name: 'settings',
      version: 1, // a migration will be triggered if the version in the storage mismatches this one
      migrate: (persistedState, version) => {
        if (version === 0) {
          // if the stored value is in version 0, we convert data
          // ...
        }
        return persistedState as SettingsState;
      },
    },
  ),
);
