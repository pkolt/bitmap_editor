import { Cat } from '.';
import { expect, describe, it } from 'vitest';
import { render } from '@testing-library/react';

describe('Alert', () => {
  it('show component', () => {
    const { container } = render(<Cat />);
    expect(container).matchSnapshot();
  });
});
