import { coreStore } from '../../src';

import { test1, test3 } from './testm';

coreStore.init({
  middleware: [test3],
});
