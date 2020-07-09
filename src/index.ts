import { IActions, IMiddlewareBonus, IModelApis, IModelSchema } from './types';
import { createGet, createListener, createSet, createSubscribe, createUseModel } from './api';

import { store } from './store';
import shareData from './shareData';

import { modelInitAction } from './actions';
import actionsHandle from './actionsHandle';
import { middlewareHelper, prefix } from './utils';

function create<S extends object = any, Actions extends IActions = any>(
  model: IModelSchema<S, Actions>,
): IModelApis<S, Actions> {
  shareData.modelCreated = true;

  const { state = {}, actions, namespace, middleware } = model;

  const middlewares = middlewareHelper(middleware);

  if (!namespace) {
    throw Error(prefix('`model.namespace` is required!'));
  }

  const get = createGet(namespace);

  const set = createSet(namespace, get);

  const subscribe = createSubscribe();

  const useModel = createUseModel(namespace);

  actionsHandle(namespace, actions);

  createListener(namespace);

  const modelApis = {
    get,
    set,
    actions: (actions || {}) as Actions,
    subscribe,
    useModel,
  };

  const middlewareBonus: IMiddlewareBonus = {
    initState: { ...state },
    isInit: true,
    apis: modelApis,
    ctx: {},
    namespace,
    store,
    monkeyHelper: (name, cb) => {
      const next = middlewareBonus.apis[name];
      if (!next) return;
      middlewareBonus.apis[name] = cb(next);
    },
  };

  middlewareBonus.initState = middlewares.reduce((prev, handler) => {
    return handler(prev);
  }, middlewareBonus.initState);

  middlewareBonus.isInit = false;
  // 非初始化中间件需要反转顺序
  middlewares.reverse();

  middlewares.forEach(handler => handler(middlewareBonus));

  store.dispatch(modelInitAction(namespace, middlewareBonus.initState));

  shareData.models[namespace as any] = middlewareBonus.apis;

  return middlewareBonus.apis;
}

export { create };
export { coreStore } from './codeStore';
export * from './Provider';
