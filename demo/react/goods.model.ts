import { create } from '../../src';

const delay = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
};

const goodsM = create({
  namespace: 'goods',
  state: {
    list: [] as string[],
    date: Date.now(),
  },
  actions: {
    async getGoods() {
      await delay(1500);

      goodsM.set({
        list: ['苹果', '梨子', '橙子'],
        date: Date.now(),
      });
    },
    rollbackList() {
      goodsM.set({
        list: [],
      });
    },
  },
});

export default goodsM;
