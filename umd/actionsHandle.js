(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@lxjx/utils", "./store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require("@lxjx/utils");
    var store_1 = require("./store");
    function actionsHandle(namespace, actions) {
        if (actions) {
            var keys = Object.keys(actions);
            if (utils_1.isArray(keys) && keys.length) {
                keys.forEach(function (key) {
                    var monkey = actions[key];
                    if (!utils_1.isFunction(monkey))
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
                            utils_1.isFunction(pending.finally) &&
                            utils_1.isFunction(pending.then) &&
                            utils_1.isFunction(pending.catch)) {
                            store_1.store.dispatch({ type: actionName + " - Async Start" });
                            pending.finally(function () {
                                store_1.store.dispatch({ type: actionName + " - Async End" });
                            });
                            return pending;
                        }
                        store_1.store.dispatch({ type: actionName });
                    };
                });
            }
        }
    }
    exports.default = actionsHandle;
});
