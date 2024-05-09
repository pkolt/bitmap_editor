import { Alert } from '.';
import { expect, test, renderComponent, screen } from '@/test-utils';

test('show component', () => {
  renderComponent(
    <Alert type="warning">
      <div>Test</div>
    </Alert>,
  );
  expect(screen.queryByText('Test')).not.toBeNull();
});

test('close alert', async () => {
  const { userEvent } = renderComponent(
    <Alert type="danger">
      <div>Test</div>
    </Alert>,
  );
  const closeBtn = screen.getByRole('button');
  await userEvent.click(closeBtn);
  expect(screen.queryByText('Test')).toBeNull();
});
