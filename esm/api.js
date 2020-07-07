import { isFunction } from '@lxjx/utils';
import { useSelector } from 'react-redux';
import { store } from './store';
import { setStateAction } from './actions';
import shareData from './shareData';
export function createGet(namespace) {
    return function get() {
        var state = store.getState();
        return namespace ? store.getState()[namespace] : state;
    };
}
export function createSet(namespace, get) {
    return function set(patch) {
        var nextState = isFunction(patch) ? patch(get()) : patch;
        store.dispatch(setStateAction(namespace, nextState));
    };
}
export function createSubscribe() {
    var listeners = shareData.listeners;
    return function subscribe(listener) {
        listeners.push(listener);
        return function () {
            var ind = listeners.indexOf(listener);
            if (ind !== -1) {
                listeners.splice(ind, 1);
            }
        };
    };
}
export function createUseModel(namespace) {
    var defaultSelector = function (s) { return s; };
    return function useModel(selector, equalityFn) {
        var cSelector = selector || defaultSelector;
        return useSelector(function (_state) { return cSelector(_state[namespace]); }, equalityFn);
    };
}
export function createListener(namespace) {
    store.subscribe(function () {
        var nState = store.getState();
        var lastState = shareData.lastState;
        if (!lastState)
            return;
        var _state = nState[namespace];
        var _lastState = lastState[namespace];
        if (
        // 跳过注册store时
        namespace in lastState &&
            // 通过内存地址是否变更判断
            _state !== _lastState) {
            // console.log(namespace, 'change', _state);
            shareData.listeners.forEach(function (listener) {
                listener(_state);
            });
        }
    });
}
