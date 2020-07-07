(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@lxjx/utils", "react-redux", "./store", "./actions", "./shareData"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createListener = exports.createUseModel = exports.createSubscribe = exports.createSet = exports.createGet = void 0;
    var tslib_1 = require("tslib");
    var utils_1 = require("@lxjx/utils");
    var react_redux_1 = require("react-redux");
    var store_1 = require("./store");
    var actions_1 = require("./actions");
    var shareData_1 = tslib_1.__importDefault(require("./shareData"));
    function createGet(namespace) {
        return function get() {
            var state = store_1.store.getState();
            return namespace ? store_1.store.getState()[namespace] : state;
        };
    }
    exports.createGet = createGet;
    function createSet(namespace, get) {
        return function set(patch) {
            var nextState = utils_1.isFunction(patch) ? patch(get()) : patch;
            store_1.store.dispatch(actions_1.setStateAction(namespace, nextState));
        };
    }
    exports.createSet = createSet;
    function createSubscribe() {
        var listeners = shareData_1.default.listeners;
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
    exports.createSubscribe = createSubscribe;
    function createUseModel(namespace) {
        var defaultSelector = function (s) { return s; };
        return function useModel(selector, equalityFn) {
            var cSelector = selector || defaultSelector;
            return react_redux_1.useSelector(function (_state) { return cSelector(_state[namespace]); }, equalityFn);
        };
    }
    exports.createUseModel = createUseModel;
    function createListener(namespace) {
        store_1.store.subscribe(function () {
            var nState = store_1.store.getState();
            var lastState = shareData_1.default.lastState;
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
                shareData_1.default.listeners.forEach(function (listener) {
                    listener(_state);
                });
            }
        });
    }
    exports.createListener = createListener;
});
