import * as zustand from 'zustand';
import { act } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

const { create: actualCreate } = await vi.importActual<typeof zustand>('zustand');

const storeResetFns = new Set<() => void>();

export const create = () => (<T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreate<T>((setState, getState, store) => {
    // Component rerender after change state
    const patchedSetState = (...args: Parameters<typeof setState>) => act(() => setState(...args));
    return stateCreator(patchedSetState, getState, store);
  });
  const initialState = store.getInitialState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
}) as typeof zustand.create;

// Reset all stores after each test run
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
