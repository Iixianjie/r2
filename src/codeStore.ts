import { AnyObject, isFunction } from '@lxjx/utils';
import { store } from './store';
import { setRootState } from './actions';
import shareData from './shareData';
import { IListener } from './types';

function get<S extends AnyObject = any>(): S {
  return store.getState();
}

/**
 * 直接设置根状态
 * @param patch - 带设置的状态
 * @param replace - 为true时，使用传入状态替换整个状态树
 * */
function set<S extends AnyObject = any>(
  patch: ((prevState: S) => Partial<S>) | Partial<S>,
  replace?: boolean,
): void {
  const nextState = isFunction(patch) ? patch(get()) : patch;
  store.dispatch(setRootState(nextState, replace));
}

function subscribe<S = any>(listener: IListener<S>) {
  return store.subscribe(() => {
    listener(get());
  });
}

const coreStore = {
  get,
  set,
  subscribe,
  models: shareData.models,
};

export { coreStore };
