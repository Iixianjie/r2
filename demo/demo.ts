import create from '../src';

const delay = (ms: number) => {
  return new Promise((resolve, eject) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
};

const user = create({
  namespace: 'user',
  state: {
    name: 'lxj',
    age: 18,
  },
  actions: {},
});

const goods = create({
  namespace: 'goods',
  state: {
    list: [] as any,
    page: 1,
  },
  actions: {
    // 纯函数，set等通过api接收
    getList(age: string) {
      const list = ['香蕉', '苹果', '梨子'];

      goods.set({
        list,
      });
    },
    async getListAsync(age: string) {
      await delay(2000);

      goods.set({
        list: ['荔枝', '李子'],
      });
    },
  },
});

// console.log(user, goods);
//
// goods.subscribe(state => {
//   console.log('sub', state);
// });
//
// goods.actions.getList('123');
// goods.actions.getList('123');
//
// goods.actions.getList('123');
// goods.actions.getList('123');
// goods.actions.getListAsync('123').then(() => {
//   console.log('then');
// });
