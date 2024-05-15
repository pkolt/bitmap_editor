import { FakeCanvas } from '@/test-utils/canvas';
import { vi } from 'vitest';

export const getCanvas = vi.fn(() => new FakeCanvas());
