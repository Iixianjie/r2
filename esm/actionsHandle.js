import { isArray, isFunction } from '@lxjx/utils';
import { store } from './store';
export default function actionsHandle(namespace, actions) {
    if (actions) {
        var keys = Object.keys(actions);
        if (isArray(keys) && keys.length) {
            keys.forEach(function (key) {
                var monkey = actions[key];
                if (!isFunction(monkey))
                    return;
                actions[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var pending = monkey.apply(void 0, args);
                    var actionName = namespace + "." + key;
                    // 通过所有Promise Like
                    if (pending &&
                        isFunction(pending.finally) &&
                        isFunction(pending.then) &&
                        isFunction(pending.catch)) {
                        store.dispatch({ type: actionName + " - Async Start" });
                        pending.finally(function () {
                            store.dispatch({ type: actionName + " - Async End" });
                        });
                        return pending;
                    }
                    store.dispatch({ type: actionName });
                };
            });
        }
    }
}
