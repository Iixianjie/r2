import {
  createStore, compose, applyMiddleware,
  StoreEnhancer, // 类型
} from 'redux';

import modelsFormat from './common/modelsFormat';
import coreMiddleware from './middleware/coreMiddleware';
import coreEnhance from './enhancer/coreEnhance';
import reduxCacheFactory from './enhancer/reduxCache';

import { CreateStoreEnhanceOptions, DispatchExt } from './types';

/**
 * 创建store
 * <S>: 整个state树的类型
 * */
const createStoreEnhance = <S>({ models, initState, enhancer }: CreateStoreEnhanceOptions<S>) => {
  /* 根据models合成初始state */
  const state: S = modelsFormat<S>(models);

  function App(rootState: S = state) {
    return rootState;
  }

  /* ======== 在包含devtool的环境开启devtool支持 ======== */
  let composeEnhancers = compose;
  let enhances = null;

  if (
    process.env.NODE_ENV === 'development' &&
    window &&
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) {
    // @ts-ignore
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  /* 添加内置的enhancer */
  const enhanceSpread = [
    applyMiddleware<DispatchExt, S>(coreMiddleware),
    coreEnhance,
  ];

  if (enhancer) {
    enhanceSpread.push(enhancer);
  }

  enhances = composeEnhancers(...enhanceSpread);

  return createStore(App, initState, enhances as StoreEnhancer);
};

// const store = createStoreEnhance<rootState>({
//   models: {
//     m1,
//     m2,
//   },
//   initState: {
//     m1: { name: '213' },
//     m2: [{ name: '123213', id: 123213 }],
//   },
// });

// // @ts-ignore
// window._store = store;
// // @ts-ignore
// window._m1 = m1;
// // @ts-ignore
// window._m2 = m2;

// store.subscribe(() => {
//   const state1 = store.getState();
//   // store.dispatch(m2.effects.getUserInfo);
//   // store.dispatch(m1.reducers.put);
//   console.log('state', state1);
// });

// export * from './reduxExt';
export * from './types';
export {
  reduxCacheFactory,
};
export default createStoreEnhance;
