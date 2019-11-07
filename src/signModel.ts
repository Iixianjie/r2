import { isObject, isFunction } from '@lxjx/utils';

import { Model } from '@/types';

export default <T>(model: Model<T>) => {
  const { namespace, state, reducers, effects } = model;

  if (!namespace) {
    throw Error(`model.${namespace}: the namespace property is required`);
  }

  if (reducers) {
    if (!isObject(reducers)) {
      throw Error(`${namespace}.reducers must be object`);
    }

    /* 默认注入setState */
    for (let [reducerKey, reducer] of Object.entries(reducers)) {
      if(!isFunction(reducer)) throw Error(`${namespace}.reducers.${reducerKey} must be function`);
      reducer.signKey = `${namespace}.${reducerKey}`;
    }
  }

  if (effects) {

  }
}
