// They will be run before each test file.

import { DateTime } from 'luxon';
import { cleanup } from '@testing-library/react';
import { Settings } from 'luxon';
import { afterEach, vi } from 'vitest';
import { setupMatchers } from './test-utils/matchers';
import './i18n';

setupMatchers();

// Fix timezone
Settings.defaultZone = 'America/Los_Angeles';
// Fix locale
Settings.defaultLocale = 'en-US';

const date = DateTime.fromObject({ year: 2024, month: 5, day: 1 });
vi.setSystemTime(date.toMillis());

// Apply mocks from __mocks__ folder
vi.mock('zustand');
vi.mock('zustand/middleware');

// https://testing-library.com/docs/react-testing-library/api/#cleanup
// https://github.com/vitest-dev/vitest/issues/1430
// Use cleanup if vitest config `globals: false`
afterEach(cleanup);
