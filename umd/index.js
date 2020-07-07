(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./api", "./store", "./shareData", "./actions", "./actionsHandle", "react-redux", "./codeStore", "./Provider"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.create = void 0;
    var tslib_1 = require("tslib");
    var api_1 = require("./api");
    var store_1 = require("./store");
    var shareData_1 = tslib_1.__importDefault(require("./shareData"));
    var actions_1 = require("./actions");
    var actionsHandle_1 = tslib_1.__importDefault(require("./actionsHandle"));
    function create(model) {
        var _a = model.state, state = _a === void 0 ? {} : _a, actions = model.actions, namespace = model.namespace;
        if (!namespace) {
            throw Error('r2: model.namespace is required!');
        }
        var get = api_1.createGet(namespace);
        var set = api_1.createSet(namespace, get);
        var subscribe = api_1.createSubscribe();
        var useModel = api_1.createUseModel(namespace);
        actionsHandle_1.default(namespace, actions);
        api_1.createListener(namespace);
        store_1.store.dispatch(actions_1.modelInitAction(namespace, state));
        var modelApis = {
            get: get,
            set: set,
            actions: (actions || {}),
            subscribe: subscribe,
            useModel: useModel,
        };
        shareData_1.default.models[namespace] = modelApis;
        return modelApis;
    }
    exports.create = create;
    var react_redux_1 = require("react-redux");
    Object.defineProperty(exports, "shallowEqual", { enumerable: true, get: function () { return react_redux_1.shallowEqual; } });
    var codeStore_1 = require("./codeStore");
    Object.defineProperty(exports, "coreStore", { enumerable: true, get: function () { return codeStore_1.coreStore; } });
    tslib_1.__exportStar(require("./Provider"), exports);
});
