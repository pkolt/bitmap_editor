import { bench } from '@/test-utils';
import { Bitmap } from './Bitmap';

bench('constructor (big size)', () => {
  new Bitmap(10000, 10000); // Test run long time (~40 seconds)
});
