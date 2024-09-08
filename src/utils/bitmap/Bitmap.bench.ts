import { bench } from '@/test-utils';
import { Bitmap } from './Bitmap';

bench('constructor (big size)', () => {
  Bitmap.create(10000, 10000); // Test run long time (~40 seconds)
});
