import { isFunction } from '@lxjx/utils';
import { IActions, IMiddlewareBonus, IModelApis, IModelSchema } from './types';
import { createGet, createListener, createSet, createSubscribe, createUseModel } from './api';

import { store } from './store';
import shareData from './shareData';

import { modelInitAction } from './actions';
import actionsHandle from './actionsHandle';
import { middlewareHelper, prefix } from './utils';

function create<S extends object = any, Actions extends IActions = any>(
  model: IModelSchema<S, Actions> | ((apis: IModelApis<S, Actions>) => IModelSchema<S, Actions>),
): IModelApis<S, Actions> {
  shareData.modelCreated = true;

  const modelApis: any = {};

  const { state = {}, actions, namespace, middleware } = isFunction(model)
    ? model(modelApis)
    : model;

  const middlewares = middlewareHelper(middleware);

  if (!namespace) {
    throw Error(prefix('`model.namespace` is required!'));
  }

  modelApis.get = createGet(namespace);

  modelApis.set = createSet(namespace, modelApis.get);

  modelApis.subscribe = createSubscribe(namespace);

  modelApis.useModel = createUseModel(namespace);

  modelApis.actions = actions;

  actionsHandle(namespace, actions);

  createListener(namespace);

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

  middlewares.forEach(handler => {
    const r = handler(middlewareBonus);
    if (r !== undefined) {
      middlewareBonus.initState = r;
    }
  });

  middlewareBonus.isInit = false;

  // 非初始化中间件反转顺序
  middlewares.reverse();

  middlewares.forEach(handler => {
    handler(middlewareBonus);
  });

  store.dispatch(modelInitAction(namespace, middlewareBonus.initState));

  shareData.models[namespace as any] = middlewareBonus.apis;

  return middlewareBonus.apis;
}

export { create };
export { coreStore } from './codeStore';
export * from './Provider';
