import { isObject, isFunction } from '@lxjx/utils';

import { IModel } from '@/types';

/**
 * 为指定Model内的reducer和effect添加type，帮助dispatch时进行识别
 * */
export default (model: IModel<any>, namespace: string) => {
  const { state, reducers, effects } = model;

  if (reducers) {
    if (!isObject(reducers)) {
      throw Error(`${namespace}.reducers must be object`);
    }

    /* 默认注入setState */
    for (let [reducerKey, reducer] of Object.entries(reducers)) {
      if(!isFunction(reducer)) throw Error(`${namespace}.reducers.${reducerKey} must be function`);
      reducer.type = `${namespace}.reducer.${reducerKey}`;
    }
  }

  if (effects) {
    if (!isObject(effects)) {
      throw Error(`${namespace}.effects must be object`);
    }

    for (let [reducerKey, reducer] of Object.entries(effects)) {
      if(!isFunction(reducer)) throw Error(`${effects}.reducers.${reducerKey} must be function`);
      reducer.type = `${namespace}.effects.${reducerKey}`;
    }
  }

  return state;
}
