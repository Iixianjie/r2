(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "react-redux", "react", "./store"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Provider = void 0;
    var tslib_1 = require("tslib");
    var react_redux_1 = require("react-redux");
    var react_1 = tslib_1.__importDefault(require("react"));
    var store_1 = require("./store");
    var Provider = function (_a) {
        var children = _a.children;
        return react_1.default.createElement(react_redux_1.Provider, { store: store_1.store }, children);
    };
    exports.Provider = Provider;
    Provider.displayName = 'R2Provider';
});
