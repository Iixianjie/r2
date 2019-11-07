import signModel from '../signModel';
import { Model } from '@/types';


interface rootState {
  m1: {
    name: string;
  };
  m2: {
    id: number;
    name: string;
  }[];
}


const delay = (ms: number) => {
  return new Promise((resolve, eject) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  })
};

const m1: Model<rootState['m1']> = {
  state: {
    name: 'lxj',
  },
  reducers: {
    put(state, payload) {
      return { name: payload };
    },
  },
};

const m2: Model<rootState['m2']> = {
  state: [{ id: 1, name: '衣服' }],
  reducers: {
    // 'delete' (state) {
    //   return state;
    // },
    add(state, payload) {
      console.log(12312);
      return [{ id: 1, name: payload }];
    },
  },
  effects: {
    async getUserInfo(payload, { getState, dispatch }) {
      console.log(1);
      console.log(2);

      const res = await delay(1500);

      console.log(3);
      console.log(4);
      dispatch(m2!.reducers!.add, res);
      return res;
    },
  },
};

export {
  m1,
  m2,
  rootState,
};

