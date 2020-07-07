export var modelInitMatch = /^@@MODEL_INIT_.+$/;
export var modelInitAction = function (namespace, state) { return ({
    type: "@@MODEL_INIT_" + namespace.toUpperCase(),
    state: state,
    namespace: namespace,
}); };
export var setStateMatch = /^.+\.setState$/;
export var setStateAction = function (namespace, state) { return ({
    type: namespace + ".setState",
    state: state,
    namespace: namespace,
}); };
export var setRootStateMatch = 'setState';
/**
 * 直接设置根状态
 * @param state - 带设置的状态
 * @param replace - 为true时，使用传入状态替换整个状态树
 * */
export var setRootState = function (state, replace) { return ({
    type: setRootStateMatch,
    state: state,
    replace: replace,
}); };
