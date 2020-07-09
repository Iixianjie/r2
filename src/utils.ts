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

  // 中间件取值顺序取反, 存在重复时优先取后声明的
  allM.reverse();

  const uniqAllM: IMiddleware[] = [];

  allM.forEach(item => {
    if (!uniqAllM.includes(item)) {
      uniqAllM.push(item);
    }
  });

  // 恢复正常顺序
  uniqAllM.reverse();

  return uniqAllM;
}

export function logText(text: string, namespace = '') {
  return `R2 > ${namespace ? `${namespace} ` : ''}${text} |`;
}

export function prefix(text: string) {
  return `R2: ${text}`;
}
