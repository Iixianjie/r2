import modelsFormat from './modelsFormat';
import { createStore, compose, applyMiddleware, Store, Dispatch, Middleware } from 'redux';
import { m1, m2, rootState } from './demo/test';

import { CreateStoreOptions, Model } from './types';

const coreMiddleware = (store: Store) => (next: Dispatch) => (action: any, payload: any) => {
  const singKey = action.signKey;
  /* 普通action */
  if (!singKey) {
    next(action);
    return;
  }

  const [namespace, patchType] = singKey.split('.');
  const state = store.getState();
  const modelState = state[namespace];

  /* 函数reducer */
  if (patchType === 'reducer') {
    next({
      type: singKey,
      __localState: { [namespace]: action(modelState, payload) },
      __fnReducer: true, // 标记为函数reducer
    });
    return;
  }

  if (patchType === 'effects') {

    // if (action.then) {
      try {
        // 为action的开始和结束派发一个空的action，便于回滚和调试
        next({ type: `@@START ${singKey}` });
        return action(payload, {
          dispatch: store.dispatch,
          getState: store.getState,
        });
      } finally {
        next({ type: `@@END ${singKey}` });
      }
    // }
    return;
  }

  next(action);
};

/**
 * <S>: 整个state树的类型
 * */
const createStoreEnhance = <S>({ models, initState, enhancer }: CreateStoreOptions<S>) => {
  const state: S = modelsFormat(models);

  function AppReducer(AppState: S = state, { type, ...payload }: any) {
    /* 处理函数reducer */
    if (payload.__fnReducer) {
      return { ...AppState, ...payload.__localState };
    }

    return AppState;
  }

  const enhances = compose(
    applyMiddleware(coreMiddleware as any),
  );

  return createStore(AppReducer, initState, enhances);
};

const store = createStoreEnhance<rootState>({
  models: {
    m1,
    m2,
  },
});

// @ts-ignore
console.log(window._state = store, window._m1 = m1, window._m2 = m2);

store.subscribe(() => {
  console.log('state', store.getState());
});

export default createStoreEnhance;
