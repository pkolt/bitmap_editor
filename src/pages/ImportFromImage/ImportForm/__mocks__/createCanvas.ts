import { FakeCanvas } from '@/test-utils/canvas';
import { vi } from 'vitest';

export const createCanvas = vi.fn(() => new FakeCanvas());
