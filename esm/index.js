import { createGet, createListener, createSet, createSubscribe, createUseModel } from './api';
import { store } from './store';
import shareData from './shareData';
import { modelInitAction } from './actions';
import actionsHandle from './actionsHandle';
function create(model) {
    var _a = model.state, state = _a === void 0 ? {} : _a, actions = model.actions, namespace = model.namespace;
    if (!namespace) {
        throw Error('r2: model.namespace is required!');
    }
    var get = createGet(namespace);
    var set = createSet(namespace, get);
    var subscribe = createSubscribe();
    var useModel = createUseModel(namespace);
    actionsHandle(namespace, actions);
    createListener(namespace);
    store.dispatch(modelInitAction(namespace, state));
    var modelApis = {
        get: get,
        set: set,
        actions: (actions || {}),
        subscribe: subscribe,
        useModel: useModel,
    };
    shareData.models[namespace] = modelApis;
    return modelApis;
}
export { create };
export { shallowEqual } from 'react-redux';
export { coreStore } from './codeStore';
export * from './Provider';
