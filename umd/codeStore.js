(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "@lxjx/utils", "./store", "./actions", "./shareData"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.coreStore = void 0;
    var tslib_1 = require("tslib");
    var utils_1 = require("@lxjx/utils");
    var store_1 = require("./store");
    var actions_1 = require("./actions");
    var shareData_1 = tslib_1.__importDefault(require("./shareData"));
    function get() {
        return store_1.store.getState();
    }
    /**
     * 直接设置根状态
     * @param patch - 带设置的状态
     * @param replace - 为true时，使用传入状态替换整个状态树
     * */
    function set(patch, replace) {
        var nextState = utils_1.isFunction(patch) ? patch(get()) : patch;
        store_1.store.dispatch(actions_1.setRootState(nextState, replace));
    }
    function subscribe(listener) {
        return store_1.store.subscribe(function () {
            listener(get());
        });
    }
    var coreStore = {
        get: get,
        set: set,
        subscribe: subscribe,
        models: shareData_1.default.models,
    };
    exports.coreStore = coreStore;
});
