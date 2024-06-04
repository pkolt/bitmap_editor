import { renderComponent, test, screen, expect } from '@/test-utils';
import { ErrorBoundary } from './';

test('no error', () => {
  renderComponent(<ErrorBoundary />);
  const elem = screen.queryByText('Error');
  expect(elem).toBeNull();
});

test('with error', () => {
  renderComponent(<ErrorBoundary error={new Error('BUG')} />);
  const elem = screen.queryByText('BUG');
  expect(elem).not.toBeNull();
});
