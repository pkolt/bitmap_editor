import { RenderOptions, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const renderElement = (elem: JSX.Element, options?: RenderOptions) => {
  const user = userEvent.setup();
  const result = render(elem, { ...options });
  return { user, ...result };
};
