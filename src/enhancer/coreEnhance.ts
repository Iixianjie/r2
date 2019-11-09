import { StoreEnhancer } from 'redux';

const setStateMatch = /setState\/[\w]+$/;

const coreEnhance: StoreEnhancer = (createStore) => (reducer, preloadedState) => {
  function coreReducer(rootState: any, action: any) {
    const state = reducer(rootState, action);
    const { type, ...payload } = action;
    /* 为dispatch(reducerFn, action)发起的特有action合并值 */
    if (payload.__fnReducer) {
      return { ...rootState, ...payload.__localState };
    }

    /* action { type: 'replaceRootState' } */
    if (type === 'replaceRootState') {
      return { ...rootState, ...payload };
    }

    /* action { type: 'setState/[namespace]' } */
    if (setStateMatch.test(type)) {
      const [actionType, namespace] = type.split('/');
      return { ...rootState, [namespace]: { ...payload } };
    }

    return state;
  }

  return createStore(coreReducer, preloadedState);
};

export default coreEnhance;
