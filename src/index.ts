import { IActions, IModelApis, IModelSchema } from './types';
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

  const { initHandles, transformHandles } = middlewareHelper(middleware);

  const middlewareBonus = {
    ctx: {},
    namespace,
    store,
  };

  const finalState = initHandles.reduce(
    (prev, handler) => {
      return handler(prev, middlewareBonus);
    },
    { ...state },
  );

  if (!namespace) {
    throw Error(prefix('`model.namespace` is required!'));
  }

  const get = createGet(namespace);

  const set = createSet(namespace, get);

  const subscribe = createSubscribe();

  const useModel = createUseModel(namespace);

  actionsHandle(namespace, actions);

  createListener(namespace);

  store.dispatch(modelInitAction(namespace, finalState));

  const modelApis = {
    get,
    set,
    actions: (actions || {}) as Actions,
    subscribe,
    useModel,
  };

  const converted = transformHandles.reduce((prev, handler) => {
    return handler(prev, middlewareBonus);
  }, modelApis);

  shareData.models[namespace as any] = modelApis;

  return converted;
}

export { create };
export { coreStore } from './codeStore';
export * from './Provider';
