import { create } from '../../src';
import log from '../../src/log';
import cache from '../../src/cache';

const userM = create({
  namespace: 'user',
  middleware: [log, cache],
  state: {
    name: 'lxj',
    age: 18,
  },
  actions: {
    setName() {
      userM.set({
        name: String(Math.random()),
      });
    },
  },
});

const us = userM.subscribe(state => {
  console.log('change', state);
});

// setTimeout(us, 2000);

export default userM;
