// They will be run before each test file.

import { Settings } from 'luxon';
import { vi } from 'vitest';

// Fix timezone
Settings.defaultZone = 'America/Los_Angeles';
// Fix locale
Settings.defaultLocale = 'en-US';

const date = new Date(2024, 5, 1);
vi.setSystemTime(date);
