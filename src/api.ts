import { AnyFunction, AnyObject, isFunction } from '@lxjx/utils';
import { useSelector } from 'react-redux';
import { store } from './store';
import { setStateAction } from './actions';
import { IGet, IListener } from './types';
import shareData from './shareData';

export function createGet(namespace?: string) {
  return function get() {
    const state = store.getState();
    return namespace ? store.getState()[namespace] : state;
  };
}

export function createSet<S>(namespace: string, get: IGet<S>) {
  return function set(patch: ((prevState: S) => Partial<S>) | Partial<S>) {
    const nextState = isFunction(patch) ? patch(get()) : patch;
    store.dispatch(setStateAction(namespace, nextState));
  };
}

export function createSubscribe<S = any>() {
  const { listeners } = shareData;

  return function subscribe(listener: IListener<S>) {
    listeners.push(listener);

    return () => {
      const ind = listeners.indexOf(listener);
      if (ind !== -1) {
        listeners.splice(ind, 1);
      }
    };
  };
}

export function createUseModel(namespace: string) {
  const defaultSelector = (s: any) => s;

  return function useModel(selector?: AnyFunction, equalityFn?: AnyFunction) {
    const cSelector = selector || defaultSelector;

    return useSelector((_state: AnyObject) => cSelector(_state[namespace]), equalityFn);
  };
}

export function createListener(namespace: string) {
  store.subscribe(() => {
    const nState = store.getState();
    const { lastState } = shareData;

    if (!lastState) return;

    const _state = nState[namespace];
    const _lastState = lastState[namespace];

    if (
      // 跳过注册store时
      namespace in lastState &&
      // 通过内存地址是否变更判断
      _state !== _lastState
    ) {
      shareData.listeners.forEach(listener => {
        listener(_state);
      });
    }
  });
}
