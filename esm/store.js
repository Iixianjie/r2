import { __assign, __rest } from "tslib";
import { createStore } from 'redux';
import { modelInitMatch, setStateMatch, setRootStateMatch, } from './actions';
import shareData from './shareData';
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
var store = createStore(function (state, _a) {
    var _b, _c;
    if (state === void 0) { state = {}; }
    var type = _a.type, action = __rest(_a, ["type"]);
    shareData.lastState = state;
    if (modelInitMatch.test(type)) {
        var _d = action, initState = _d.state, namespace = _d.namespace;
        return __assign(__assign({}, state), (_b = {}, _b[namespace] = initState, _b));
    }
    if (setStateMatch.test(type)) {
        var _e = action, patchState = _e.state, namespace = _e.namespace;
        return __assign(__assign({}, state), (_c = {}, _c[namespace] = __assign(__assign({}, state[namespace]), patchState), _c));
    }
    if (type === setRootStateMatch) {
        var _f = action, rootState = _f.state, replace = _f.replace;
        if (replace) {
            return rootState;
        }
        return __assign(__assign({}, state), rootState);
    }
    return state;
}, {}, getDevToolCompose());
export { store };
