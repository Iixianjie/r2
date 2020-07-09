import { isFunction } from '@lxjx/utils';
import { IMiddleware } from './types';
import { logText } from './utils';

function getCache(key: string) {
  const sCache = sessionStorage.getItem(key);
  if (sCache) {
    return JSON.stringify(sCache);
  }
  return undefined;
}

function setCache(key: string, state: any) {
  if (state) {
    sessionStorage.setItem(key, JSON.stringify(state));
  }
}

const cache: IMiddleware = {
  init(initState, { namespace, ctx }) {
    const hasWindow = typeof window !== 'undefined';
    const cacheKey = `R2_CACHE_${namespace}`;

    ctx.__CACHE__ = {
      hasWindow,
      cacheKey,
    };

    if (!hasWindow) {
      return initState;
    }

    const sCache = getCache(cacheKey);

    if (sCache) {
      return sCache;
    }

    return initState;
  },

  transform(modelApi, { ctx }): any {
    return modelApi;
  },
};

export default cache;
