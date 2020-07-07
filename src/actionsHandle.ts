import { isArray, isFunction } from '@lxjx/utils';
import { IActions } from './types';
import { store } from './store';

export default function actionsHandle(namespace: string, actions?: IActions) {
  if (actions) {
    const keys = Object.keys(actions);
    if (isArray(keys) && keys.length) {
      keys.forEach(key => {
        const monkey = (actions as any)[key];

        if (!isFunction(monkey)) return;

        (actions as any)[key] = (...args: any) => {
          const pending = monkey(...args);
          const actionName = `${namespace}.${key}`;

          // 通过所有Promise Like
          if (
            pending &&
            isFunction(pending.finally) &&
            isFunction(pending.then) &&
            isFunction(pending.catch)
          ) {
            store.dispatch({ type: `${actionName} - Async Start` });

            pending.finally(() => {
              store.dispatch({ type: `${actionName} - Async End` });
            });

            return pending;
          }
          store.dispatch({ type: actionName });
        };
      });
    }
  }
}
