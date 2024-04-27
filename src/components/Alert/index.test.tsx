import { Alert } from '.';
import { render, expect, test } from '@/test-utils';

test('show component', () => {
  const { container } = render(
    <Alert type="warning">
      <div>Test</div>
    </Alert>,
  );
  expect(container).matchSnapshot();
});
