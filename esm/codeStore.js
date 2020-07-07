import { isFunction } from '@lxjx/utils';
import { store } from './store';
import { setRootState } from './actions';
import shareData from './shareData';
function get() {
    return store.getState();
}
/**
 * 直接设置根状态
 * @param patch - 带设置的状态
 * @param replace - 为true时，使用传入状态替换整个状态树
 * */
function set(patch, replace) {
    var nextState = isFunction(patch) ? patch(get()) : patch;
    store.dispatch(setRootState(nextState, replace));
}
function subscribe(listener) {
    return store.subscribe(function () {
        listener(get());
    });
}
var coreStore = {
    get: get,
    set: set,
    subscribe: subscribe,
    models: shareData.models,
};
export { coreStore };
