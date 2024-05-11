import { expect } from 'vitest';

const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isDisable = (elem: unknown): boolean => {
  return isObject(elem) && 'disabled' in elem && !!elem.disabled;
};

export const setupMatchers = () => {
  expect.extend({
    toBeEnabled: function (received) {
      const { isNot } = this;
      return {
        pass: !isDisable(received),
        message: () => `Control is${isNot ? '' : ' not'} enabled`,
      };
    },
    toBeDisabled: function (received) {
      const { isNot } = this;
      return {
        pass: isDisable(received),
        message: () => `Control is${isNot ? '' : ' not'} disabled`,
      };
    },
  });
};
