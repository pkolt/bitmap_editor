import { test, expect } from '@/test-utils';
import { capitalize } from './string';

test('capitalize', () => {
  expect(capitalize('foo')).toBe('Foo');
});

test('capitalize empty', () => {
  expect(capitalize('')).toBe('');
});
