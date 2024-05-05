// They will be run before each test file.

import { cleanup } from '@testing-library/react';
import { Settings } from 'luxon';
import { afterEach, vi } from 'vitest';

// Fix timezone
Settings.defaultZone = 'America/Los_Angeles';
// Fix locale
Settings.defaultLocale = 'en-US';

const date = new Date(2024, 5, 1);
vi.setSystemTime(date);

// https://testing-library.com/docs/react-testing-library/api/#cleanup
// https://github.com/vitest-dev/vitest/issues/1430
// Use cleanup if vitest config `globals: false`
afterEach(cleanup);
