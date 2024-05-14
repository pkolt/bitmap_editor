import { test, expect } from '@/test-utils';
import { requiredValue } from './requiredValue';

test('valid value', () => {
  expect(requiredValue('foo')).toBe('foo');
});

test('value is null', () => {
  expect(() => requiredValue(null)).toThrowError();
});

test('value is undefined', () => {
  expect(() => requiredValue(undefined)).toThrowError();
});
