import modelsFormat from './modelsFormat';
import {
  createStore, compose, applyMiddleware,
  Store, Dispatch, Middleware, AnyAction, StoreEnhancer // 类型
} from 'redux';
import coreMiddleware from './coreMiddleware';

import { m1, m2, rootState } from './demo/test';

import { CreateStoreEnhanceOptions, DispatchExt } from './types';

const setStateMatch = /setState\/[A-Za-z]+$/;
/**
 * <S>: 整个state树的类型
 * */
const createStoreEnhance = <S>({ models, initState, enhancer }: CreateStoreEnhanceOptions<S>) => {

  const state: S = modelsFormat<S>(models);

  function AppReducer(AppState: S = state, { type, ...payload }: AnyAction): S {
    /* 为dispatch(reducerFn, action)发起的特有action合并值 */
    if (payload.__fnReducer) {
      return { ...AppState, ...payload.__localState };
    }

    /* TODO: ReplaceRootState 支持 */
    if (type === 'replaceRootState') {
      return { ...AppState, ...payload };
    }

    /* TODO: setState 支持 */
    if (setStateMatch.test(type)) {
      const [actionType, namespace] = type.split('/');
      return { ...AppState, [namespace]: { ...payload } };
    }

    return AppState;
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
  const enhanceSpread = [applyMiddleware<DispatchExt, S>(coreMiddleware)];

  if (enhancer) {
    enhanceSpread.push(enhancer);
  }

  enhances = composeEnhancers(...enhanceSpread);

  return createStore(AppReducer, initState, enhances as StoreEnhancer);
};

const store = createStoreEnhance<rootState>({
  models: {
    m1,
    m2,
  },
  initState: {
    m1: { name: '213' },
    m2: [{ name: '123213', id: 123213 }]
  },
});

// @ts-ignore
window._store = store;window._m1 = m1;window._m2 = m2;

store.subscribe(() => {
  const state1 = store.getState();
  // store.dispatch(m2.effects.getUserInfo);
  store.dispatch(m1.reducers.put);
  console.log('state', state1);
});

export default createStoreEnhance;
