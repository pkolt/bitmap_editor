import { test, renderComponent, screen, expect } from '@/test-utils';
import { vi } from 'vitest';
import { UpdatePwaDialog } from '.';
import * as utilsModule from './utils';

test('hidden dialog', () => {
  renderComponent(<UpdatePwaDialog />);
  const acceptButton = screen.queryByText('Accept');
  expect(acceptButton).toBeNull();
});

test('show dialog', async () => {
  const spyRequestUpdate = vi.spyOn(utilsModule, 'subscribePwaRequestUpdate');
  spyRequestUpdate.mockImplementationOnce((handler) => {
    handler();
    return () => {};
  });
  const spyAcceptUpdate = vi.spyOn(utilsModule, 'pwaAcceptUpdate');
  const { userEvent } = renderComponent(<UpdatePwaDialog />);
  const acceptButton = screen.getByText('Accept');
  await userEvent.click(acceptButton);
  expect(spyAcceptUpdate).toHaveBeenCalled();
});
