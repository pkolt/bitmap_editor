import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GridSettings {
  rowSize: number;
  columnSize: number;
  visibleRows: boolean;
  visibleColumns: boolean;
}

interface SettingsState {
  grid: GridSettings;
  setGrid: (grid: GridSettings) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      grid: { rowSize: 8, columnSize: 8, visibleRows: false, visibleColumns: false },
      setGrid: (grid) => set(() => ({ grid })),
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
