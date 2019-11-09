'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var redux = require('redux');
var utils = require('@lxjx/utils');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/**
 * 为指定Model内的reducer和effect添加type，帮助dispatch时进行识别
 * */

var signModel = (function (model, namespace) {
  var state = model.state,
      reducers = model.reducers,
      effects = model.effects;

  if (reducers) {
    if (!utils.isObject(reducers)) {
      throw Error("".concat(namespace, ".reducers must be object"));
    }
    /* 默认注入setState */


    for (var _i = 0, _Object$entries = Object.entries(reducers); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          reducerKey = _Object$entries$_i[0],
          reducer = _Object$entries$_i[1];

      if (!utils.isFunction(reducer)) throw Error("".concat(namespace, ".reducers.").concat(reducerKey, " must be function"));
      reducer.type = "".concat(namespace, ".reducer.").concat(reducerKey);
    }
  }

  if (effects) {
    if (!utils.isObject(effects)) {
      throw Error("".concat(namespace, ".effects must be object"));
    }

    for (var _i2 = 0, _Object$entries2 = Object.entries(effects); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          _reducerKey = _Object$entries2$_i[0],
          _reducer = _Object$entries2$_i[1];

      if (!utils.isFunction(_reducer)) throw Error("".concat(effects, ".reducers.").concat(_reducerKey, " must be function"));
      _reducer.type = "".concat(namespace, ".effects.").concat(_reducerKey);
    }
  }

  return state;
});

/* 为对象内的所有model函数打上sing并将它们的state组合后进行返回 */

var modelsFormat = (function (models) {
  var mixState = {};

  for (var _i = 0, _Object$entries = Object.entries(models); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        namespace = _Object$entries$_i[0],
        model = _Object$entries$_i[1];

    mixState[namespace] = signModel(model, namespace);
  }

  return mixState;
});

/**
 * 此中间件帮助store.dispatch识别dispatch(reducerFn, action)以及dispatch(async effectFn, action)
 * 作为参数的函数应包含属性type(<namespace>.<reducer|effects>.<handleKey>), 如: user.effect.getUserInfo、user.reducer.setUserInfo
 * 需要确保一个能监听action.__fnReducer的reducer存在，当__fnReducer为true时，用action.__localState合并当前state
 * */
var coreMiddleware = function coreMiddleware(store) {
  return function (next) {
    return function (action, payload) {
      var type = action.type;
      /* 普通action */

      if (!type) {
        next(action);
        return;
      }

      var _type$split = type.split('.'),
          _type$split2 = _slicedToArray(_type$split, 2),
          namespace = _type$split2[0],
          patchType = _type$split2[1];

      var state = store.getState();
      var modelState = state[namespace];
      /* 函数reducer */

      if (patchType === 'reducer') {
        next({
          type: type,
          __localState: _defineProperty({}, namespace, action(modelState, payload)),
          __fnReducer: true
        });
        return;
      }
      /* 异步action */


      if (patchType === 'effects') {
        // 为action的开始和结束派发一个空的action，便于回滚和调试
        next({
          type: "@@START: ".concat(type)
        });
        var pending = action(payload, {
          dispatch: store.dispatch,
          getState: store.getState
        });

        if (pending && pending.finally) {
          pending.finally(function () {
            next({
              type: "@@END: ".concat(type)
            });
          });
        } else {
          next({
            type: "@@END: ".concat(type)
          });
          console.warn('effect "@@END event" require Promise.prototype.finally');
        }

        return pending;
      }

      next(action);
    };
  };
};

var setStateMatch = /setState\/[\w]+$/;

var coreEnhance = function coreEnhance(createStore) {
  return function (reducer, preloadedState) {
    function coreReducer(rootState, action) {
      var state = reducer(rootState, action);

      var type = action.type,
          payload = _objectWithoutProperties(action, ["type"]);
      /* 为dispatch(reducerFn, action)发起的特有action合并值 */


      if (payload.__fnReducer) {
        return _objectSpread2({}, rootState, {}, payload.__localState);
      }
      /* action { type: 'replaceRootState' } */


      if (type === 'replaceRootState') {
        return _objectSpread2({}, rootState, {}, payload);
      }
      /* action { type: 'setState/[namespace]' } */


      if (setStateMatch.test(type)) {
        var _type$split = type.split('/'),
            _type$split2 = _slicedToArray(_type$split, 2),
            actionType = _type$split2[0],
            namespace = _type$split2[1];

        return _objectSpread2({}, rootState, _defineProperty({}, namespace, _objectSpread2({}, payload)));
      }

      return state;
    }

    return createStore(coreReducer, preloadedState);
  };
};

var reduxCacheFactory = function reduxCacheFactory() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$cacheKey = options.cacheKey,
      cacheKey = _options$cacheKey === void 0 ? 'REDUX_CACHE' : _options$cacheKey,
      _options$includes = options.includes,
      includes = _options$includes === void 0 ? [] : _options$includes;
  return function (createStore) {
    return function (reducer, preloadedState) {
      function cache(state, action) {
        if (action.type === 'R2_CACHE_ROLLBACK') {
          return _objectSpread2({}, state, {}, action.cacheData);
        }

        return reducer(state, action);
      }

      var store = createStore(cache, preloadedState);
      var hasWindow = !!window;
      var sStorage = sessionStorage;

      if (sStorage && hasWindow) {
        /* 还原 */
        var cacheData = sStorage.getItem(cacheKey);

        if (cacheData) {
          cacheData = JSON.parse(cacheData);

          if (Object.prototype.toString.call(cacheData) === '[object Object]') {
            store.dispatch({
              type: 'R2_CACHE_ROLLBACK',
              cacheData: cacheData
            });
          }
        }
        /* 缓存 */


        window.addEventListener('beforeunload', function () {
          var state = store.getState();

          if (includes.length > 0) {
            Object.entries(state).forEach(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 1),
                  key = _ref2[0];

              if (!includes.includes(key)) {
                delete state[key];
              }
            });
          }

          sStorage.setItem(cacheKey, JSON.stringify(state));
        });
      }

      return store;
    };
  };
};

/**
 * 创建store
 * <S>: 整个state树的类型
 * */

var createStoreEnhance = function createStoreEnhance(_ref) {
  var models = _ref.models,
      initState = _ref.initState,
      enhancer = _ref.enhancer;

  /* 根据models合成初始state */
  var state = modelsFormat(models);

  function App() {
    var rootState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state;
    return rootState;
  }
  /* ======== 在包含devtool的环境开启devtool支持 ======== */


  var composeEnhancers = redux.compose;
  var enhances = null;

  if (process.env.NODE_ENV === 'development' && window && // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    // @ts-ignore
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
  /* 添加内置的enhancer */


  var enhanceSpread = [redux.applyMiddleware(coreMiddleware), coreEnhance];

  if (enhancer) {
    enhanceSpread.push(enhancer);
  }

  enhances = composeEnhancers.apply(void 0, enhanceSpread);
  return redux.createStore(App, initState, enhances);
};

exports.default = createStoreEnhance;
exports.reduxCacheFactory = reduxCacheFactory;
