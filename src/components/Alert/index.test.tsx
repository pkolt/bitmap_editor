import { Alert } from '.';
import { expect, describe, it } from 'vitest';
import { render } from '@testing-library/react';

describe('Alert', () => {
  it('show component', () => {
    const { container } = render(
      <Alert type="warning">
        <div>Test</div>
      </Alert>,
    );
    expect(container).matchSnapshot();
  });
});
