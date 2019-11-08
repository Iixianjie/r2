import signModel from '../signModel';
import { Model, ReducerFn, EffectFn } from '@/types';

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

type M1 = Model<
  rootState['m1'],
  'put'
  >;

const m1: M1 = {
  state: {
    name: 'lxj',
  },
  reducers: {
    put(state, payload) {
      return { name: payload };
    },
  },
  effects: {}
};




interface M2 {
  state: { id: number; name: string }[];
  reducers: {
    add: ReducerFn<M2['state']>
  };
  effects: {
    getUserInfo: EffectFn<M2['state']>;
  }
}

type M22 = Model<
  rootState['m2'],

  | 'add', // 新增一条数据

  | 'getUserInfo' // 获取用户信息
  | 'setToken' // 设置token
>;

const m2: M22 = {
  state: [{ id: 1, name: '衣服' }],
  reducers: {
    add(state) {
      return state;
    }
  },
  effects: {
    getUserInfo() {

    },
    setToken() {

    }
  }
  // effects: {
    // getUserInfo: async (payload, { getState, dispatch }) => {
    //   console.log('effect start');
    //
    //   const res = await delay(1500);
    //
    //   console.log('effect end');
    //   dispatch(m2.reducers.add, res);
    //   return res;
    // },
  // },
};

export {
  m1,
  m2,
  rootState,
};

