import { render as originRender } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';

// Re-export
export * from 'vitest';

// Re-export
export * from '@testing-library/react';

type RenderArgs = Parameters<typeof originRender>;
type RenderResult = ReturnType<typeof originRender> & { user: UserEvent };
type RenderFn = (...args: RenderArgs) => RenderResult;

export const render: RenderFn = (elem, options) => {
  const user = userEvent.setup();
  const result = originRender(elem, options);
  return { user, ...result };
};
