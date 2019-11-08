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

interface M1 {
  state: { name: string };
  reducers: {
    put: ReducerFn<M1['state']>
  };
}

const m1: M1 = {
  state: {
    name: 'lxj',
  },
  reducers: {
    put(state, payload) {
      return { name: payload };
    },
  },
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

const m2: M2 = {
  state: [{ id: 1, name: '衣服' }],
  reducers: {
    add(state, payload) {
      return [{ id: 1, name: payload }];
    },
  },
  effects: {
    getUserInfo: async (payload, { getState, dispatch }) => {
      console.log('effect start');

      const res = await delay(1500);

      console.log('effect end');
      dispatch(m2.reducers.add, res);
      return res;
    },
  },
};

export {
  m1,
  m2,
  rootState,
};

