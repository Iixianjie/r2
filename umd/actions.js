(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setRootState = exports.setRootStateMatch = exports.setStateAction = exports.setStateMatch = exports.modelInitAction = exports.modelInitMatch = void 0;
    exports.modelInitMatch = /^@@MODEL_INIT_.+$/;
    exports.modelInitAction = function (namespace, state) { return ({
        type: "@@MODEL_INIT_" + namespace.toUpperCase(),
        state: state,
        namespace: namespace,
    }); };
    exports.setStateMatch = /^.+\.setState$/;
    exports.setStateAction = function (namespace, state) { return ({
        type: namespace + ".setState",
        state: state,
        namespace: namespace,
    }); };
    exports.setRootStateMatch = 'setState';
    /**
     * 直接设置根状态
     * @param state - 带设置的状态
     * @param replace - 为true时，使用传入状态替换整个状态树
     * */
    exports.setRootState = function (state, replace) { return ({
        type: exports.setRootStateMatch,
        state: state,
        replace: replace,
    }); };
});
