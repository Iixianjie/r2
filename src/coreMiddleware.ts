import {
  Dispatch, Store, Middleware
} from 'redux';
import { DispatchExt, Middleware2 } from './types';

/**
 * 此中间件帮助store.dispatch识别dispatch(reducerFn, action)以及dispatch(async effectFn, action)
 * 作为参数的函数应包含属性type(<namespace>.<reducer|effects>.<handleKey>), 如: user.effect.getUserInfo、user.reducer.setUserInfo
 * 需要确保一个能监听action.__fnReducer的reducer存在，当__fnReducer为true时，用action.__localState合并当前state
 * */
const coreMiddleware: Middleware2<DispatchExt> = (store) => (next) => (action: any, payload: any) => {
  const type = action.type;
  /* 普通action */
  if (!type) {
    next(action);
    return;
  }

  const [namespace, patchType] = type.split('.');
  const state = store.getState();
  const modelState = state[namespace];

  /* 函数reducer */
  if (patchType === 'reducer') {
    next({
      type: type, // 依赖于AppReducer进行处理
      __localState: { [namespace]: action(modelState, payload) },
      __fnReducer: true, // 标记为函数reducer
    });
    return;
  }

  /* 异步action */
  if (patchType === 'effects') {
    // 为action的开始和结束派发一个空的action，便于回滚和调试
    next({ type: `@@START: ${ type }` });

    const pending = action(payload, {
      dispatch: store.dispatch,
      getState: store.getState,
    });

    if (pending.finally) {
      pending.finally(() => {
        next({ type: `@@END: ${ type }` });
      });
    } else {
      console.warn('effect "@@END event" require Promise.prototype.finally');
    }
    return pending;
  }
  next(action);
};

export default coreMiddleware;
