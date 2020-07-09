import { isFunction } from '@lxjx/utils';
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

/**
 * 合并全局和model级中间件，并将各类型的中间件处理器分组返回
 * */
export function middlewareHelper(scopeMiddleware = [] as IMiddleware[]) {
  const allM = [...shareData.middleware, ...scopeMiddleware];

  const uniqAllM: IMiddleware[] = [];

  const initHandles: NonNullable<IMiddleware['init']>[] = [];
  const transformHandles: NonNullable<IMiddleware['transform']>[] = [];

  allM.forEach(item => {
    if (!uniqAllM.includes(item)) {
      uniqAllM.push(item);
      if (isFunction(item.init)) {
        initHandles.push(item.init);
      }

      if (isFunction(item.transform)) {
        transformHandles.push(item.transform);
      }
    }
  });

  // 使中间件执行顺序更符合直觉
  transformHandles.reverse();

  return {
    initHandles,
    transformHandles,
  };
}

export function logText(text: string, namespace = '') {
  return `R2 > ${namespace ? `${namespace} ` : ''}${text} |`;
}

export function prefix(text: string) {
  return `R2: ${text}`;
}
