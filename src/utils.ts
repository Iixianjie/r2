import { IMiddleware } from './types';
import shareData from './shareData';

export function getDevToolCompose() {
  if (typeof window === 'undefined' || typeof process === 'undefined') {
    return;
  }
  // @ts-ignore
  if (process.env.NODE_ENV !== 'development' || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    return;
  }
  // @ts-ignore
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__();
}

/** 根据命名空间获取该对应model所有可用中间件, 没有时返回 `[]` */
export function middlewareHelper(namespace: string) {
  const scopeM = shareData.scopeMiddleware[namespace] || [];
  const allM = [...shareData.middleware, ...scopeM];
  const uniqAllM: IMiddleware[] = [];

  allM.forEach(item => {
    if (!uniqAllM.includes(item)) {
      uniqAllM.push(item);
    }
  });

  uniqAllM.forEach(item => {});
}
