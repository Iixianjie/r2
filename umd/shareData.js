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
    exports.default = {
        /** 保存更新前的state */
        lastState: null,
        /** 所有subscribe监听器 */
        listeners: [],
        /** 所有已注册的model */
        models: [],
    };
});
