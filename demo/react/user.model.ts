import { create } from '../../src';

const userM = create({
  namespace: 'user',
  state: {
    name: 'lxj',
    age: 18,
  },
  actions: {
    setName() {
      userM.set(prev => ({
        name: String(Math.random()),
        age: prev.age - 1,
      }));
    },
  },
});
//
// const us = userM.subscribe(state => {
//   console.log('change', state);
// });
//
// setTimeout(us, 2000);

export default userM;
