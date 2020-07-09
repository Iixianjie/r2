import { create } from '../../src';

const userM = create({
  namespace: 'user',
  middleware: [],
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

// const us = userM.subscribe(state => {
//   console.log('change', state);
// });
//
// setTimeout(us, 2000);

export default userM;
