import { StoreEnhancer } from 'redux';

interface ReduxCacheFactory {
  (options?: {
    /** 用于存储到sessionStorage的key */
    cacheKey?: string;
    /** 当此项长度大于0时，只会缓存该数组内指定的key */
    includes?: any[];
  }): StoreEnhancer;
}


const reduxCacheFactory: ReduxCacheFactory = (options = {}) => {
  const { cacheKey = 'REDUX_CACHE', includes = [] } = options;

  return (createStore) => (reducer, preloadedState) => {
    function cache(state: any, action: any) {
      if (action.type === 'R2_CACHE_ROLLBACK') {
        return { ...state, ...action.cacheData };
      }

      return reducer(state, action);
    }

    const store = createStore(cache, preloadedState);

    const hasWindow = !!window;
    const sStorage = sessionStorage;

    if (sStorage && hasWindow) {
      /* 还原 */
      let cacheData = sStorage.getItem(cacheKey);
      if (cacheData) {
        cacheData = JSON.parse(cacheData);
        if (Object.prototype.toString.call(cacheData) === '[object Object]') {
          store.dispatch({
            type: 'R2_CACHE_ROLLBACK',
            cacheData,
          });
        }
      }

      /* 缓存 */
      window.addEventListener('beforeunload', () => {
        const state = store.getState();
        if (includes.length > 0) {
          Object.entries(state).forEach(([key]) => {
            if (!includes.includes(key)) {
              delete state[key];
            }
          });
        }
        sStorage.setItem(cacheKey, JSON.stringify(state));
      });
    }

    return store;
  };
};

export default reduxCacheFactory;
