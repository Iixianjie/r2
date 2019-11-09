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
  | 'getUserInfo2' // 获取用户信息
>;

const m2: M22 = {
  state: [{ id: 1, name: '衣服' }],
  reducers: {
    add(state) {
      return state;
    }
  },
  effects: {
    async getUserInfo(action, { dispatch }) {
      console.log(1);

      await delay(1000);

      console.log(2);

      dispatch(m1.reducers.put, 'effect set');

      console.log(3);

      await delay(1000);

      console.log(4);

      await dispatch(m2.effects.getUserInfo2);

      console.log(6);

      return 7;
    },
    async getUserInfo2() {
      await delay(1000);
      console.log(5);
    },
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

// export {
//   m1,
//   m2,
//   rootState,
// };

