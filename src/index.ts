import { IActions, IModelApis, IModelSchema } from './types';
import { createGet, createListener, createSet, createSubscribe, createUseModel } from './api';

import { store } from './store';
import shareData from './shareData';

import { modelInitAction } from './actions';
import actionsHandle from './actionsHandle';

function create<S extends object = any, Actions extends IActions = any>(
  model: IModelSchema<S, Actions>,
): IModelApis<S, Actions> {
  const { state = {}, actions, namespace } = model;

  if (!namespace) {
    throw Error('r2: model.namespace is required!');
  }

  const get = createGet(namespace);

  const set = createSet(namespace, get);

  const subscribe = createSubscribe();

  const useModel = createUseModel(namespace);

  actionsHandle(namespace, actions);

  createListener(namespace);

  store.dispatch(modelInitAction(namespace, state));

  const modelApis = {
    get,
    set,
    actions: (actions || {}) as Actions,
    subscribe,
    useModel,
  };

  shareData.models[namespace as any] = modelApis;

  return modelApis;
}

export { create };
export { shallowEqual } from 'react-redux';
export { coreStore } from './codeStore';
export * from './Provider';
