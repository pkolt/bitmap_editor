import { Footer } from '.';
import { render, expect, test } from '@/test-utils';

test('show component', () => {
  const { container } = render(<Footer />);
  expect(container).matchSnapshot();
});
