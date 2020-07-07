(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "redux", "./actions", "./shareData"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.store = void 0;
    var tslib_1 = require("tslib");
    var redux_1 = require("redux");
    var actions_1 = require("./actions");
    var shareData_1 = tslib_1.__importDefault(require("./shareData"));
    function getDevToolCompose() {
        if (typeof window === 'undefined' || typeof process === 'undefined') {
            return;
        }
        // @ts-ignore
        if (process.env.NODE_ENV !== 'development' || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
            return;
        }
        // @ts-ignore
        return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__();
    }
    getDevToolCompose();
    var store = redux_1.createStore(function (state, _a) {
        var _b, _c;
        if (state === void 0) { state = {}; }
        var type = _a.type, action = tslib_1.__rest(_a, ["type"]);
        shareData_1.default.lastState = state;
        if (actions_1.modelInitMatch.test(type)) {
            var _d = action, initState = _d.state, namespace = _d.namespace;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_b = {}, _b[namespace] = initState, _b));
        }
        if (actions_1.setStateMatch.test(type)) {
            var _e = action, patchState = _e.state, namespace = _e.namespace;
            return tslib_1.__assign(tslib_1.__assign({}, state), (_c = {}, _c[namespace] = tslib_1.__assign(tslib_1.__assign({}, state[namespace]), patchState), _c));
        }
        if (type === actions_1.setRootStateMatch) {
            var _f = action, rootState = _f.state, replace = _f.replace;
            if (replace) {
                return rootState;
            }
            return tslib_1.__assign(tslib_1.__assign({}, state), rootState);
        }
        return state;
    }, {}, getDevToolCompose());
    exports.store = store;
});
