import { expect } from 'vitest';

const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isDisable = (elem: unknown): boolean => {
  return isObject(elem) && 'disabled' in elem && !!elem.disabled;
};

const errorDisabled = 'Expected: "enabled", received: "disabled"';
const errorEnabled = 'Expected: "disabled", received: "enabled"';

export const setupMatchers = () => {
  expect.extend({
    toBeEnabled: function (received) {
      const { isNot } = this;
      return {
        pass: !isDisable(received),
        message: () => (isNot ? errorEnabled : errorDisabled),
      };
    },
    toBeDisabled: function (received) {
      const { isNot } = this;
      return {
        pass: isDisable(received),
        message: () => (isNot ? errorDisabled : errorEnabled),
      };
    },
  });
};
