import { IMiddleware } from './types';

function getCache(key: string) {
  const sCache = sessionStorage.getItem(key);
  if (sCache) {
    return JSON.parse(sCache);
  }
}

function setCache(key: string, state: any) {
  if (state) {
    sessionStorage.setItem(key, JSON.stringify(state));
  }
}

const cache: IMiddleware = ({ isInit, namespace, apis }) => {
  const hasWindow = typeof window !== 'undefined';

  if (!hasWindow) {
    return;
  }

  if (isInit) {
    const cacheKey = `R2_CACHE_${namespace}`.toUpperCase();

    window.addEventListener('beforeunload', () => {
      setCache(cacheKey, apis.get());
    });

    const sCache = getCache(cacheKey);

    if (sCache) {
      return sCache;
    }
  }
};

export default cache;
